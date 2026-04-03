export const TMDB_API_KEY = "44672c0063a3a75c6c66be8d2d0d43df";

export const tmdbImage = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const movieDetailUrl = (id) =>
  `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`;

export const popularMoviesUrl = (page) =>
  `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`;

export const topRatedMoviesUrl = (page) =>
  `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`;

export const upcomingMoviesUrl = (page) =>
  `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}`;

export const nowPlayingMoviesUrl = (page) =>
  `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}`;

export const trendingMoviesUrl = (page, window = "day") =>
  `https://api.themoviedb.org/3/trending/movie/${window}?api_key=${TMDB_API_KEY}&page=${page}`;

export const genresMovieListUrl = () =>
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`;

export const discoverByGenreUrl = (genreId, page) =>
  `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`;

export const searchMoviesUrl = (query, page = 1) =>
  `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
    query
  )}&page=${page}`;

export function pickYoutubeTrailerKey(videos) {
  const list = (videos?.results || []).filter((v) => v.site === "YouTube");
  const ranked = [
    ...list.filter((v) => v.type === "Trailer" && v.official),
    ...list.filter((v) => v.type === "Trailer"),
    ...list.filter((v) => v.type === "Teaser" && v.official),
    ...list.filter((v) => v.type === "Teaser"),
    ...list,
  ];
  return ranked[0]?.key || null;
}

export function formatUsd(amount) {
  if (amount == null || amount === 0) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
