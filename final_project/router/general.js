const express = require("express");
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
//   return res.json(books);
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
//   if (ret_books.length === 0) {
//     return res.status(404).json({ message: "Author not found" });
//   }
//   return res.json(ret_books);
// });

// // Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   const titleParam = req.params.title.toLowerCase();
//   ret_books = Object.entries(books)
//     .filter(([_, book]) => book.title.toLowerCase().includes(titleParam))
//     .map(([id, book]) => ({ id, ...book }));
//   if (ret_books.length === 0) {
//     return res.status(404).json({ message: "Title not found" });
//   }
//   return res.json(ret_books);
// });

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const getBooksPromise = new Promise((resolve, reject) => {
    try {
      resolve(books);
    } catch (error) {
      reject(error);
    }
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
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;

    const getBookByISBN = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    });

    const book = await getBookByISBN;
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const authorParam = req.params.author.toLowerCase();

    const getBooksByAuthor = new Promise((resolve, reject) => {
      const ret_books = Object.entries(books)
        .filter(([_, book]) => book.author.toLowerCase().includes(authorParam))
        .map(([id, book]) => ({ id, ...book }));

      if (ret_books.length > 0) {
        resolve(ret_books);
      } else {
        reject(new Error("Author not found"));
      }
    });

    const booksByAuthor = await getBooksByAuthor;
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: "Author not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const titleParam = req.params.title.toLowerCase();

    const getBooksByTitle = new Promise((resolve, reject) => {
      const ret_books = Object.entries(books)
        .filter(([_, book]) => book.title.toLowerCase().includes(titleParam))
        .map(([id, book]) => ({ id, ...book }));

      if (ret_books.length > 0) {
        resolve(ret_books);
      } else {
        reject(new Error("Title not found"));
      }
    });

    const booksByTitle = await getBooksByTitle;
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({ message: "Title not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  return res.json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
