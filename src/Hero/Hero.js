import React, { useEffect, useState } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { withRouter } from "react-router-dom";
import MovieHub from "../Components/MovieHub";
import { BsSearch } from "react-icons/bs";
import "./Hero.css";
import logo from "../logo.png";

// const next_API =
//   "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=";
const popularShows_API =
  "https://api.themoviedb.org/3/movie/popular?api_key=44672c0063a3a75c6c66be8d2d0d43df&page=";
const search_API =
  "https://api.themoviedb.org/3/search/movie?&api_key=44672c0063a3a75c6c66be8d2d0d43df&query=";

function Hero(props) {
  const { selectedMovie, setSelectedMovie } = props;
  const [shows, setShows] = useState([]);
  const [changedValue, setChangedValue] = useState("");
  const [pages, setPages] = useState();
  const [loading, setLoading] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  Boolean(urlParams.get("page"));
  const myParam = urlParams.get("page") || 1;
  // getMovieByPage(myParam);

  // main API call..

  useEffect(() => {
    const getMovieByPage = async (API) => {
      await fetch(API)
        .then((res) => res.json())
        .then((data) => {
          setShows(data.results);
          setPages(data.page);
          props.history.push(`/discover/Popular?page=${myParam}`);
        });
      setLoading(true);
    };
    getMovieByPage(popularShows_API + myParam);
  }, [myParam]);

  // for Next and Previous Pages..
  const nextPage = pages + 1;
  const nextHandler = () => {
    fetch(popularShows_API + nextPage)
      .then((res) => res.json())
      .then((data) => {
        setShows(data.results);
        setPages(data.page);
        props.history.push(`/discover/Popular?page=${nextPage}`);
      });
  };
  const backPage = pages - 1;
  const backHandler = () => {
    fetch(popularShows_API + backPage)
      .then((res) => res.json())
      .then((data) => {
        setShows(data.results);
        setPages(data.page);
        props.history.push(`/discover/Popular?page=${backPage}`);
      });
  };

  //  Search Input ..

  const changeHandler = (e) => {
    setChangedValue(e.target.value);
  };

  const searchResult = () => {
    fetch(search_API + changedValue)
      .then((res) => res.json())
      .then((data) => {
        setShows(data.results);
      });
    setChangedValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      searchResult();
    }
  };
  return (
    <>
      <div>
        {loading ? (
          <body className="body">
            <div id="head">
              <div>
                <span className="head">POPULAR</span> <br />
                <span className="subhead">
                  {" "}
                  <img src={logo} className="_logo" />
                  MovieZoid
                </span>
              </div>
              <div>
                <input
                  placeholder="Search.."
                  type="search"
                  onKeyDown={(e) => onKeyDown(e)}
                  value={changedValue}
                  onChange={(e) => changeHandler(e)}
                />
                <BsSearch className="_searchIcon" />
              </div>
            </div>
            <div className="container">
              {shows && shows.length > 0 ? (
                shows.map((item) => (
                  <MovieHub
                    key={item.id}
                    movie={item}
                    selectedMovie={selectedMovie}
                    setSelectedMovie={setSelectedMovie}
                    loading={loading}
                    setLoading={setLoading}
                  />
                ))
              ) : (
                <div>Oops you got me! </div>
              )}
            </div>
            {shows.length > 0 && (
              <div className="footerButton">
                {pages > 1 && (
                  <span className="back">
                    <GrPrevious onClick={backHandler} />
                  </span>
                )}

                <span
                  className="next"
                  // onClick={() => props.history.push(`${nextHandler}`)}
                >
                  <GrNext onClick={nextHandler} />
                </span>
              </div>
            )}
          </body>
        ) : (
          <div id="spinnerBody">
            <div className="sk-cube-grid">
              <div className="sk-cube sk-cube1"></div>
              <div className="sk-cube sk-cube2"></div>
              <div className="sk-cube sk-cube3"></div>
              <div className="sk-cube sk-cube4"></div>
              <div className="sk-cube sk-cube5"></div>
              <div className="sk-cube sk-cube6"></div>
              <div className="sk-cube sk-cube7"></div>
              <div className="sk-cube sk-cube8"></div>
              <div className="sk-cube sk-cube9"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default withRouter(Hero);
