// This is the movies.routes.js file for the "FilteringSortingBasics" mini-project.
// What this file does: same real job as products.routes.js in
// "PostgresConnectionAndTypes" — it maps each real URL + method to the
// matching function in controllers/movies.controller.js.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const { createMovie, listMovies, deleteAllMovies } = require("../controllers/movies.controller"); // Get these 3 real functions from the controller file

const router = Router(); // Create a real, empty router — server.js will mount this at "/movies"

router.post("/", createMovie); // When someone sends POST /movies, run createMovie
router.get("/", listMovies); // When someone visits GET /movies (with any real filter/sort/paging options), run listMovies
router.delete("/", deleteAllMovies); // When someone sends DELETE /movies, run deleteAllMovies

module.exports = router; // Share this router so server.js can mount it
