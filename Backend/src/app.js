const express = require("express");
//  we will be using cookies to store the token, so we need to use cookie-parser middleware
const cookieParser = require("cookie-parser");
const cors = require("cors");

// server instance
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


// require all the routes here
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes")

// we are using all the routes here
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;