import express from "express";
import { handleOauth } from "../controllers/spotify";

const spotifyRouter=express.Router();

spotifyRouter.post('/callback',handleOauth);

export default spotifyRouter;
