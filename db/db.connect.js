const { error } = require("console")
const mongoose = require("mongoose")
require("dotenv").config()

const mongoUri = process.env.MONGODB

async function intializeDatabase() {
    await mongoose
    .connect(mongoUri)
    .then(() => console.log("Database connected successfully."))
    .catch((error) => console.log("An error occured while connecting database.", error))
}

module.exports = { intializeDatabase }