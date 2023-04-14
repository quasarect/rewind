import express from "express";
import {
	allPosts,
	createPost,
	deletePost,
	getPost,
	likePost,
	postsByUser,
	unlikePost,
} from "../controllers/posts";
import { isAuth } from "../middlewares/auth";

const postRouter = express.Router();

postRouter.get("/all", isAuth, allPosts);

postRouter.get("/user/:id", postsByUser);

postRouter.post("/create", isAuth, createPost);

postRouter.get("/like", isAuth, likePost);

postRouter.get("/unlike", isAuth, unlikePost);

postRouter.get("/:id", isAuth, getPost);

postRouter.delete("/:id", isAuth, deletePost);

export default postRouter;
