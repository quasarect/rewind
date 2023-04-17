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
import { getNotifications, updateNotifViewed } from "../services/notifications";
import { IError } from "../types/basic/IError";

const userRouter = express.Router();

userRouter.post("/notificationviewed", (req, res, next) => {
	updateNotifViewed(req.user?.id, req.query.id as string);
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
// To reteive data with multiple fields
userRouter.get("", passAuth, userByFields);

userRouter.get("/me", isAuth, getMe);

userRouter.get("/username", usernameUnique);

userRouter.post("/update", isAuth, updateUser);

export default userRouter;
