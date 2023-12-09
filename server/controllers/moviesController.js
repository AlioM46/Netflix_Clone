const axios = require("axios");
const MoviesModel = require("../models/MoviesModel.js");
const UsersModel = require("../models/UsersModel.js");
const GENRE_IDS = require("../../MovieApp/src/config/GENRE_IDS.json");
const UserModel = require("../models/UsersModel.js");

// #=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=
//
// const apiUrls = ["https://api.sampleapis.com/movies/animation"];
// const fetchMovie = async (url) => {
//   try {
//     const data = await axios.get(url);
//     let idsList = [];
//     for (let i = 0; i < data.data.length; i++) {
//       idsList.push(data?.data[i]?.imdbId);
//     }
//     return idsList;
//   } catch (error) {
//     console.log(`Error In FetchMovie 1`);
//   }
// };
// const fetchAllMovies = async (url) => {
//   try {
//     const responseDataArray = await Promise.all(
//       ["https://api.sampleapis.com/movies/comedy"].map(
//         async (url) => await fetchMovie(url)
//       )
//     );
//     const flattenedIds = responseDataArray.flat();
//     return await fetchAllMoviesFromImdbId(flattenedIds);
//   } catch (error) {
//     console.log(`Error InFETCH ALL MOVIES`);
//   }
// };

// const lastFilter = async (moviesList) => {
//   let movies = [];
//   for (let i = 0; i < moviesList.length; i++) {
//     const movieArray = {
//       backdropImage: moviesList[i][0]?.backdrop_path,
//       title: moviesList[i][0]?.title,
//       originalLanguage: moviesList[i][0]?.original_language,
//       overview: moviesList[i][0]?.overview,
//       releaseDate: moviesList[i][0]?.release_date,
//       voteAverage: moviesList[i][0]?.vote_average,
//       poster: moviesList[i][0]?.poster_path,
//       type: moviesList[i][0]?.media_type,
//       adult: moviesList[i][0]?.adult,
//       id: moviesList[i][0]?.id,
//       popularity: moviesList[i][0]?.popularity,
//       genreList: [],
//     };

//     if (GENRE_IDS && GENRE_IDS.genres) {
//       Object.entries(GENRE_IDS.genres).map(([key, value]) => {
//         if (moviesList[i][0]?.genre_ids.includes(value.id)) {
//           movieArray.genreList.push(value.name);
//         }
//       });
//     } else {
//       console.error("GENRE_IDS or its genres property is undefined.");
//     }

//     movies.push(movieArray);
//   }

//   return movies;
// };

// const fetchAllMoviesFromImdbId = async (ids) => {
//   try {
//     const allData = await Promise.all(
//       ids.map(async (id) => {
//         const url = `https://api.themoviedb.org/3/find/${id}?external_source=imdb_id`;
//         const options = {
//           method: "GET",
//           headers: {
//             accept: "application/json",
//             Authorization:
//               "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NWI1NTBkZThjMzUzM2UyOWRlOGRmZDUzNTdmYmE3ZiIsInN1YiI6IjY1NjNhMjYzYTZjMTA0MDBhY2E4NjRjZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AuQZijH2yem75Mn3stpkLroM3HNHzv-7dsin1prXoeo",
//           },
//         };
//         const data = await axios.get(url, options);
//         const result = await data.data.movie_results;
//         return result;
//       })
//     );
//     return await lastFilter(allData);
//     // return allData;
//   } catch (error) {
//     console.log(`Error In FilterIds IMDB ${error.message}`);
//   }
// };
//
// #=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=
const getMovies = async (req, res) => {
  try {
    const movies = await MoviesModel.find();
    if (!movies) {
      return res.status(404).json({message: "There's No Movies Right Now!"});
    }

    return res
      .status(200)
      .json({message: "Movies Find Successfully", data: movies});
  } catch (error) {
    return res
      .status(400)
      .json({message: "Some Error Happen ): Try Again Later."});
  }
};

const uploadMovie = async (req, res) => {
  const {
    title,
    lang,
    year,
    hours,
    poster,
    imageTitle,
    movieDesc,
    vidUrl,
    categories,
  } = req.body;

  if (
    !title ||
    !lang ||
    !year ||
    !hours ||
    !poster ||
    !imageTitle ||
    !movieDesc ||
    !vidUrl ||
    !categories
  ) {
    return res.status(400).json({message: "All Fields Are Required!"});
  }

  const newMovie = new MoviesModel({
    title,
    uploadMovie: lang,
    releaseDate: year,
    hours,
    poster,
    backdropImage: imageTitle,
    overview: movieDesc,
    videoUrl: vidUrl,
    genreList: categories,
    popularity: 0,
    voteAverage: 0,
  });

  await newMovie.save();

  return res.status(201).json({message: "Movie Add Successfully."});
};

const deleteMovie = async (req, res) => {
  const {movieId} = req.params;

  try {
    if (!movieId) {
      return res.status(400).json({message: "Movie Id Is Required."});
    }

    const movie = MoviesModel.findById(movieId);
    if (!movie) {
      return res.status(400).json({message: "Movie Is Not Exist."});
    }

    await movie.deleteOne();
    return res.status(200).json({message: "Movie Deleted Successfully."});
  } catch (error) {
    return res.status(500).json({message: error?.message});
  }
};

const ToggleSaveMovie = async (req, res) => {
  const {userId, movieId} = req.body;
  try {
    if (!userId || !movieId) {
      return res.status(400).json({message: "Please Login To Save The Movie."});
    }

    const user = await UsersModel.findById(userId);
    const movie = await MoviesModel.findById(movieId);

    if (!user || !movie) {
      return res.status(400).json({message: "There's No User Or Movie Exist."});
    }

    if (user.favoritesMovies.includes(movieId)) {
      const indexOfMovie = user.favoritesMovies.indexOf(movieId);
      user.favoritesMovies.splice(indexOfMovie, 1);
      await user.save();
      return res.status(200).json({message: "Movie Delete Successfully."});
    } else {
      user.favoritesMovies.push(movieId);
      await user.save();
      return res.status(200).json({message: "Movie Added Successfully."});
    }
  } catch (error) {
    return res.status(500).json({message: error?.message});
  }
};

const getFavoritesMovies = async (req, res) => {
  const {id} = req.params;

  try {
    if (!id) {
      return res.status(400).json({message: "Login please."});
    }

    const user = await UserModel.findById(id);

    const allMovies = await MoviesModel.find({
      _id: {$in: user.favoritesMovies},
    });

    if (!allMovies) {
      return res.status(400).json({message: "NO Favorites Movies!"});
    }
    return res
      .status(200)
      .json({message: "Movies Found Successful!", movies: allMovies});
  } catch (error) {
    return res.status(500).json({message: error});
  }
};

module.exports = {
  getMovies,
  uploadMovie,
  ToggleSaveMovie,
  deleteMovie,
  getFavoritesMovies,
};
