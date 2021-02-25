import React, { useEffect, useState } from "react";
import "./MovieHub.css";
import { withRouter } from "react-router-dom";
import DefaultImg from "./DefaultImg.svg";

const MovieHub = (props) => {
  const { movie, setSelectedMovie } = props;
  const [result, setResult] = useState("");

  let movieId = movie.id;
  const tagline_API = `https://api.themoviedb.org/3/movie/${movieId}?api_key=44672c0063a3a75c6c66be8d2d0d43df&append_to_response=videos`;

  const urlParams = new URLSearchParams(window.location.pathname);
  Boolean(urlParams.get("id"));
  let id = urlParams.get("id") || movieId;

  const PosterPath = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  const handleClickMovie = () => {
    setSelectedMovie(result);
    props.history.push(`/Movie/${id}`);
  };
  useEffect(() => {
    fetch(tagline_API)
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
      });
  }, []);
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
