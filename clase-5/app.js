import express, { json } from "express";

import { moviesRouter } from "./routes/movies.mjs";
import { corsMiddleware } from "./middelwares/cors.mjs";


const app = express();
app.use(json()); // Middleware para parsear el body en JSON
app.use(corsMiddleware()); // Middleware para habilitar CORS
app.disable("x-powered-by"); // Deshabilita el header X-Powered-By: Express

app.get("/", (req, res) => {
  res.send("Hola Mundo!");
});


app.use('/api/movies', moviesRouter)

const PORT = process.env.PORT || 1234;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
