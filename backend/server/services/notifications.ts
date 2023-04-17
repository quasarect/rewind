import { Types } from "mongoose";
import notificationModel from "../models/notificationSchema";
import { NotificationTypes } from "../enums/notificationEnums";
import userModel from "../models/userSchema";
/**
 *@recipient jisko notif jayega
 *@sender jisse trigger hua
 *@type type of notif
 *@post postId if related to post
 */
export const sendNotification = async (
	recipient: any,
	sender: any,
	type: string,
	post?: Types.ObjectId,
) => {
	if (sender == recipient) {
		return;
	}
	let alreadyNotified: boolean;
	if (
		type == NotificationTypes.comment ||
		NotificationTypes.dedicate ||
		NotificationTypes.like ||
		NotificationTypes.reshare
	) {
		alreadyNotified = await notificationModel
			.find({ sender, type, post })
			.then((notifs) => {
				if (notifs.length == 0) {
					return false;
				}
				return true;
			})
			.catch((err) => {
				console.log(err);
				return false;
			});
	} else {
		alreadyNotified = await notificationModel
			.find({ sender, type })
			.then((notifs) => {
				if (notifs.length == 0) {
					return false;
				}
				return true;
			})
			.catch((err) => {
				return false;
			});
	}
	if (alreadyNotified) {
		return;
	}
	const notification = new notificationModel({
		sender,
		recipient,
		type,
		post,
	});
	try {
		await notification.save();
		return true;
	} catch (err) {
		console.log(err);
		return;
	}
};

export const updateNotifViewed = async (
	userId: any,
	notificationId: string,
) => {
	const notifViewed = await userModel
		.findByIdAndUpdate(userId, { lastNotif: notificationId })
		.then((user) => {
			return true;
		})
		.catch((err) => {
			return false;
		});
	if (notifViewed) {
		return true;
	}
	return false;
};

export const getNotifications = async (userId: any) => {
	try {
		const user = await userModel.findById(userId).populate("lastNotif");

		let createdAt;
		if (user?.lastNotif) {
			//@ts-ignore
			createdAt = user.lastNotif.createdAt;
		} else {
			//@ts-ignore
			createdAt = user?.createdAt;
		}
		console.log(createdAt);
		const notifications = await Promise.all([
			notificationModel.find({
				createdAt: { $gt: createdAt },
				recipient: user?._id,
			}),
			notificationModel.find({
				createdAt: { $lt: createdAt },
				recipient: user?._id,
			}),
		]).then((notifs) => {
			return notifs;
		});
		console.log({
			newNotifications: notifications[0],
			oldNotifications: notifications[1],
		});
		return {
			newNotifications: notifications[0],
			oldNotifications: notifications[1],
		};
	} catch (err) {
		console.log(err);
	}
};
