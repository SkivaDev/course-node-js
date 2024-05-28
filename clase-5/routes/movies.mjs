import { Router } from "express";
import { MovieController } from "../controllers/movies.js";

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router();

  const movieController = new MovieController({ movieModel });
  
  // Todos los recursos que sean MOVIES se identifican con /api/movies
  moviesRouter.get("/", movieController.getAll);

  moviesRouter.get("/:id", movieController.getById);

  moviesRouter.post("/", movieController.create);

  moviesRouter.patch("/:id", movieController.update);

  moviesRouter.delete("/:id", movieController.delete);

  return moviesRouter;
};
