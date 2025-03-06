const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
const getAllBooks = new Promise((revolve, reject) => {
  try{
    revolve(books);
  } catch(error){
    reject(error);
  }
});
// API Get all book by ptomises
public_users.get('/async/',function (req, res) {
  //Write your code here
  // res.send(JSON.stringify(books, null, 4));
  getAllBooks.then((data) => {
      return res.status(200).send(JSON.stringify(data, null, 4));
  });
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));

  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book  by isbn in the shop
function getBookByISBN(isbn){
  if(isbn){
    return books[isbn];
  }else{
    return null;
  }
};
// Get book details based on ISBN
public_users.get('/isbn/async/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = await getBookByISBN(isbn);
  if(book){
    res.status(200).send(JSON.stringify(book, null, 4));
  }else{
    res.send(`Not found book with ISBN: ${isbn}`);
  }
 });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn){
    let existBook = books[isbn];
    if(existBook){
      res.send(existBook);
    }else{
      res.send(`Not found book with ISBN: ${isbn}`);
    }
  }else{
    res.send("Please input ISBN to find book");
  }
 });

 // Get book details based on author
public_users.get('/author/async/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  axios.get(`${req.protocol}:${req.headers.host}/author/${author}`)
    .then(result => {
      res.send(JSON.stringify(result.data, null, 4));
    })
    .catch(error => {
      res.send(error);
    })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  if(author){
    let res_books = {};
    for(const [key, value] of Object.entries(books)){
      if(author === value.author){
        res_books[key] = value;
      }
    }
    if(Object.keys(res_books).length > 0){
      res.send(JSON.stringify(res_books, null, 4));
    }else{
      res.send(`Not found books with author: ${author}`);
    }
    
  }else{
    res.send("Please input author to find book");
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on title
public_users.get('/title/async/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  axios.get(`${req.protocol}:${req.headers.host}/title/${title}`)
    .then(result => {
      res.send(JSON.stringify(result.data, null, 4));
    })
    .catch(error => {
      res.send(error);
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  if(title){
    let res_books = {};
    Object.entries(books).forEach(([key, value]) => {
      if(value.title === title){
        res_books[key] = value;
      }
    })
    if(Object.keys(res_books).length > 0){
      res.send(JSON.stringify(res_books, null, 4));
    }else{
      res.send(`Not found books with title: ${title}`);
    }
    
  }else{
    res.send("Please input title to find book");
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn){
    let existBook = books[isbn];
    if(existBook){
      res.send(JSON.stringify(existBook.reviews, null, 4));
    }else{
      res.send(`Not found book with ISBN: ${isbn}`);
    }
  }else{
    res.send("Please input ISBN to get book review");
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
