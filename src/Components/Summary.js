import React, { useEffect, useState } from "react";
import "./Summary.css";
import StarRatings from "../../node_modules/react-star-ratings";
import DefaultImg from "./DefaultImg.svg";
import { withRouter } from "react-router-dom";
import Neon from "./Neon.svg";
import ScrollToTop from "../ScrollToTop";
function Summary(props) {
  const { selectedMovie } = props;
  const PosterPath = "https://image.tmdb.org/t/p/w500/";
  const backDrop = PosterPath + selectedMovie.backdrop_path;
  const date = new Date(`${selectedMovie.release_date}`);
  const year = date.getFullYear();

  return (
    <>
      <ScrollToTop />

      {selectedMovie ? (
        <div>
          <img
            src={selectedMovie.backdrop_path ? backDrop : Neon}
            alt={selectedMovie.title}
            className="_overlay"
          />
          <div className="_body">
            <div>
              {" "}
              <img
                src={
                  selectedMovie.poster_path
                    ? PosterPath + selectedMovie.poster_path
                    : DefaultImg
                }
                alt={selectedMovie.title}
                className="_posterPath"
              />
            </div>

            <div className="_container">
              {" "}
              <div className="_title">{selectedMovie.title}</div>
              <div className="_subhead">{selectedMovie.tagline}</div>
              <div>
                <div className="_rating">
                  <span className="_voteAvg ">
                    <StarRatings
                      rating={selectedMovie.vote_average / 2}
                      starDimension="18px"
                      starSpacing="0px"
                      starRatedColor="orange"
                      className="_starRating"
                    />
                    <span>{selectedMovie.vote_average}</span>
                  </span>
                  <span className="_language">
                    {selectedMovie.original_language} /{" "}
                    {selectedMovie.runtime === 0 || !selectedMovie.runtime
                      ? "151 mins"
                      : `${selectedMovie.runtime} mins`}{" "}
                    / {year}
                  </span>
                </div>
              </div>
              <div className="_subhead">THE SYNOPSIS</div>
              <div className="_overview">{selectedMovie.overview}</div>
              <div className="_subhead">THE CAST</div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2>oops you got me!</h2>
        </div>
      )}
    </>
  );
}

export default withRouter(Summary);
