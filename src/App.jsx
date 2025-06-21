import React, { useState, useEffect } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");

  const API_BASE_URL = "https://api.themoviedb.org/3";
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  // Debounce search to minimize api calls

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      } else {
        const data = await response.json();

        if (data.Response == "False") {
          setErrorMsg(data.error || "Failed to fetch movies");
          setMovies([]);
          return;
        }

        setMovies(data.results || []);
      }
    } catch (error) {
      setErrorMsg(
        `Error fetching movies. Please try again later: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // only run this at the start
  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <h1>
              <img src="hero-img.png" alt="hero banner" />
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <section className="all-movies mt-10">
            <h2>All Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMsg ? (
              <p className="text-red-500">{errorMsg}</p>
            ) : (
              <ul>
                {movies.length > 0 ? (
                  movies.map((movie) => {
                    return <MovieCard key={movie.id} movie={movie} />;
                  })
                ) : (
                  <p className="text-white">Sadly, no movie was found :(</p>
                )}
              </ul>
            )}

            {/* {errorMsg && <p className="text-red-500">{errorMsg}</p>} */}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
