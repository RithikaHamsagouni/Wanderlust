const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MongoURL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("Connected Database");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MongoURL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"68cfbcf4ae0c6b8520aec16a"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();