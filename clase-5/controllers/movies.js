

import { validateMovie, validatePartialMovie } from "../schemas/movies.mjs";

export class MovieController {

  constructor({ MovieModel }) {
    this.MovieModel = MovieModel;
  }

  getAll = async (req, res) => {
    const { title, genre } = req.query;
    const movies = await this.MovieModel.getAll({ title, genre });

    // qué es lo que renderiza
    res.json(movies);
  };

  getById = async (req, res) => {
    const { id } = req.params;

    const movie = await this.MovieModel.getById({ id });

    if (movie) {
      res.json(movie);
    } else {
      res.status(404).send("Movie not found");
    }
  };

  create = async (req, res) => {
    const result = validateMovie(req.body);

    if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = await this.MovieModel.create({ input: result.data });

    res.status(201).json(newMovie);
  };

  update = async (req, res) => {
    const result = validatePartialMovie(req.body);

    if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    const updatedMovie = await this.MovieModel.update({ id, input: result.data });

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(updatedMovie);
  };

    delete = async (req, res) => {
    const { id } = req.params;

    const result = this.MovieModel.delete({ id });

    if (result === false) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(204).json({ message: "Movie deleted" });
  }
}
