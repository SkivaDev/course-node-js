import crypto from "node:crypto";

import DBLocal from "db-local";
import bcrypt from "bcrypt";

const { Schema } = new DBLocal({ path: "./db" });

const User = Schema("User", {
  _id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

class UserRepository {
  static create = async ({ username, password }) => {
    //1. Validaciones de username
    Validation.username(username);

    //2. Validaciones de password
    Validation.password(password);

    //3. Verificar si el usuario ya existe
    const user = User.findOne({ username });
    if (user) {
      throw new Error("User already exists");
    }

    //4. Crear usuario
    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = User.create({
      _id: id,
      username,
      password: hashedPassword,
    });

    newUser.save();

    return id;
  };

  static login = async ({ username, password }) => {
    //1. Validaciones de username
    Validation.username(username);

    //2. Validaciones de password
    Validation.password(password);

    //3. Verificar si el usuario ya existe
    const user = User.findOne({ username });
    if (user) {
        throw new Error("User already exists");
    }

    //4. Verificar si la contraseña es correcta
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    const { password: _, ...publicUser } = user;

    return publicUser;

  };
}

class Validation {
  static username = (username) => {
    if (typeof username !== "string") {
      throw new Error("Username must be a string");
    }
    if (username.length < 3) {
      throw new Error("Username must have at least 3 characters");
    }
  };

  static password = (password) => {
    if (typeof password !== "string") {
      throw new Error("Password must be a string");
    }
    if (password.length < 8) {
      throw new Error("Password must have at least 8 characters");
    }
  };
}

export default UserRepository;
