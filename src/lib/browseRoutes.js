import {
  searchMoviesUrl,
  discoverByGenreUrl,
  trendingMoviesUrl,
  topRatedMoviesUrl,
  upcomingMoviesUrl,
  nowPlayingMoviesUrl,
  popularMoviesUrl,
} from "./tmdb";

export const BROWSE_TAB_SLUGS = {
  popular: "popular",
  trending: "trending",
  top: "top-rated",
  upcoming: "upcoming",
  playing: "now-playing",
};

export const SLUG_TO_KIND = Object.fromEntries(
  Object.entries(BROWSE_TAB_SLUGS).map(([kind, slug]) => [slug, kind])
);

export const VALID_BROWSE_SLUGS = Object.values(BROWSE_TAB_SLUGS);

export function slugifyTitle(title) {
  if (!title || typeof title !== "string") return "movie";
  const s = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
  return s || "movie";
}

export function moviePath(id, title) {
  const sid = String(id);
  if (!title) return `/movies/${sid}`;
  return `/movies/${sid}/${slugifyTitle(title)}`;
}

export function movieAbsoluteUrl(id, title) {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${moviePath(id, title)}`;
}

export function browsePathForKind(kind, genreId = null) {
  if (kind === "genre" && genreId != null) {
    return `/browse/genre/${genreId}`;
  }
  const slug = BROWSE_TAB_SLUGS[kind] || BROWSE_TAB_SLUGS.popular;
  return `/browse/${slug}`;
}

function searchParamsString(searchString) {
  const raw = searchString.startsWith("?")
    ? searchString.slice(1)
    : searchString;
  return new URLSearchParams(raw || "");
}

export function parseBrowseRoute(pathname, searchString) {
  const sp = searchParamsString(searchString);
  const page = sp.get("page") || "1";
  const qRaw = (sp.get("q") || "").trim();

  if (pathname === "/search") {
    return {
      page,
      q: qRaw,
      kind: qRaw ? "search" : "popular",
      gid: "",
    };
  }

  const genreMatch = pathname.match(/^\/browse\/genre\/(\d+)$/);
  if (genreMatch) {
    return { page, q: "", kind: "genre", gid: genreMatch[1] };
  }

  const tabMatch = pathname.match(/^\/browse\/([^/]+)$/);
  if (tabMatch) {
    const slug = tabMatch[1];
    const kind = SLUG_TO_KIND[slug];
    if (kind) {
      return { page, q: "", kind, gid: "" };
    }
  }

  return { page, q: "", kind: "popular", gid: "" };
}

export function movieListUrlFromBrowse(pathname, searchString) {
  const { page, q, kind, gid } = parseBrowseRoute(pathname, searchString);

  if (pathname === "/search" && q) {
    return searchMoviesUrl(q, page);
  }

  let k = kind;
  const g = gid;
  if (k === "genre" && !g) {
    k = "popular";
  }

  if (k === "genre" && g) {
    return discoverByGenreUrl(g, page);
  }

  switch (k) {
    case "trending":
      return trendingMoviesUrl(page);
    case "top":
      return topRatedMoviesUrl(page);
    case "upcoming":
      return upcomingMoviesUrl(page);
    case "playing":
      return nowPlayingMoviesUrl(page);
    case "search":
      return popularMoviesUrl(page);
    case "popular":
    default:
      return popularMoviesUrl(page);
  }
}

export function discoverListHeading(pathname, searchString, genreNamesById) {
  const { q, kind, gid } = parseBrowseRoute(pathname, searchString);
  if (pathname === "/search" && q) return "Search results";
  if (kind === "genre" && gid && genreNamesById[gid]) {
    return genreNamesById[gid];
  }
  if (kind === "genre") return "Genre";
  const map = {
    popular: "Popular",
    trending: "Trending",
    top: "Top rated",
    upcoming: "Upcoming",
    playing: "Now playing",
  };
  return map[kind] || map.popular;
}

export function searchQueryString(term, page = "1") {
  const p = new URLSearchParams();
  p.set("q", term);
  if (page && page !== "1") p.set("page", page);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function pageQueryString(page) {
  if (!page || page === "1") return "";
  return `?page=${encodeURIComponent(page)}`;
}
