import express from "express";
// import { isAuth } from "../middlewares/auth";
import {
	createConvo,
	getConvo,
	sendMessage,
	userConvos,
} from "../controllers/conversation";
import { isAuth } from "../middlewares/auth";

const convoRouter = express.Router();

// create convo
convoRouter.get("/create", isAuth, createConvo);

// Get conversations of user with userId
convoRouter.get("/user", isAuth, userConvos);

convoRouter.post("/send", isAuth, sendMessage);

//Get conversation by ID
convoRouter.get("", isAuth, getConvo);

export default convoRouter;
