import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import { PORT, SECRET_JWT_KEY } from "./config.js";
import UserRepository from "./user-repository.js";

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {

  const token = req.cookies.access_token;
  req.session = {user: null};

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY);
    req.session.user = data;
  } catch {}

  next(); // Continua con el siguiente middleware
});

app.get("/", (req, res) => {

  const { user } = req.session;

  res.render("index", user);

});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {

    const user = await UserRepository.login({ username, password });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    res
      .cookie("access_token", token, {
        httpOnly: true, // No se puede acceder al token desde el navegador solo desde el servidor
        // secure: true // Solo se envia el token si la conexión es HTTPS, cuanto este en "producción"
        sameSite: "strict", // Solo se envia el token si la petición es desde el mismo sitio
        maxAge: 3600000, // la cookie expira en 1 hora
      })
      .send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const id = await UserRepository.create({ username, password });
    res.send(`User created with id: ${id}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/logout", (req, res) => {
  res
    .clearCookie("access_token")
    .json({ message: "User logged out" });
});

app.get("/protected", async (req, res) => {
  const { user } = req.session;

  if (!user) return res.status(403).send("Access denied");

  res.render("protected", user);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
