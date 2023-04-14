import express from "express";
import { handleOauth, userTopTrack } from "../controllers/spotify";
import { isAuth } from "../middlewares/auth";

const spotifyRouter = express.Router();

spotifyRouter.post("/login", handleOauth);

spotifyRouter.get("/user", isAuth);

spotifyRouter.get("/top-track", isAuth, userTopTrack);
export default spotifyRouter;
