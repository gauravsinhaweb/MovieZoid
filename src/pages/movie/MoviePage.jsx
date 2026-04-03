import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams, useHistory, useLocation } from "react-router-dom";
import { FaShareAlt } from "react-icons/fa";
import StarRatings from "react-star-ratings";
import "./MoviePage.css";
import defaultPoster from "../../assets/default-poster.svg";
import neonBackdrop from "../../assets/neon-backdrop.svg";
import {
  movieDetailUrl,
  tmdbImage,
  pickYoutubeTrailerKey,
  formatUsd,
} from "../../lib/tmdb";
import {
  browsePathForKind,
  moviePath,
  movieAbsoluteUrl,
} from "../../lib/browseRoutes";

function MoviePage() {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [loadState, setLoadState] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    setMovie(null);
    (async () => {
      try {
        const res = await fetch(movieDetailUrl(id));
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        if (!cancelled) {
          setMovie(data);
          setLoadState("ok");
        }
      } catch {
        if (!cancelled) setLoadState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!movie) return;
    const canonical = moviePath(movie.id, movie.title);
    if (location.pathname !== canonical) {
      history.replace({ pathname: canonical, search: location.search });
    }
  }, [movie, location.pathname, location.search, history]);

  const handleShare = useCallback(async () => {
    if (!movie) return;
    const url = movieAbsoluteUrl(movie.id, movie.title);

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ url });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
      }
    }

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        return;
      }
    }
  }, [movie]);

  if (loadState === "loading") {
    return (
      <div className="movie-page movie-page--centered">
        <div className="movie-page__spinner">
          <div className="sk-cube-grid">
            <div className="sk-cube sk-cube1" />
            <div className="sk-cube sk-cube2" />
            <div className="sk-cube sk-cube3" />
            <div className="sk-cube sk-cube4" />
            <div className="sk-cube sk-cube5" />
            <div className="sk-cube sk-cube6" />
            <div className="sk-cube sk-cube7" />
            <div className="sk-cube sk-cube8" />
            <div className="sk-cube sk-cube9" />
          </div>
        </div>
      </div>
    );
  }

  if (loadState === "error" || !movie) {
    return (
      <div className="movie-page movie-page--centered movie-page--error">
        <p>Something went wrong.</p>
        <Link to={browsePathForKind("popular")}>Back to browse</Link>
      </div>
    );
  }

  const backdropSrc = movie.backdrop_path
    ? tmdbImage(movie.backdrop_path, "original")
    : neonBackdrop;
  const posterSrc = movie.poster_path
    ? tmdbImage(movie.poster_path, "w500")
    : defaultPoster;
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "—";
  const runtimeMins =
    movie.runtime && movie.runtime > 0 ? `${movie.runtime} mins` : "—";
  const trailerKey = pickYoutubeTrailerKey(movie.videos);
  const cast = (movie.credits?.cast || []).slice(0, 14);
  const budgetStr = formatUsd(movie.budget);
  const revenueStr = formatUsd(movie.revenue);
  const langs = (movie.spoken_languages || [])
    .map((l) => l.english_name || l.name)
    .filter(Boolean);
  const countries = (movie.production_countries || [])
    .map((c) => c.name)
    .filter(Boolean);

  return (
    <div className="movie-page">
      <img
        src={backdropSrc}
        alt=""
        className="movie-page__backdrop"
      />
      <div className="movie-page__toolbar">
        <Link to={browsePathForKind("popular")} className="movie-page__back">
          ← Browse
        </Link>
        <button
          type="button"
          className="movie-page__share"
          onClick={handleShare}
          aria-label={`Share ${movie.title}`}
        >
          <FaShareAlt aria-hidden />
          <span className="movie-page__share-label">Share</span>
        </button>
      </div>
      <div className="movie-page__body">
        <div className="movie-page__poster-wrap">
          <img
            src={posterSrc}
            alt={movie.title}
            className="movie-page__poster"
          />
        </div>
        <div className="movie-page__main">
          <h1 className="movie-page__title">{movie.title}</h1>
          {movie.tagline ? (
            <p className="movie-page__tagline">{movie.tagline}</p>
          ) : null}
          <div className="movie-page__rating-row">
            <span className="movie-page__stars">
              <StarRatings
                rating={movie.vote_average / 2}
                starDimension="18px"
                starSpacing="0px"
                starRatedColor="orange"
              />
              <span className="movie-page__vote-num">{movie.vote_average}</span>
              <span className="movie-page__vote-count">
                ({movie.vote_count?.toLocaleString?.() ?? movie.vote_count}{" "}
                votes)
              </span>
            </span>
            <div className="movie-page__meta-inline">
              {movie.original_language ? (
                <span className="movie-page__meta-item">
                  {movie.original_language.toUpperCase()}
                </span>
              ) : null}
              <span className="movie-page__meta-item">{runtimeMins}</span>
              <span className="movie-page__meta-item">{year}</span>
              {movie.status ? (
                <span className="movie-page__meta-item">{movie.status}</span>
              ) : null}
            </div>
          </div>
          {movie.genres?.length ? (
            <ul className="movie-page__genres">
              {movie.genres.map((g) => (
                <li key={g.id}>{g.name}</li>
              ))}
            </ul>
          ) : null}
          {(langs.length > 0 || countries.length > 0) && (
            <p className="movie-page__fineprint">
              {langs.length ? langs.join(" · ") : null}
              {langs.length && countries.length ? " · " : null}
              {countries.length ? countries.join(" · ") : null}
            </p>
          )}
          <h2 className="movie-page__section-label">Synopsis</h2>
          <p className="movie-page__overview">{movie.overview}</p>
          {trailerKey ? (
            <>
              <h2 className="movie-page__section-label">Trailer</h2>
              <div className="movie-page__embed">
                <iframe
                  title="Trailer"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </>
          ) : null}
          {cast.length > 0 ? (
            <>
              <h2 className="movie-page__section-label">Cast</h2>
              <div className="movie-page__cast">
                {cast.map((person) => (
                  <div key={person.credit_id || person.id} className="movie-page__cast-card">
                    <img
                      src={
                        person.profile_path
                          ? tmdbImage(person.profile_path, "w185")
                          : defaultPoster
                      }
                      alt={person.name}
                    />
                    <span className="movie-page__cast-name">{person.name}</span>
                    <span className="movie-page__cast-role">
                      {person.character}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : null}
          {movie.production_companies?.length ? (
            <>
              <h2 className="movie-page__section-label">Production</h2>
              <div className="movie-page__companies">
                {movie.production_companies.map((c) => (
                  <div key={c.id} className="movie-page__company">
                    {c.logo_path ? (
                      <img
                        src={tmdbImage(c.logo_path, "w92")}
                        alt={c.name}
                        className="movie-page__company-logo"
                      />
                    ) : (
                      <span className="movie-page__company-name">{c.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : null}
          {(budgetStr || revenueStr) && (
            <div className="movie-page__money">
              {budgetStr ? (
                <span>
                  Budget <strong>{budgetStr}</strong>
                </span>
              ) : null}
              {budgetStr && revenueStr ? <span className="movie-page__dot" /> : null}
              {revenueStr ? (
                <span>
                  Revenue <strong>{revenueStr}</strong>
                </span>
              ) : null}
            </div>
          )}
          {movie.belongs_to_collection?.name ? (
            <p className="movie-page__collection">
              Part of <strong>{movie.belongs_to_collection.name}</strong>
            </p>
          ) : null}
          {movie.homepage ? (
            <a
              href={movie.homepage}
              className="movie-page__homepage"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official site
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default MoviePage;
