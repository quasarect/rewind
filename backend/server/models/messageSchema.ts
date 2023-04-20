import mongoose, { Schema, model } from "mongoose";
import { IMessage } from "../types/models/IMessage";

const messageSchema = new Schema<IMessage>({
	messages: [
		{
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			message: {
				type: String,
			},
			timestamp: {
				type: String,
			},
		},
		{ _id: false },
	],
});

const messageModel = model<IMessage>("Message", messageSchema);
export default messageModel;
