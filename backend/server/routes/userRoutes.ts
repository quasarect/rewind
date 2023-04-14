import express from "express";
import {
	followUser,
	getMe,
	unfollow,
	updateUser,
	userByFields,
	usernameUnique,
} from "../controllers/users";
import { isAuth, passAuth } from "../middlewares/auth";

const userRouter = express.Router();

userRouter.get("/follow", isAuth, followUser);

userRouter.get("/unfollow", isAuth, unfollow);
// To reteive data with multiple fields
userRouter.get("", passAuth, userByFields);

userRouter.get("/me", isAuth, getMe);

userRouter.get("/username", usernameUnique);

userRouter.post("/update", isAuth, updateUser);



export default userRouter;
