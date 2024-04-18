import { Router } from "express";
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
    res.status(500).json({ message: "Internal server error" });
});

moviesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const movie = await MovieModel.getById({ id });

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send("Movie not found");
  }
});

moviesRouter.post("/", async (req, res) => {
  const result = validateMovie(req.body);

  if (!result.success) {
    // 422 Unprocessable Entity
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = await MovieModel.create({ input: result.data });

  res.status(201).json(newMovie);
});

moviesRouter.patch("/:id", async (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    // 422 Unprocessable Entity
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const updatedMovie = await MovieModel.update({ id, input: result.data });

  if (!updatedMovie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  res.json(updatedMovie);
});

moviesRouter.delete("/:id", (req, res) => {
  const { id } = req.params;

  const result = MovieModel.delete({ id });

  if (result === false) {
    return res.status(404).json({ message: "Movie not found" });
  }

  res.status(204).json({ message: "Movie deleted" });
});
