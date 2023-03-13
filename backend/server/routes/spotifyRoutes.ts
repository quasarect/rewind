import express from "express";
import { handleOauth } from "../controllers/spotify";

const spotifyRouter=express.Router();

spotifyRouter.get('/callback',handleOauth);

export default spotifyRouter;
