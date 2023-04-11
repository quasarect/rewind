import express from "express";
import { handleOauth } from "../controllers/spotify";

const spotifyRouter=express.Router();

spotifyRouter.get('/login',handleOauth);

export default spotifyRouter;
