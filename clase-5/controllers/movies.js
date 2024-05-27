//MODELO local file system
// import { MovieModel } from "../models/local-file-system/movie.js";

//MODELO mysql
import { MovieModel } from "../models/mysql/movie.js";

import { validateMovie, validatePartialMovie } from "../schemas/movies.mjs";

export class MovieController {
  static async getAll(req, res) {
    const { title, genre } = req.query;
    const movies = await MovieModel.getAll({ title, genre });

    // qué es lo que renderiza
    res.json(movies);
  }

  static async getById(req, res) {
    const { id } = req.params;

    const movie = await MovieModel.getById({ id });

    if (movie) {
      res.json(movie);
    } else {
      res.status(404).send("Movie not found");
    }
  }

  static async create(req, res) {
    const result = validateMovie(req.body);

    if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = await MovieModel.create({ input: result.data });

    res.status(201).json(newMovie);
  }

  static async update(req, res) {
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
  }

  static async delete(req, res) {
    const { id } = req.params;

    const result = MovieModel.delete({ id });

    if (result === false) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(204).json({ message: "Movie deleted" });
  }
}
