const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}
 

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    // Map the data and associate owner with each listing
    const dataWithOwner = initData.data.map((obj) => ({
      ...obj, 
      owner3: "674de0703c203f99ccf38f0d", 
    }));
    // Insert the modified data into the database
    const result = await Listing.insertMany(dataWithOwner);
    console.log("Data inserted successfully:", result);
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};

initDB();  

