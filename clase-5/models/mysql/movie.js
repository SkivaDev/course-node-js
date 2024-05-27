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