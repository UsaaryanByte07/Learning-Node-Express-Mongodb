const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require('mongoose');

const rootDir = require("./utils/path-util");
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

const notFoundRouter = require("./routers/notFoundRouter");
const { hostRouter } = require("./routers/hostRouter");
const storeRouter = require("./routers/storeRouter");

app.use(express.static(path.join(rootDir, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(storeRouter);
app.use("/host", hostRouter);
app.use(notFoundRouter);

const PORT = 3010;

// Load .env file from current directory  
require("dotenv").config();

const user = encodeURIComponent(process.env.DB_USER); //To encode any special chars present in the user which can't be directly passed in to MongoClient.connect 
const password = encodeURIComponent(process.env.DB_PASSWORD); //To encode any special chars present in the password which can't be directly passed in to MongoClient.connect 

// Do NOT encode the cluster address or app name
const clusterAddress = process.env.DB_CLUSTER_ADDRESS; 
const appName = process.env.DB_APP_NAME;
const collectionName = process.env.DB_COLLECTION_NAME;
const url = `mongodb+srv://${user}:${password}@${clusterAddress}/${collectionName}?appName=${appName}`;

async function startServer() {
  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB successfully!');
    
    app.listen(PORT, () => {
      console.log(`Server is running on PORT:http://localhost:${PORT}`);
    });
  } catch(err) {
    console.log('Unable to connect to Database:', err.message);
    process.exit(1); // Exit the process if DB connection fails
  }
}

startServer();
