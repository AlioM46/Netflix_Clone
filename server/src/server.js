const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const connectDB = require("../config/ConnectDB.js");
const corsOptions = require("../config/corsOptions.js");
require("dotenv").config();

connectDB();
// app.use(cors(corsOptions));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://netflix-copy.onrender.com",
      "https://netflix-clone-client-delta.vercel.app",
      "https://netflix-clone-hn3x.onrender.com",
    ],
    credentials: true,
  })
);
// app.use(express.json());
app.use(express.json({limit: "20mb"}));
app.use(express.urlencoded({extended: true, limit: "20mb"}));

app.use(cookieParser());

// Routes

app.use("/movies", require("../Routes/moviesRoute.js"));
app.use("/users", require("../Routes/usersRoute.js"));
app.use("/auth", require("../Routes/authRoutes.js"));

app.listen(process.env.PORT, () => {
  console.log("SERVER START");
});
