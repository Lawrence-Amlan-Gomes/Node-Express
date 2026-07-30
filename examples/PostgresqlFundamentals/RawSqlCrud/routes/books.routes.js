// This is the books.routes.js file for the "RawSqlCrud" mini-project.
// What this file does: same real job as products.routes.js in
// "PostgresConnectionAndTypes" — it maps each real URL + method to the
// matching function in controllers/books.controller.js.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const {
  createBook, // The function that runs when a new book should be created
  listBooks, // The function that runs when every book should be listed
  getBook, // The function that runs when one book should be found by id
  updateBook, // The function that runs when one book should be changed
  deleteBook, // The function that runs when one book should be removed
  deleteAllBooks, // The function that runs when every book should be removed
} = require("../controllers/books.controller"); // Get these 6 real functions from the controller file

const router = Router(); // Create a real, empty router — server.js will mount this at "/books"

router.post("/", createBook); // When someone sends POST /books, run createBook
router.get("/", listBooks); // When someone visits GET /books, run listBooks
router.get("/:id", getBook); // When someone visits GET /books/123, run getBook with id 123
router.patch("/:id", updateBook); // When someone sends PATCH /books/123, run updateBook with id 123
router.delete("/:id", deleteBook); // When someone sends DELETE /books/123, run deleteBook with id 123
router.delete("/", deleteAllBooks); // When someone sends DELETE /books, run deleteAllBooks

module.exports = router; // Share this router so server.js can mount it
