import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Spinner from "../../components/spinner/Spinner";
import {useGetMoviesQuery} from "../../features/movies/moviesApiSlice";
import {
  selectAllMovies,
  selectPopularMovies,
  selectRatedMovies,
  setMovies,
  sortOnPopularity,
  sortOnVote,
} from "../../features/movies/moviesSlice";
import {Download, Header, Popular, Rated} from "../index";
import "./home.css";
const Home = () => {
  const PopularMovies = useSelector(selectPopularMovies);
  const RatedMovies = useSelector(selectRatedMovies);

  return (
    <div className="home ">
      <Header movies={PopularMovies} />
      <Popular movies={PopularMovies} />
      <Download />
      <Rated movies={RatedMovies} />
    </div>
  );
};

export default Home;
