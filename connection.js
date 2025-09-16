const mongoose = require("mongoose");

async function connectToMongoDB() {
  return mongoose.connect(
    "mongodb+srv://rohanbhagat6806_db_user:oAztbY9DjuQkjTOd@cluster0.759wxnu.mongodb.net/short-url",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
}

module.exports = {
  connectToMongoDB,
};
