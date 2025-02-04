require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const List = require("../models/list.js");
const Users = require("../models/user.js");

const MONGO_URL = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await List.deleteMany({});
  await List.insertMany(initData.data);
  await Users.deleteMany({});
  await Users.insertMany(initData.user);
  console.log("data was initialized");
};

initDB();