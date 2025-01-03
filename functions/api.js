const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const serverless = require("serverless-http");

//configure dotenv
dotenv.config();

//rest Object
const app = express();
const router = express.Router();

const corsOptions = {
  origin: "http://localhost:5173", // Front-end URL
  credentials: true, // Allow cookies to be sent and received
};

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(morgan("dev"));

// router.get("/", (req, res) => {
//   res.json({
//     name: "gaju",
//   });
// });

app.use("/.netlify/functions/api", router);
//Routes
app.use(
  "/.netlify/functions/api/v1/student",
  require("./routes/studentsRoute.js")
);
app.use("/.netlify/functions/api/v1/auth", require("./routes/authRout.js"));

//PORT
// const PORT = process.env.PORT || 8080;

// app.listen(PORT, () => {
//   console.log(`Server running on PORT ${PORT}`.white.bgMagenta);
// });

module.exports.handler = serverless(app);

// [[redirects]]
//   to="/.netlify/functions/api/:splat"
//   from:"/*"
//   status= 200
