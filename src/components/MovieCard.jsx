import React from "react";

function MovieCard({
  movie: {
    title,
    id,
    vote_average,
    poster_path,
    release_date,
    original_language,
  },
}) {
  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-movie.png"
        }
        alt={`${title} movie poster`}
      />

      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="star icon" />
            <span className="text-white font-semibold">
              {vote_average ? vote_average.toFixed(2) : "No Rating"}
            </span>
          </div>

          <span>•</span>

          <p className="lang">{original_language.toUpperCase()}</p>

          <span>•</span>

          <div className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
