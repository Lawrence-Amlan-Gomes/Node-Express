// This is the movies.routes.js file for the "FilteringSortingBasics"
// mini-project. What this file does: it maps each real URL + method to
// the matching function in controllers/movies.controller.js. No database
// code lives in this file at all.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const {
  createMovie, // The function that runs when a new movie should be created
  listMovies, // The function that runs when movies should be listed, filtered, sorted, and paginated
  deleteAllMovies, // The function that runs when every movie should be deleted
} = require("../controllers/movies.controller"); // Get these 3 real functions from the controller file

const router = Router(); // Create a real, empty router — server.js will mount this at "/movies"

router.post("/", createMovie); // When someone sends POST /movies, run createMovie
router.get("/", listMovies); // When someone visits GET /movies, run listMovies
router.delete("/", deleteAllMovies); // When someone sends DELETE /movies, run deleteAllMovies

module.exports = router; // Share this router so server.js can mount it
