import express from "express";
import { isAuth } from "../middlewares/auth";
import { createConvo, getConvo, userConvos } from "../controllers/conversation";

const convoRouter = express.Router();

// Get ID after creating a convo
convoRouter.get("/id", createConvo);

// Get conversations of user with userId
convoRouter.get("/user/:id", userConvos);

//Get conversation by ID
convoRouter.get("/:id", getConvo);

export default convoRouter;
