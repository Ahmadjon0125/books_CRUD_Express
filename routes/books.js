const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const booksPath = path.join(__dirname, '../data/books.json');

let books; 

fs.readFile(booksPath, "utf8", (err, data) => {
    if (err) {
        console.error("Fayl o'qishda xato:", err);
        return;
    }
    books = JSON.parse(data);
});

//delete a book by id
router.delete('/books/:id', (req,res) => {
    const book = books.find(book => book.id === parseInt(req.params.id));
    if (!book) {
        res.status(404).send('kitob topilmadi');
    }
    books = books.filter(book => book.id !== parseInt(req.params.id));
    fs.writeFile(booksPath, JSON.stringify(books, null, 2), (err) => {
        if (err) {
            console.error("Fayl yozishda xato:", err);
            return;
        }
        res.send("kitob o'chirildi");
        return
    });
})

//put a book by id
router.put('/books/:id', (req,res) => {
    const {title, author} = req.body;
    
    const book = books.find(book => book.id === parseInt(req.params.id));
    if (!book) {
        res.status(404).send('kitob topilmadi');
    }
    if(title) {
        book.title = title;
    }
    if(author) {
        book.author = author;
    }

    fs.writeFile(booksPath, JSON.stringify(books, null, 2), (err) => {
        if (err) {
            console.error("Fayl yozishda xato:", err);
            return;
        }
        res.send(book);
        return
    });
})


// add a new book
router.post('/books', (req,res) => {
    const {title, author} = req.body;
    if (!title || !author) {
        res.status(400).send('title va author bolishi kerak');
    }
    const excistingBook = books.find(book => book.title === title);
    if (excistingBook) {
       return res.status(400).send('bu kitob bazada bor');
    }
    const newBook = {
        id: books.length ? books[books.length - 1].id + 1 : 1,
        title,
        author
    }
    books.push(newBook);
    fs.writeFile(booksPath, JSON.stringify(books, null, 2), (err) => {
        if (err) {
            console.error("Fayl yozishda xato:", err);
            return;
        }
        res.send(newBook);
    });
})

// get a book by id
router.get('/books/:id', (req,res) => {
    const book = books.find(book => book.id === parseInt(req.params.id));
    if (!book) {
        res.status(404).send('kitob topilmadi');
    }
    res.send(book);
})


// get all books
router.get('/books', (req,res) => {
    res.send(books);
})

module.exports = router;