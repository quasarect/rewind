import express from "express";
import {
	allPosts,
	createPost,
	deletePost,
	fetchComments,
	getPost,
	likePost,
	postsByUser,
	unlikePost,
} from "../controllers/posts";
import { isAuth, passAuth } from "../middlewares/auth";
import { fileUpload } from "../middlewares/multer";

const postRouter = express.Router();

postRouter.get("/all", isAuth, allPosts);

postRouter.get("/user/:username", postsByUser);

postRouter.post("/create", isAuth, fileUpload, createPost);

postRouter.get("/like", isAuth, likePost);

postRouter.get("/unlike", isAuth, unlikePost);

postRouter.get("/:postId/comments", fetchComments);

postRouter.get("/:id", passAuth, getPost);

postRouter.delete("/:id", isAuth, deletePost);

export default postRouter;
