import { Router } from "express";
import { MovieController } from "../controllers/movies.js";            

export const moviesRouter = Router();

// Todos los recursos que sean MOVIES se identifican con /api/movies
moviesRouter.get("/", MovieController.getAll);

moviesRouter.get("/:id", MovieController.getById);

moviesRouter.post("/", MovieController.create);

moviesRouter.patch("/:id", MovieController.update);

moviesRouter.delete("/:id", MovieController.delete);
