import React, { useState, useEffect } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);

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
  useDebounce(() => setDebounceSearchTerm(searchTerm), 650, [searchTerm]);

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
        if (query && data.results.length > 0) {
          await updateSearchCount(query, data.results[0]);
        }

        // const trendingMoviesResult = await getTrendingMovies();
        // setTrendingMovies(trendingMoviesResult);
        // console.log(trendingMovies);
      }
    } catch (error) {
      setErrorMsg(
        `Error fetching movies. Please try again later: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // runs everytime user search the movie
  useEffect(() => {
    // debounce hook will watch over the search term changes and only update it's stored value when user stop typing for specific period of time
    // use that stored value to pass as a search query and the use effect dependency
    fetchMovies(debounceSearchTerm);
    // console.log(debounceSearchTerm);
  }, [debounceSearchTerm]);

  // only run this at the start
  useEffect(() => {
    // load the trending movies asynchronously
    const loadTrendingMovies = async () => {
      try {
        const loadedTrendingMovies = await getTrendingMovies();
        setTrendingMovies(loadedTrendingMovies);
      } catch (error) {
        console.log("Error fetching trending movies");
      }
    };
    loadTrendingMovies();
  }, []);

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

          <section className="trending mt-14">
            <h2 className="mb-8">Trending Movies</h2>
            {trendingMovies.length > 0 ? (
              <ul>
                {trendingMovies.map((movie, index) => {
                  return (
                    <div className="trending-box" key={movie.$id}>
                      <li className="trending-box-header">
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
                      </li>
                      <p className="text-white text-center">{movie.title}</p>
                    </div>
                  );
                })}
              </ul>
            ) : (
              <p className="text-white text-center">
                No information about the current trending movies :(
              </p>
            )}
          </section>

          <section className="all-movies mt-14">
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
