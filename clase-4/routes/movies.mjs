import { Router } from "express";
import { randomUUID } from "node:crypto";
import { validateMovie, validatePartialMovie } from "../schemas/movies.mjs";

// COMO LEER UN JSON EN ESMODULES
// import fs from "node:fs"
// const movies = JSON.parse(fs.readFileSync("./movies.json", "utf-8"))

// COMO LEER UN JSON EN ESMODULES RECOMENDADO
import { createRequire } from "node:module";
import { MovieModel } from "../models/movie";
const require = createRequire(import.meta.url);
const movies = require("../movies.json");

export const moviesRouter = Router();

// Todos los recursos que sean MOVIES se identifican con /api/movies
moviesRouter.get("/", async (req, res) => {
  const { title, genre } = req.query;

  const movies = await MovieModel.getAll({ title, genre });

  res.json(movies);
});

moviesRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id == id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send("Movie not found");
  }
});

moviesRouter.post("/", (req, res) => {
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

moviesRouter.patch("/:id", (req, res) => {
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

moviesRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id == id);

  if (movieIndex === -1) {
    return res.status(404).send("Movie not found");
  }

  movies.splice(movieIndex, 1);

  res.status(204).json({ message: "Movie deleted" });
});
