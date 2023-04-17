import mongoose, { Schema, model } from "mongoose";
import { INotification } from "../types/models/INotification";

const notificationSchema = new Schema<INotification>({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	recipient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	type: {
		type: String,
		enum: ["like", "comment", "follow", "dedicate", "mention", "reshare"],
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

const notificationModel = model<INotification>(
	"Notification",
	notificationSchema,
);
export default notificationModel;
