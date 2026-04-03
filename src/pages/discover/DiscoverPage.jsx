import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FaChevronRight, FaChevronLeft, FaArrowRight } from "react-icons/fa";
import { Link, useHistory, useLocation } from "react-router-dom";
import MovieCard from "../../components/movie-card/MovieCard";
import { BsSearch } from "react-icons/bs";
import "./DiscoverPage.css";
import premium from "../../assets/premium.png";
import { genresMovieListUrl } from "../../lib/tmdb";
import {
  parseBrowseRoute,
  movieListUrlFromBrowse,
  discoverListHeading,
  browsePathForKind,
  searchQueryString,
} from "../../lib/browseRoutes";
import DiscoverBrowseBar from "./DiscoverBrowseBar";

function DiscoverPage() {
  const history = useHistory();
  const location = useLocation();

  const [shows, setShows] = useState([]);
  const [changedValue, setChangedValue] = useState("");
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bootDone, setBootDone] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [genres, setGenres] = useState([]);

  const { q, kind, gid } = useMemo(
    () => parseBrowseRoute(location.pathname, location.search),
    [location.pathname, location.search]
  );

  const genreNamesById = useMemo(() => {
    const m = {};
    genres.forEach((g) => {
      m[String(g.id)] = g.name;
    });
    return m;
  }, [genres]);

  const listHeading = useMemo(
    () =>
      discoverListHeading(
        location.pathname,
        location.search,
        genreNamesById
      ),
    [location.pathname, location.search, genreNamesById]
  );

  useEffect(() => {
    if (location.pathname !== "/search") return;
    const parsed = parseBrowseRoute(location.pathname, location.search);
    if (!parsed.q) {
      history.replace("/browse/popular");
    }
  }, [location.pathname, location.search, history]);

  useEffect(() => {
    let cancelled = false;
    fetch(genresMovieListUrl())
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.genres) setGenres(data.genres);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setListLoading(true);
      try {
        const url = movieListUrlFromBrowse(
          location.pathname,
          location.search
        );
        const res = await fetch(url);
        const data = await res.json();
        if (cancelled) return;
        setShows(data.results || []);
        setPages(data.page || 1);
        setTotalPages(Math.max(1, data.total_pages || 1));
        setBootDone(true);
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search]);

  const goToPage = useCallback(
    (nextPage) => {
      const raw = location.search.startsWith("?")
        ? location.search.slice(1)
        : location.search;
      const p = new URLSearchParams(raw);
      p.set("page", String(nextPage));
      const qs = p.toString();
      history.replace({
        pathname: location.pathname,
        search: qs ? `?${qs}` : "",
      });
    },
    [history, location.pathname, location.search]
  );

  const navigateBrowse = useCallback(
    (nextKind, genreId = null) => {
      history.replace({
        pathname: browsePathForKind(nextKind, genreId),
        search: "",
      });
    },
    [history]
  );

  const nextPage = pages + 1;
  const nextHandler = () => goToPage(nextPage);
  const backPage = pages - 1;
  const backHandler = () => {
    if (backPage >= 1) goToPage(backPage);
  };

  const changeHandler = (e) => {
    setChangedValue(e.target.value);
  };

  const searchResult = () => {
    const term = changedValue.trim();
    if (!term) return;
    history.replace({
      pathname: "/search",
      search: searchQueryString(term, "1"),
    });
    setChangedValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      searchResult();
    }
  };

  const searchActive = Boolean(q);

  return (
    <div>
      {!bootDone ? (
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
      ) : (
        <div className="discover-body">
          <div id="head">
            <Link to="/browse/popular" style={{ textDecoration: "none" }}>
              <div>
                <span className="head">{listHeading}</span> <br />
                <span className="subhead">
                  MovieZoid
                  <img src={premium} className="premium" alt="" />
                </span>
              </div>
            </Link>
            <div className="discover-search-wrap">
              <div className="discover-search" role="search">
                <BsSearch className="discover-search__icon" aria-hidden />
                <input
                  id="discover-search-input"
                  className="discover-search__input"
                  type="search"
                  placeholder="Search movies"
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  onKeyDown={onKeyDown}
                  value={changedValue}
                  onChange={changeHandler}
                />
                <button
                  type="button"
                  className="discover-search__submit"
                  onClick={searchResult}
                  aria-label="Search"
                >
                  <FaArrowRight aria-hidden />
                </button>
              </div>
            </div>
          </div>
          <DiscoverBrowseBar
            genres={genres}
            activeKind={kind}
            activeGenreId={gid ? Number(gid) : null}
            searchActive={searchActive}
            onTab={(k) => navigateBrowse(k, null)}
            onGenre={(id) => navigateBrowse("genre", id)}
          />
          <div
            className={
              "container" + (listLoading ? " container--loading" : "")
            }
          >
            {shows && shows.length > 0 ? (
              shows.map((item) => <MovieCard key={item.id} movie={item} />)
            ) : (
              <div className="discover-empty">
                {listLoading ? "Loading…" : "No movies here."}
              </div>
            )}
          </div>

          {shows.length > 0 && pages < totalPages && (
            <div className="footerButton">
              {pages > 1 && (
                <span className="back">
                  <FaChevronLeft onClick={backHandler} />
                </span>
              )}

              <span className="next">
                <FaChevronRight onClick={nextHandler} />
              </span>
            </div>
          )}

          {shows.length > 0 && pages >= totalPages && pages > 1 && (
            <div className="footerButton">
              <span className="back">
                <FaChevronLeft onClick={backHandler} />
              </span>
            </div>
          )}

          <div className="copyright">Developed by Gaurav Sinha • 2021</div>
        </div>
      )}
    </div>
  );
}

export default DiscoverPage;
