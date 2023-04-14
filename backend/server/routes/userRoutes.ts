import express from "express";
import {
	followUser,
	getMe,
	unfollow,
	userByFields,
} from "../controllers/users";
import { isAuth, passAuth } from "../middlewares/auth";

const userRouter = express.Router();

userRouter.get("/follow", isAuth, followUser);

userRouter.get("/unfollow", isAuth, unfollow);
// To reteive data with multiple fields
userRouter.get("", passAuth, userByFields);

userRouter.get("/me", isAuth, getMe);

export default userRouter;
