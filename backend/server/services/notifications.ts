import { Types } from "mongoose";
import notificationModel from "../models/notificationSchema";
import { NotificationTypes } from "../enums/notificationEnums";

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
		type ==
		(NotificationTypes.comment ||
			NotificationTypes.dedicate ||
			NotificationTypes.like ||
			NotificationTypes.reshare)
	) {
		alreadyNotified = await notificationModel
			.find({ sender, type, post })
			.then((notifs) => {
				console.log(type + notifs);
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
				console.log(type + notifs);
				if (notifs.length == 0) {
					return false;
				}
				return true;
			})
			.catch((err) => {
				console.log(err);
				return false;
			});
	}
	if (alreadyNotified) {
		console.log("already notified");
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
		console.log("Notified for " + type);
		return true;
	} catch (err) {
		return;
	}
};

export const updateNotifViewed = () => {
    
}
