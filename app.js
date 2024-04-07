const express = require("express");

const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const urlRoutes = require("./routes/urlRoutes");
const usersRoutes = require("./routes/usersRoutes");
const cookieParser = require("cookie-parser");
const Url = require("./models/urlSchema");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// cors setup
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// mongodb connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("DB CONNECTED SUCCESSFULLY!"));

// routing setup

app.use("/api/users", usersRoutes);
app.use("/api/urls", urlRoutes);

// URL Redirect

app.listen(process.env.APP_PORT, () => {
  console.log(`App listening on PORT ${process.env.APP_PORT}`);
});
