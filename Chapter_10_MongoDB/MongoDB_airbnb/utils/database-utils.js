const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const path = require("path");

// __dirname points directly to the 'utils' folder.
// '../.env' moves one level up to 'MongoDB_airbnb' and targets the file.
const envPath = path.resolve(__dirname, '../.env'); 
require("dotenv").config({ path: envPath }); // Loads the variables from the .env file

const user = encodeURIComponent(process.env.DB_USER); //To encode any special chars present in the user which can't be directly passed in to MongoClient.connect 
const password = encodeURIComponent(process.env.DB_PASSWORD); //To encode any special chars present in the password which can't be directly passed in to MongoClient.connect 

// Do NOT encode the cluster address or app name
const clusterAddress = process.env.DB_CLUSTER_ADDRESS; 
const appName = process.env.DB_APP_NAME;
const url = `mongodb+srv://${user}:${password}@${clusterAddress}/?appName=${appName}`;

let _db;

const mongoConnect = async () => {
  try {
    _db = (await MongoClient.connect(url)).db('airbnb');
  } catch (err) {
    console.log('Error While Connecting to MongoDB',err.message);
  }
};

const getDb = () =>{
    if(!_db){
        throw new Error('Could Not Connect to Database')
    }
    return _db;
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
