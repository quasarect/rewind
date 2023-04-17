import { Types } from "mongoose";
import notificationModel from "../models/notificationSchema";
import { NotificationTypes } from "../enums/notificationEnums";
import userModel from "../models/userSchema";
/**
 *
 * @param recipient person receiving notif
 * @param sender person sending notif
 * @param type type of notif
 * @param post postId of the
 * @returns boolean
 */
export const sendNotification = async (
	recipient: any,
	sender: any,
	type: string,
	postId?: Types.ObjectId,
) => {
	if (sender == recipient) {
		return false;
	}
	let alreadyNotified: boolean;
	if (
		type == NotificationTypes.comment ||
		NotificationTypes.dedicate ||
		NotificationTypes.like ||
		NotificationTypes.reshare
	) {
		alreadyNotified = await notificationModel
			.find({ sender, type, post: postId })
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
		return false;
	}
	const notification = new notificationModel({
		sender,
		recipient,
		type,
		post: postId,
	});
	try {
		await notification.save();
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};
/**
 *
 * @param userId User who viewed the notif
 * @param notificationId the latest notification saved
 * @returns boolean
 */
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
/**
 *
 * @param userId get all seen and unseen notifs
 * {
 * 		newNotifications:[{}]
 * 		seenNotifications:[{}]
 * }
 * @returns
 */
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
		const notifications = await Promise.all([
			notificationModel
				.find({
					createdAt: { $gt: createdAt },
					recipient: user?._id,
				})
				.populate({
					path: "sender",
					select: "name username profileUrl",
				})
				.populate({
					path: "post",
				}),
			notificationModel
				.find({
					createdAt: { $lte: createdAt },
					recipient: user?._id,
				})
				.populate({
					path: "sender",
					select: "name username profileUrl",
				})
				.populate({
					path: "post",
				}),
		]).then((notifs) => {
			return notifs;
		});
		return {
			newNotifications: notifications[0],
			seenNotifications: notifications[1],
		};
	} catch (err) {
		console.log(err);
	}
};
