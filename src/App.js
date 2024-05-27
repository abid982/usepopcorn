import { useState, useEffect } from 'react';
import StarRating from './StarRating';

const tempMovieData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
  },
];

const tempWatchedData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = arr =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = `5191b872`;

export default function App() {
  // const [movies, setMovies] = useState(tempMovieData);
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState(tempWatchedData);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const tempQuery = 'interstellar';

  // fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
  //   .then(res => res.json())
  //   .then(data => setMovies(data.Search));

  // setWatched([]);
  // The idea of the useEffect hook is to give a place where we can safely write side effects like our data fetching but the side effects registered with the useEffect hook will only be executed after certain renders for example only right after the initial renders which is exactly what we're looking for.
  // The useEffect doesn't return anything so we don't store the result into a variable but instead we pass in a function so this function is then called our effect and it contains the code that we want to run as a side effect so basically we want to register as a side effect to be executed at a certain point of time.
  // Pass second argument as a dependency array.
  // Pass empty array i.e []. The effect will only run on mount so when our App component renders for the very first time.

  // useEffect(function () {
  //   fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
  //     .then(res => res.json())
  //     .then(data => setMovies(data.Search));
  // }, []);

  // Using an async function
  // Note: The effect function that we place in useEffect cannot return a promise which is what an async function does.
  // Note: When strict mode is activated in React 18 our effect will not run only once but actually twice so React will call our effect twice but only in development so when our application is in production this will no longer be happening.

  /*
  useEffect(function () {
    console.log('After initial render');
  }, []);

  useEffect(function () {
    console.log('After every render');
  });

  useEffect(
    function () {
      console.log('D');
    },
    [query]
  );
  */

  console.log('During render');

  function handleSelectMovie(id) {
    // If the id is equal to the current one then set the new selected id to null
    // setSelectedId(id);
    setSelectedId(selectedId => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatch(movie) {
    // setWatched(movie);
    setWatched(watched => [...watched, movie]);
    console.log('Watched movies array:');
    console.log(watched);
  }

  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  }

  // This effect should run on mount
  // useEffect(function () {
  //   document.addEventListener('keydown', function (e) {
  //     if (e.code === 'Escape') {
  //       handleCloseMovie();
  //       console.log('CLOSING');
  //     }
  //   });
  // }, []);

  useEffect(
    function () {
      // Browser API abort controller
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          // Reset error
          setError('');
          // Connect abort controller with the fetch function
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) {
            throw new Error('Something went wrong with fetching movies');
          }

          const data = await res.json();
          // Setting state is asynchronous
          setMovies(data.Search);
          // console.log(movies);
          console.log(data.Search);
          // setIsLoading(false);
          setError('');
        } catch (err) {
          console.error(err.message);
          // setError(err.message);
          // setIsLoading(false);
          if (err.name !== 'AbortError') setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      // if (!query.length) {
      if (query.length < 3) {
        setMovies([]);
        setError('');
        return;
      }

      handleCloseMovie();
      fetchMovies();

      // Clear function
      return function () {
        // The requests are cancelled except the last one
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      {/* <NavBar movies={movies} /> */}
      <NavBar>
        {/* <Logo /> */}
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      {/* <Main movies={movies} /> */}
      <Main>
        {/* <ListBox movies={movies} /> */}
        {/* <ListBox>
          <MovieList movies={movies} />
        </ListBox>
        <WatchedBox /> */}
        {/* Composition */}
        {/* We can use the children prop for composition or an explicitly defined prop */}
        {/* Implicit Prop */}
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}

          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {/* <WatchedSummary watched={watched} />
          <WatchedList watched={watched} /> */}
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatch}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>

        {/* Explicit Prop */}
        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} />
            </>
          }
        /> */}
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}

// Composition
// Stateless Component
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

// // Stateless Component
// function NavBar({ movies }) {
//   return (
//     <nav className="nav-bar">
//       <Logo />
//       <Search />
//       <NumResults movies={movies} />
//     </nav>
//   );
// }

// Presentational Component
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

// Stateful Component
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  );
}

// Stateless Component
function NumResults({ movies }) {
  return (
    <p className="num-results">
      {/* Found <strong>{movies.length}</strong> results */}
      Found <strong>{movies?.length}</strong> results,
    </p>
  );
}

// Presentational Component
// function Main({ movies }) {
//   return (
//     <main className="main">
//       <ListBox movies={movies} />
//       <WatchedBox />
//     </main>
//   );
// }

