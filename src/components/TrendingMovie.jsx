import React from "react";

function TrendingMovie({ movie, index }) {
  return (
    <li className="trending-movie">
      <div className="trending-movie-top">
        <p>{index + 1}</p>
        <span>
          <img
            src={
              movie.poster_url.split("/").at(-1) != "null"
                ? movie.poster_url
                : "/no-movie.png"
            }
            alt={`trending poster ${index + 1}`}
          />
        </span>
      </div>
      <p className="text-white font-semibold text-center">{movie.title}</p>
    </li>
  );
}

export default TrendingMovie;
