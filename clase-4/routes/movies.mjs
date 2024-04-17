import { Router } from "express";

const router = Router();


// Todos los recursos que sean MOVIES se identifican con /api/movies
app.get("/api/movies", (req, res) => {
  const { title, genre } = req.query;
  let filteredMovies = [...movies];

  // // Filtrar por titulo
  if (title) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  // Filtrar por genero
  if (genre) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
  }

  res.json(filteredMovies);
});

app.get("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id == id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send("Movie not found");
  }
});

app.post("/api/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (!result.success) {
    // 422 Unprocessable Entity
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  // en base de datos
  const newMovie = {
    id: randomUUID(), // uuid v4
    ...result.data,
  };

  // Esto no sería REST, porque estamos guardando
  // el estado de la aplicación en memoria
  movies.push(newMovie);

  res.status(201).json(newMovie);
});

app.patch("/api/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    // 422 Unprocessable Entity
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id == id);

  if (movieIndex === -1) {
    return res.status(404).send("Movie not found");
  }

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updatedMovie;

  res.json(updatedMovie);
});

app.delete("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id == id);

  if (movieIndex === -1) {
    return res.status(404).send("Movie not found");
  }

  movies.splice(movieIndex, 1);

  res.status(204).json({ message: "Movie deleted" });
});
