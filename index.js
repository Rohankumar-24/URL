const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser"); // Correct spelling and single import
const { connectToMongoDB } = require("./connection");
const {checkForAuthentication,restrictTo} = require("./middlewares/auth");

const URL = require("./models/url");

// Routes
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); //  Load cookie parser before using cookies
app.use(checkForAuthentication);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Routes

app.use("/url",restrictTo(["NORMAL"]), urlRoute);  //  Protected URL route
app.use("/user", userRoute);                            // User auth route
app.use("/", staticRoute);                              // Static/public routes

// For testing: show all URLs
app.get("/test", async (req, res) => {
  try {
    const allUrls = await URL.find({});
    return res.render("home", { urls: allUrls });
  } catch (err) {
    return res.status(500).send("Error fetching URLs");
  }
});

// Redirect route for shortened URLs
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: { timestamp: Date.now() },
        },
      }
    );

    if (!entry) {
      return res.status(404).send("Short URL not found");
    }

    return res.redirect(entry.redirectURL);
  } catch (err) {
    return res.status(500).send("Server error during redirect");
  }
});

// Connect to MongoDB and start the server
connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
