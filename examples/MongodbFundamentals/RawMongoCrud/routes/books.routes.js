// This is the books.routes.js file for the "RawMongoCrud" mini-project.
// What this file does: it maps each real URL + method to the matching
// function in controllers/books.controller.js. No database code lives in
// this file at all — this file only points requests to the right place.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const {
  createBook, // The function that runs when a new book should be created
  getBookById, // The function that runs when one specific book should be read
  listBooks, // The function that runs when every book should be listed
  updateBook, // The function that runs when a book should be updated
  deleteBook, // The function that runs when one specific book should be deleted
  deleteAllBooks, // The function that runs when every book should be deleted
} = require("../controllers/books.controller"); // Get these 6 real functions from the controller file

const router = Router(); // Create a real, empty router — server.js will mount this at "/books"

router.post("/", createBook); // When someone sends POST /books, run createBook
router.get("/:id", getBookById); // When someone visits GET /books/:id, run getBookById
router.get("/", listBooks); // When someone visits GET /books, run listBooks
router.patch("/:id", updateBook); // When someone sends PATCH /books/:id, run updateBook
router.delete("/:id", deleteBook); // When someone sends DELETE /books/:id, run deleteBook
router.delete("/", deleteAllBooks); // When someone sends DELETE /books, run deleteAllBooks

module.exports = router; // Share this router so server.js can mount it
