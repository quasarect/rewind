import express from "express";
import { authUrl, handleOauth } from "../controllers/spotify";

const spotifyRouter = express.Router();

spotifyRouter.post("/login", handleOauth);

spotifyRouter.get("/auth-url", authUrl);

export default spotifyRouter;
