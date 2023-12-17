require("dotenv").config();

const corsOptions = {
  origin: process.env.FRONT_END_URL,
  credentials: true,
};

module.exports = corsOptions;
