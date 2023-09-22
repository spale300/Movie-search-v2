import { useState, useEffect } from "react";

const KEY = "c8ec9dc1";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErorr] = useState("");

  useEffect(
    function () {
      //   callback?.();
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setErorr("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}
        `,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with featching movies!");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found!");

          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            setErorr(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (!query.length) {
        setMovies([]);
        setErorr("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
