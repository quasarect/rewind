import express from "express";
import {
	globalSearch,
	searchSong,
	searchbyUsername,
} from "../controllers/search";
import { isAuth } from "../middlewares/auth";

const searchRouter = express.Router();

searchRouter.get("/global", globalSearch);

searchRouter.get("/song", isAuth, searchSong);

searchRouter.get("/username", searchbyUsername);

export default searchRouter;
