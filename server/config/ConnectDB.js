const mongoose = require("mongoose");

const connectDB = () => {
  try {
    mongoose
      .connect(process.env.MONGO_URL)
      .then((res) => console.log("CONNECTED SUCCESSFULLY"))
      .catch((err) => {
        console.log(err, "Failed To Connect MONGODB");
      });
  } catch (error) {
    console.log(error, "MONGO DB Function");
  }
};

module.exports = connectDB;
