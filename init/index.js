const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    throw new Error("Failed to connect to MongoDB: " + err.message);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'68ac5bc4c14933bc8112db50'}));
    await Listing.insertMany(initData.data);
    console.log("Inserted initial data");
}
initDB();