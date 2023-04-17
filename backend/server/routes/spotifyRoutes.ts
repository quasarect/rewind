import express from "express";
import { handleOauth, refresh } from "../controllers/spotify";
import { isAuth } from "../middlewares/auth";

const spotifyRouter = express.Router();

spotifyRouter.post("/login", handleOauth);

spotifyRouter.get("/user", isAuth);

spotifyRouter.get("/refresh", isAuth, refresh);

export default spotifyRouter;
