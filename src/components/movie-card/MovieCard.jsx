import React from "react";
import { Link } from "react-router-dom";
import "./MovieCard.css";
import defaultPoster from "../../assets/default-poster.svg";
import { moviePath } from "../../lib/browseRoutes";

const MovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : defaultPoster;

  return (
    <div className="movie-card">
      <Link
        to={moviePath(movie.id, movie.title)}
        className="movie-card__link"
      >
        <img src={posterUrl} alt={movie.title} />
        <div className="movie-card__caption">{movie.title}</div>
      </Link>
    </div>
  );
};

export default MovieCard;
