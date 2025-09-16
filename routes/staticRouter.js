const express = require("express");
const URL = require("../models/url");
const { restrictTo } = require("../middlewares/auth"); //  Proper import

const router = express.Router();

router.get("/admin/urls",restrictTo(["ADMIN"]), async (req, res) => {
  try {
    const allurls = await URL.find({});
    return res.render("home", {urls: allurls});
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return res.status(500).send("Internal Server Error");
  }
});


// Protected route: only accessible by users with "NORMAL" role
router.get("/", restrictTo(["NORMAL","ADMIN"]), async (req, res) => {
  try {
    const allurls = await URL.find({ createdBy: req.user._id });
    return res.render("home", { urls: allurls });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Public routes
router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

module.exports = router;
