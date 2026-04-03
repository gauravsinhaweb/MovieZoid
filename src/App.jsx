import "./App.css";
import DiscoverPage from "./pages/discover/DiscoverPage";
import MoviePage from "./pages/movie/MoviePage";
import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import ScrollToTop from "./layout/ScrollToTop";
import { VALID_BROWSE_SLUGS } from "./lib/browseRoutes";

function LegacyHomeQueryRedirect({ location }) {
  const qs = location.search;
  if (!qs || qs === "?") {
    return <Redirect to="/browse/popular" />;
  }
  const p = new URLSearchParams(qs.slice(1));
  const q = p.get("q");
  if (q) {
    const np = new URLSearchParams();
    np.set("q", q);
    const page = p.get("page");
    if (page && page !== "1") np.set("page", page);
    return <Redirect to={{ pathname: "/search", search: np.toString() }} />;
  }
  const kind = p.get("kind") || "popular";
  const gid = p.get("gid");
  const page = p.get("page");
  const suffix =
    page && page !== "1" ? `?page=${encodeURIComponent(page)}` : "";
  if (kind === "genre" && gid) {
    return <Redirect to={`/browse/genre/${gid}${suffix}`} />;
  }
  const KIND_SLUG = {
    popular: "popular",
    trending: "trending",
    top: "top-rated",
    upcoming: "upcoming",
    playing: "now-playing",
  };
  const slug = KIND_SLUG[kind] || "popular";
  return <Redirect to={`/browse/${slug}${suffix}`} />;
}

function App() {
  return (
    <>
      <div className="body" />
      <div className="App">
        <BrowserRouter>
          <ScrollToTop />
          <Switch>
            <Route
              exact
              path="/movie/:id"
              render={({ match }) => (
                <Redirect to={`/movies/${match.params.id}`} />
              )}
            />
            <Route exact path="/movies/:id/:slug" component={MoviePage} />
            <Route exact path="/movies/:id" component={MoviePage} />
            <Route exact path="/search" component={DiscoverPage} />
            <Route
              exact
              path="/browse/genre/:genreId"
              component={DiscoverPage}
            />
            <Route
              exact
              path="/browse/:tab"
              render={(props) =>
                VALID_BROWSE_SLUGS.includes(props.match.params.tab) ? (
                  <DiscoverPage {...props} />
                ) : (
                  <Redirect to="/browse/popular" />
                )
              }
            />
            <Route
              exact
              path="/browse"
              render={() => <Redirect to="/browse/popular" />}
            />
            <Route exact path="/" component={LegacyHomeQueryRedirect} />
          </Switch>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
