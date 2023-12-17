require("dotenv").config();

const corsOptions = {
  origin: [process.env.FRONT_END_URL, "http://localhost:5000"],
  credentials: true,
};

module.exports = corsOptions;
