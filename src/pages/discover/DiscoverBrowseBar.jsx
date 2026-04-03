import React from "react";
import "./DiscoverBrowseBar.css";

const TABS = [
  { kind: "popular", label: "Popular" },
  { kind: "trending", label: "Trending" },
  { kind: "top", label: "Top rated" },
  { kind: "upcoming", label: "Upcoming" },
  { kind: "playing", label: "Now playing" },
];

export default function DiscoverBrowseBar({
  genres,
  activeKind,
  activeGenreId,
  searchActive,
  onTab,
  onGenre,
}) {
  return (
    <nav className="discover-browse" aria-label="Browse movies">
      <div className="discover-browse__tracks">
        <div className="discover-browse__row">
          {TABS.map((t) => (
            <button
              key={t.kind}
              type="button"
              className={
                "discover-browse__chip" +
                (!searchActive && activeKind === t.kind
                  ? " discover-browse__chip--active"
                  : "")
              }
              onClick={() => onTab(t.kind)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {genres.length > 0 ? (
          <div className="discover-browse__row discover-browse__row--genres">
            {genres.map((g) => (
              <button
                key={g.id}
                type="button"
                className={
                  "discover-browse__chip discover-browse__chip--genre" +
                  (!searchActive &&
                  activeKind === "genre" &&
                  activeGenreId === g.id
                    ? " discover-browse__chip--active"
                    : "")
                }
                onClick={() => onGenre(g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </nav>
  );
}
