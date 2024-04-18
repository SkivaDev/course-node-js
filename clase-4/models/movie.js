// COMO LEER UN JSON EN ESMODULES RECOMENDADO
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const movies = require("../movies.json");

export class MovieModel {
  static async getAll({ title, genre }) {
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
  }

  static async getById({ id }) {
    return movies.find((movie) => movie.id == id);
  }

  static async create({ input }) {
    const newMovie = {
      id: randomUUID(), // uuid v4
      ...input,
    };

    // Esto no sería REST, porque estamos guardando
    // el estado de la aplicación en memoria
    movies.push(newMovie);

    return newMovie;
  }

  static async delete({ id }) {
    const movieIndex = movies.findIndex((movie) => movie.id == id);

    if (movieIndex === -1) return false;

    movies.splice(movieIndex, 1);
    return true;
  }

  static async update({ id, input }) {
    const { id } = req.params;
    const movieIndex = movies.findIndex((movie) => movie.id == id);
  
    if (movieIndex === -1) return false;
  
    const updatedMovie = {
      ...movies[movieIndex],
      ...input,
    };
  
    return movies[movieIndex];
  }
}
