const express = require("express");
const moviesController = require("../controllers/moviesController");
const MoviesModel = require("../models/MoviesModel");
const router = express.Router();

//
router
  .route("/")
  .get(moviesController.getMovies)
  .post(moviesController.uploadMovie);

router.post("/favorites", moviesController.ToggleSaveMovie);
router.delete("/:movieId", moviesController.deleteMovie);
router.get("/favoritesMovies/:id", moviesController.getFavoritesMovies);
module.exports = router;

router.get("/sortMongoose", async (req, res) => {
  const movies = await MoviesModel.find({});

  movies.map(async (item) => {
    item.videoUrl =
      "https://www.youtube.com/embed/DH8mZX06W6w?si=fikdcGU4n5FcdLhu";
    await item.save();
  });

  return res.status(movies);
});
