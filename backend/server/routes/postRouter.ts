import express from "express";
import {
	allPosts,
	createPost,
	deletePost,
	getPost,
	postsByUser,
} from "../controllers/posts";

const postRouter = express.Router();

postRouter.get("/all", allPosts);

postRouter.get("/user/:id", postsByUser);

postRouter.get("/:id", getPost);

postRouter.delete("/:id", deletePost);

postRouter.post("/create", createPost);

export default postRouter;
