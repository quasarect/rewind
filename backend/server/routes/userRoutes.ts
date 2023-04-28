import express from "express";
import {
	followUser,
	getMe,
	unfollow,
	updateUser,
	usernameUnique,
} from "../controllers/users";
import { isAuth } from "../middlewares/auth";
import { getNotifications, updateNotifViewed } from "../services/notifications";
import { IError } from "../types/basic/IError";

const userRouter = express.Router();

userRouter.get("/notifications/seen", isAuth, async (req, res, next) => {
	await updateNotifViewed(req.user?.id, req.query.id as string);
	res.status(200).json({ message: "Marked all as read" });
});

userRouter.get("/notifications", isAuth, async (req, res, next) => {
	try {
		const notifications = await getNotifications(req?.user!.id);
		res.status(200).json({ notifications: notifications });
	} catch (err) {
		next(new IError("Notification fetch error", 500));
	}
});
userRouter.get("/follow", isAuth, followUser);

userRouter.get("/unfollow", isAuth, unfollow);

userRouter.get("/me", isAuth, getMe);

userRouter.get("/username", usernameUnique);

userRouter.post("/update", isAuth, updateUser);

export default userRouter;
