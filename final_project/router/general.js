const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered." });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  } else {
    return res.status(404).json({ message: "Unable to register user." });
  }
});

// // Get the book list available in the shop
// public_users.get("/", function (req, res) {
//   let bookObjs = { books: {} };
//   bookObjs.books = Object.keys(books).reduce((obj, key) => {
//     obj[key] = books[key];
//     return obj;
//   }, {});
//   return res.json(bookObjs);
// });

// // Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   return res.json(books[req.params.isbn]);
// });

// // Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   const authorParam = req.params.author.toLowerCase();
//   ret_books = Object.entries(books)
//     .filter(([_, book]) => book.author.toLowerCase().includes(authorParam))
//     .map(([id, book]) => ({ id, ...book }));

//   retBooksObj = { booksbyauthor: ret_books };
//   if (ret_books.length === 0) {
//     return res.status(404).json({ message: "Author not found" });
//   }
//   return res.json(retBooksObj);
// });

// // Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   const titleParam = req.params.title.toLowerCase();
//   ret_books = Object.entries(books)
//     .filter(([_, book]) => book.title.toLowerCase().includes(titleParam))
//     .map(([id, book]) => ({ id, ...book }));

//   retBooksObj = { booksbytitle: ret_books };
//   if (ret_books.length === 0) {
//     return res.status(404).json({ message: "Title not found" });
//   }
//   return res.json(retBooksObj);
// });

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const getBooksPromise = new Promise((resolve, reject) => {
    axios
      .get("http://localhost:5000/")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });

  getBooksPromise
    .then((booksList) => {
      return res.status(200).json(booksList);
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching book list." });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const promise = new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:5000/isbn/${isbn}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });

  promise
    .then((bookDetails) => {
      return res.status(200).json(bookDetails);
    })
    .catch((error) => {
      return res.status(404).json({ message: "Book not found" });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const promise = new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:5000/author/${author}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });

  promise
    .then((booksByAuthor) => {
      return res.status(200).json(booksByAuthor);
    })
    .catch((error) => {
      return res.status(404).json({ message: "Author not found" });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const promise = new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:5000/title/${title}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });

  promise
    .then((booksByTitle) => {
      return res.status(200).json(booksByTitle);
    })
    .catch((error) => {
      return res.status(404).json({ message: "Title not found" });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  return res.json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
