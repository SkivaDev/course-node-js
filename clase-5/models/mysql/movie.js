import mysql from 'mysql2/promise';


const config = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'moviesdb',
    port: 3306
}

const connection = await mysql.createConnection(config);

export class MovieModel {
    static async getAll({ genre }) {

        if(genre) {
            const lowerCaseGenre = genre.toLowerCase();
            const [genres] = await connection.query('SELECT id FROM genre WHERE LOWER(name) = ?;', [lowerCaseGenre]);

            if(genres.length === 0) {
                return [];
            }

            const [{ id }] = genres;

            //Query a movie_genres
            const [moviesId] = await connection.query('SELECT movie_id FROM movie_genres WHERE genre_id = ?;', [id]);
            // console.log(result);

            //Join
            const moviesIdArray = moviesId.map(({ movie_id }) => movie_id);
            const [movies] = await connection.query('SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) FROM movie WHERE id IN (?);', [moviesIdArray]);

            return movies;
        }


        const [movies] = await connection.query('select title, year, director, duration, poster, rate, BIN_TO_UUID(id) from movie;');

        return movies;

    }
    static async getById({ id }) {
    }

    static async create({ input }) {
    }

    static async delete({ id }) {
    }
    static async update({ id, input }) {
    }
}