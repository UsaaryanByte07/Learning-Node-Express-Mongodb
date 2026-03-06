const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
require("dotenv").config();

// Load .env file from current directory

const user = encodeURIComponent(process.env.DB_USER); //To encode any special chars present in the user which can't be directly passed in to MongoClient.connect
const password = encodeURIComponent(process.env.DB_PASSWORD); //To encode any special chars present in the password which can't be directly passed in to MongoClient.connect

// Do NOT encode the cluster address or app name
const clusterAddress = process.env.DB_CLUSTER_ADDRESS;
const appName = process.env.DB_APP_NAME;
const collectionName = process.env.DB_COLLECTION_NAME;
const url = `mongodb+srv://${user}:${password}@${clusterAddress}/${collectionName}?appName=${appName}`;

const sessionStore = new MongoDbStore(
  {
    uri: url,
    collection: "sessions",
  },
  function (error) {
    if (error) {
      console.log('MongoDB session store error:', error);
    } else {
      console.log('MongoDB session store connected successfully');
    }
  },
);
const rootDir = require("./utils/path-util");
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

const notFoundRouter = require("./routers/notFoundRouter");
const { hostRouter } = require("./routers/hostRouter");
const storeRouter = require("./routers/storeRouter");
const { authRouter } = require("./routers/authRouter");

app.use(express.static(path.join(rootDir, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
/**
 * ===============================
 * EXPRESS SESSION CONFIGURATION
 * ===============================
 */

/**
 * Main Session Attributes:
 * 
 * secret: 
 *   - A string used to digitally sign the session ID cookie
 *   - Prevents malicious users from tampering with the session ID on the client side
 *   - Should be a strong, randomly generated string stored securely in environment variables
 * 
 * resave: 
 *   - Determines whether the session should be forced to save back to the session store 
 *     on every request, even if the session data was never modified during that request
 *   - Setting to false is generally recommended to optimize performance and avoid race conditions
 * 
 * saveUninitialized: 
 *   - Forces a session that is "uninitialized" to be saved to the store
 *   - A session is uninitialized when it is created but not yet modified
 *   - Setting to false is useful for:
 *     • Implementing login sessions (only save session after user logs in)
 *     • Reducing server storage usage
 *     • Complying with cookie consent laws
 */

/**
 * Cookie Configuration:
 * 
 * path: 
 *   - Determines the URL path for which the cookie is valid
 *   - Set to "/" to make the cookie available for the entire site
 * 
 * httpOnly: 
 *   - Vital security feature that prevents client-side JavaScript access to the cookie
 *   - Helps mitigate Cross-Site Scripting (XSS) attacks
 * 
 * secure: 
 *   - When true, the browser only sends the cookie over encrypted HTTPS connections
 *   - Should be set to true in production with HTTPS
 * 
 * maxAge: 
 *   - Sets the expiration time for the cookie in milliseconds
 *   - Current setting: 60000 * 60 * 24 * 15 = 15 days
 */
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

app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
});
app.use("/login", (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  }
  next();
});
app.use("/host", hostRouter);
app.use(authRouter);
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
