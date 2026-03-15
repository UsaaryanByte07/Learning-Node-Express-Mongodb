const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const { url } = require('./utils/db-util')
const flash = require('connect-flash') //used to store messages in session temporarily and auto-clear it after being read once.
const rootDir = require("./utils/path-util");
const { sessionStore } = require('./utils/session-util')
const multer = require('multer');
const {storage, uploadsDir, fileFilter} = require('./utils/photo-storage-util');
require("dotenv").config();

//Importing the Routers
const notFoundRouter = require("./routers/notFoundRouter");
const { hostRouter } = require("./routers/hostRouter");
const storeRouter = require("./routers/storeRouter");
const { authRouter } = require("./routers/authRouter");
const { legalRouter } = require("./routers/legalRouter");

const app = express();

//Setting the View Engine
app.set("view engine", "ejs");
app.set("views", "views");


app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads", express.static(uploadsDir));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ storage, fileFilter }).single("photo"));
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      path: "/",
      httpOnly: true,
      secure: false, // Set to true only in production with HTTPS
      maxAge: 60000 * 60 * 24 * 15, // 15 days
    },
  }),
);
app.use(flash());
app.use("/host", (req, res, next) => {
  if (!req.session.isLoggedIn || req.session.user.userType === 'customer') {
    return res.redirect("/");
  }
  next();
});
app.use("/homes", (req, res, next) => {
  if (!req.session.isLoggedIn || req.session.user.userType === 'host' ) {
    return res.redirect("/");
  }
  next();
});
app.use("/login", (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  }
  next();
});
app.use("/signup", (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  }
  next();
});
app.use("/wishlist", (req, res, next) => {
  if (!req.session.isLoggedIn || req.session.user.userType === 'host') {
    return res.redirect("/");
  }
  next();
})
app.use(storeRouter);
app.use("/host", hostRouter);
app.use(authRouter);
app.use(legalRouter);
app.use(notFoundRouter);

const PORT = 3010;

async function startServer() {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB successfully!");

    app.listen(PORT, () => {
      console.log(`Server is running on PORT:http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log("Unable to connect to Database:", err.message);
    process.exit(1); // Exit the process if DB connection fails
  }
}

startServer();