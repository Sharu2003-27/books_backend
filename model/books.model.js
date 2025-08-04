const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    publishedYear: Number,
    genre: [{
        type: String,
    }],
    language: String,
    country: String,
    rating: Number,
    summary: String
})

const Book = mongoose.model("Book", bookSchema)

module.exports = Book