function Main({ children }) {
  return <main className="main">{children}</main>;
}

// Stateful Component
// function ListBox({ movies }) {
//   const [isOpen1, setIsOpen1] = useState(true);

//   return (
//     <div className="box">
//       <button className="btn-toggle" onClick={() => setIsOpen1(open => !open)}>
//         {isOpen1 ? '–' : '+'}
//       </button>
//       {isOpen1 && <MovieList movies={movies} />}
//     </div>
//   );
// }

// function ListBox({ children }) {
//   const [isOpen1, setIsOpen1] = useState(true);

//   return (
//     <div className="box">
//       <button className="btn-toggle" onClick={() => setIsOpen1(open => !open)}>
//         {isOpen1 ? '–' : '+'}
//       </button>
//       {/* {isOpen1 && <MovieList movies={movies} />} */}
//       {isOpen1 && children}
//     </div>
//   );
// }

// Explicit Prop
// function Box({ element }) {
//   const [isOpen, setIsOpen] = useState(true);

//   return (
//     <div className="box">
//       <button className="btn-toggle" onClick={() => setIsOpen(open => !open)}>
//         {isOpen ? '–' : '+'}
//       </button>
//       {/* {isOpen && <MovieList movies={movies} />} */}
//       {isOpen && element}
//     </div>
//   );
// }

// Implicit Prop
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen(open => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {/* {isOpen && <MovieList movies={movies} />} */}
      {isOpen && children}
    </div>
  );
}

/*
function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen2(open => !open)}>
        {isOpen2 ? '–' : '+'}
      </button>
      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedList watched={watched} />
        </>
      )}
    </div>
  );
}
*/

// Stateful Component
function MovieList({ movies, onSelectMovie }) {
  // const [movies, setMovies] = useState(tempMovieData);

  return (
    <ul className="list list-movies">
      {movies?.map(movie => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

// Presentational Component
function Movie({ movie, onSelectMovie }) {
  return (
    <li
      onClick={() => {
        onSelectMovie(movie.imdbID);
      }}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// Stateful Component
// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button className="btn-toggle" onClick={() => setIsOpen2(open => !open)}>
//         {isOpen2 ? '–' : '+'}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');
  // const isWatched = watched.includes(movie);
  const isWatched = watched.map(movie => movie.imdbID).includes(selectedId);
  console.log('Is watched:');
  console.log(isWatched);
  const watchedUserRating = watched.find(
    movie => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  console.log(title, year);

  function handleAdd(movie) {
    // if (!isWatched) {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
    };

    onAddWatched(newWatchedMovie);
    // }

    onCloseMovie();
  }

  // This effect should run when the movie details page mounted
  useEffect(
    function () {
      function callback(e) {
        if (e.code === 'Escape') {
          onCloseMovie();
          console.log('CLOSING');
        }
      }

      document.addEventListener('keydown', callback);

      // Cleanup function
      return function () {
        document.removeEventListener('keydown', callback);
      };
    },
    [onCloseMovie]
  );

  // Fetch movie based on the selected id when movie details component mounts
  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );

      const data = await res.json();
      setMovie(data);
      setIsLoading(false);

      console.log(data);
    }

    getMovieDetails();
  }, [selectedId]);

  // We should use different effects for different things so basically each effect has only one purpose

  // Run effect on mount
  useEffect(
    function () {
      // Change the title of the page in the browser by setting document.title
      console.log('CHANGE TITLE EFFECT');
      if (!title) return;
      // document.title = 'TEST';
      document.title = `Movie | ${title}`;

      // The cleanup function is simply a function that we return from an effect
      return function () {
        document.title = 'usePopcorn';
        console.log(`Clean up effect for movie ${title}`);
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
              <p>Directed by {director}</p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={() => {
                        handleAdd(movie);
                      }}
                    >
                      Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {watchedUserRating} 🌟</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
          </section>
          {/* {selectedId} */}
        </>
      )}
    </div>
  );
}

// Presentational Component
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map(movie => movie.imdbRating));
  const avgUserRating = average(watched.map(movie => movie.userRating));
  const avgRuntime = average(watched.map(movie => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map(movie => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

// Presentational Component
function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button
          className="btn-delete"
          onClick={() => {
            onDeleteWatched(movie.imdbID);
          }}
        >
          &times;
        </button>
      </div>
    </li>
  );
}
