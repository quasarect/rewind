import express from "express";
import { globalSearch, searchSong, userByFields } from "../controllers/search";
import { isAuth, passAuth } from "../middlewares/auth";

const searchRouter = express.Router();

searchRouter.get("/global", globalSearch);

searchRouter.get("/song", isAuth, searchSong);

searchRouter.get("/user", passAuth, userByFields);

export default searchRouter;
