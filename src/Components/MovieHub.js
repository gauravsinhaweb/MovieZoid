import React from "react";
import "./MovieHub.css";
import { withRouter } from "react-router-dom";
import DefaultImg from "./DefaultImg.svg";

const MovieHub = (props) => {
  const { movie, setSelectedMovie } = props;
  let movieId = movie.id;

  const urlParams = new URLSearchParams(window.location.pathname);
  Boolean(urlParams.get("id"));
  let id = urlParams.get("id") || movieId;

  const PosterPath = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  const handleClickMovie = () => {
    setSelectedMovie(movie);
    props.history.push(`/Movie/${id}`);
    console.log(id);
  };

  // const urlParams = new URLSearchParams(window.location.search);
  // const myParam = urlParams.get("page");
  // console.log(myParam);

  return (
    <>
      {movie ? (
        <div>
          <div className="shows">
            <img
              src={movie.poster_path ? PosterPath : DefaultImg}
              alt={movie.title}
              onClick={() => handleClickMovie()}
            />
            <div className="caption">{movie.title}</div>
          </div>
        </div>
      ) : (
        <h3 className="sorry">oops!</h3>
      )}
    </>
  );
};

export default withRouter(MovieHub);
