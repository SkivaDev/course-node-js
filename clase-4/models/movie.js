// COMO LEER UN JSON EN ESMODULES RECOMENDADO
import  { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const movies = require("../movies.json");


export class MovieModel {
    static async getAll ({ title, genre }) {
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

    static async getById(id) {
        return movies.find((movie) => movie.id == id);
    }
}