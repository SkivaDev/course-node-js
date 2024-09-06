import DBLocal from './db-local';
import crypto from 'crypto';

const { Schema } = new DBLocal( { path: './db' } );

const User = Schema('User', {
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})


export class UserRepository {

    static create = ({ username, password }) => {

        //1. Validaciones de username
        if (typeof username !== 'string') {
            throw new Error('Username must be a string');
        }
        if (username.length < 3) {
            throw new Error('Username must have at least 3 characters');
        }
        //2. Validaciones de password
        if (typeof password !== 'string') {
            throw new Error('Password must be a string');
        }
        if (password.length < 8) {
            throw new Error('Password must have at least 8 characters');
        }

        //3. Verificar si el usuario ya existe
        const user = User.findOne({username});
        if (user) {
            throw new Error('User already exists');
        }

        //4. Crear usuario

        const id = crypto.randomUUID();

        const newUser = User.create({
            _id: id,
            username,
            password
        });

        newUser.save();

        return id;

    };

    static login = ({ username, password }) => {};

}