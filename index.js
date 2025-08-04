const { intializeDatabase } = require("./db/db.connect")
const Book = require("./model/books.model")
const fs = require("fs")

const express = require("express")
const cors = require("cors");
const { json } = require("stream/consumers")
const { error } = require("console")    
const app = express()

app.use(express.json())
app.use(cors());
intializeDatabase()

const jsonData = fs.readFileSync("./books.json", "utf-8")
const booksData = JSON.parse(jsonData)

function seedData() {
    try { 
        for(const book of booksData){
          const newBookDetails = new Book ({
            title: book.title,
            author: book.author,
            publishedYear: book.publishedYear,
            genre: book.genre,
            language: book.language,
            country: book.country,
            rating: book.rating,
            summary: book.summary,
            coverImageUrl: book.coverImageUrl
          }) 
          newBookDetails.save()
        }
    } catch (error) {
        console.log("Error seeding the data.",error)
    }
}

// seedData()

app.get("/", (req, res) => {
    res.send("Hello, Welcome to Books Management.")
})

async function createNewBooks(data) {
    try {
        const newBooks = new Book(data)
        const saveData = await newBooks.save()
        return saveData
    } catch (error) {
         console.log("An error occured while creating new book data.", error)
    }
}

app.post("/books", async (req, res) => {
    try {
        const newBook = await createNewBooks(req.body)
        res.status(201).json({message: "Book created successfully.", book: newBook})
    } catch (error) {
        res.status(500).json({error: "Failed to create new books data."})
    }
})

app.get("/books", async (req, res) => {
    try {
        const allBooks = await Book.find()
        res.json(allBooks)
    } catch (error) {
        res.status(500).json({error: "Failed to fetch books data."})
    }
})

async function readBookByTitle(bookTitle) {
    try {
        const getBookByTitle = await Book.findOne({title: bookTitle})
        return getBookByTitle
    } catch (error) {
        throw error
    }
}

app.get("/books/:bookTitle", async (req, res) => {
    try {
        const titleOfBook = await readBookByTitle(req.params.bookTitle)
        if (titleOfBook != 0) {
            res.json(titleOfBook)
        } else {
            res.status(404).json({error: "Book not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to get book by Title."})
    }
})


async function readBookByAuthor(bookAuthor) {
    try {
        const author = await Book.find({author: bookAuthor})
        return author
    } catch (error) {
        throw error
    }
} 

app.get("/books/directory/:bookAuhtor", async(req, res) =>  {
    try {
        const authorOfBook = await readBookByAuthor(req.params.bookAuhtor)
        if (authorOfBook != 0) {
            res.json(authorOfBook)
        } else {
            res.status(404).json({error: "Book not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to get book by Author."})
    }
})

async function readbookByGenre(bookGenre) {
    try {
        const genreOfBook = await Book.find({genre: bookGenre})
        return genreOfBook
    } catch (error) {
        throw error
    }
}

app.get("/books/genres/:bookGenre", async (req, res) => {
    try {
        const genre = await readbookByGenre(req.params.bookGenre)
        if (genre != 0) {
            res.json(genre)
        } else {
            res.status(404).json({error: "Book not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to get book by genre."})
    }
})

async function readBookBypublishedYear(releseYear) {
    try {
        const publishYearOfBook = await Book.find({publishedYear: releseYear})
        return publishYearOfBook
    } catch (error) {
        throw error
    }
}

app.get("/books/publishedYears/:bookPublishedYear", async (req, res) => {
    try {
        const publishedYear = await readBookBypublishedYear(req.params.bookPublishedYear)
        if (publishedYear != 0) {
            res.json(publishedYear)
        } else {
            res.status(404).json({error: "Book not found."})
        } 
    } catch (error) {
        res.status(500).json({error: "Failed to get book by published year."})
    }
})

async function updateBookRatingById(bookId, dataToUpdate) {
    try {
        const updateRating = await Book.findByIdAndUpdate(bookId, dataToUpdate, {new: true})
        return updateRating
    } catch (error) {
        throw error
    }
}

app.post("/books/:bookId", async (req, res) => {
    try {
        const bookRating = await updateBookRatingById(req.params.bookId, req.body) 
        if (bookRating) {
            res.status(201).json({message: "Book rating updated successfully.", book: bookRating})
        } else {
            res.status(404).json({error: "Book does not exist."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to update rating."})
    }
})

async function updateBookByTitle(bookTitle, dataToUpdate) {
    try {
        const updateYearAndRating = await Book.findOneAndUpdate({title: bookTitle}, dataToUpdate, {new: true})
        return updateYearAndRating
    } catch (error) {
        throw error
    }
}

app.post("/books/title/:booktitle", async (req, res) => {
    try {
        const ratingAndYear = await updateBookByTitle(req.params.booktitle, req.body)
        if (ratingAndYear) {
            res.status(201).json({message: "Book data updated successfully.", book: ratingAndYear})
        } else {
            res.status(404).json({error: "Book does not exist."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to update year and rating."})
    }
})

async function deleteBookById(id) {
    try {
        const deleteBook = await Book.findByIdAndDelete(id)
        return deleteBook
    } catch (error) {
        throw error
    }
}

app.delete("/books/:bookId", async (req, res) => {
    try {
        const book = await deleteBookById(req.params.bookId)
        if (book) {
            res.status(201).json({message: "Book deleted successfully."})
        } else {
            res.status(404).json({error: "Book not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to delete book."})
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})