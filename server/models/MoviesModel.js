const {default: mongoose} = require("mongoose");
const mognoose = require("mongoose");

const moviesSchema = new mongoose.Schema({
  adult: String,
  backdropImage: String,
  movieId: Number,
  genreList: [String],
  originalLanguage: String,
  overview: String,
  popularity: Number,
  poster: String,
  releaseDate: String,
  title: String,
  type: String,
  voteAverage: String,
  videoUrl: String,
});

const MoviesModel = mongoose.model("movies", moviesSchema);

module.exports = MoviesModel;
