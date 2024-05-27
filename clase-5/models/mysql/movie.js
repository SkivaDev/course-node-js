import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "moviesdb",
  port: 3306,
};

const connection = await mysql.createConnection(config);

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();
      const [genres] = await connection.query(
        "SELECT id FROM genre WHERE LOWER(name) = ?;",
        [lowerCaseGenre]
      );

      if (genres.length === 0) {
        return [];
      }

      const [{ id }] = genres;

      //Query a movie_genres
      const [moviesId] = await connection.query(
        "SELECT movie_id FROM movie_genres WHERE genre_id = ?;",
        [id]
      );
      // console.log(result);

      //Join
      const moviesIdArray = moviesId.map(({ movie_id }) => movie_id);
      const [movies] = await connection.query(
        "SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) FROM movie WHERE id IN (?);",
        [moviesIdArray]
      );

      return movies;
    }

    const [movies] = await connection.query(
      "select title, year, director, duration, poster, rate, BIN_TO_UUID(id) from movie;"
    );

    return movies;
  }
  static async getById({ id }) {
    const [movies] = await connection.query(
      "SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) FROM movie WHERE id = UUID_TO_BIN(?);",
      [id]
    );

    if (movies.length === 0) {
      return null;
    }

    return movies[0];
  }

  static async create({ input }) {
    const { title, year, director, duration, rate, poster, genre } = input;

    const [uuidResult] = await connection.query("SELECT UUID() uuid;");
    const [{ uuid }] = uuidResult;

    try {
      console.log("trycatch");
      await connection.query(
        "INSERT INTO movie (id, title, year, director, duration, rate, poster) VALUES (UUID_TO_BIN(?),?, ?, ?, ?, ?, ?);",
        [uuid, title, year, director, duration, rate, poster]
      );

      const movieId = uuid;
      console.log(movieId);

      const genrePromises = genre.map(async (genreName) => {
        const lowerCaseGenre = genreName.toLowerCase();
        const [genres] = await connection.query(
          "SELECT id FROM genre WHERE LOWER(name) = ?;",
          [lowerCaseGenre]
        );

        if (genres.length === 0) {
          //Insertar el genero en caso de que no exista (Esto es inutil porque mi schema no permite generos nuevos)
          const [result] = await connection.query(
            "INSERT INTO genre (name) VALUES (?);",
            [genreName]
          );
          return result.insertId;
        }

        const [{ id }] = genres;
        return id;
      });

      console.log("genrePromises ", genrePromises);

      const genreIds = await Promise.all(genrePromises);

      console.log("genreIds ", genreIds);

      const movieGenresPromises = genreIds.map(async (genreId) => {
        await connection.query(
          "INSERT INTO movie_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?);",
          [movieId, genreId]
        );
      });

      await Promise.all(movieGenresPromises);

      return {
        id: movieId,
        title,
        year,
        director,
        duration,
        rate,
        poster,
        genre,
      };
    } catch (error) {
      throw new Error("Error creating movie");
    }
  }

  static async delete({ id }) {
    try {
      await connection.query("DELETE FROM movie WHERE id = UUID_TO_BIN(?);", [
        id,
      ]);

      await connection.query(
        "DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?);",
        [id]
      );

      return true;
    } catch (error) {
      return false;
    }
  }
  static async update({ id, input }) {
    const { title, year, director, duration, rate, poster, genre } = input;

    try {
      //actualizar la pelicula solo los campos que se pasen

      await connection.query(
        "UPDATE movie SET title = ?, year = ?, director = ?, duration = ?, rate = ?, poster = ? WHERE id = UUID_TO_BIN(?);",
        [title, year, director, duration, rate, poster, id]
      );

      await connection.query(
        "DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?);",
        [id]
      );

      const genrePromises = genre.map(async (genreName) => {
        const lowerCaseGenre = genreName.toLowerCase();
        const [genres] = await connection.query(
          "SELECT id FROM genre WHERE LOWER(name) = ?;",
          [lowerCaseGenre]
        );

        if (genres.length === 0) {
          //Insertar el genero en caso de que no exista
          const [result] = await connection.query(
            "INSERT INTO genre (name) VALUES (?);",
            [genreName]
          );
          return result.insertId;
        }

        const [{ id }] = genres;
        return id;
      });

      const genreIds = await Promise.all(genrePromises);

      const movieGenresPromises = genreIds.map(async (genreId) => {
        await connection.query(
          "INSERT INTO movie_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?);",
          [id, genreId]
        );
      });

      await Promise.all(movieGenresPromises);

      return {
        id,
        title,
        year,
        director,
        duration,
        rate,
        poster,
        genre,
      };
    } catch (error) {
      throw new Error(error);
      throw new Error("Error updating movie");
    }
  }
}
