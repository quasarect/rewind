import { Schema, model } from "mongoose";
import { IMessage } from "../types/models/IMessage";

const messageSchema = new Schema<IMessage>({
	messages: [
		{
			userId: {
				type: String,
			},
			message: {
				type: String,
			},
			timestamp: {
				type: Date,
				default: Date.now(),
			},
		},
	],
});

const messageModel = model<IMessage>("Message", messageSchema);
export default messageModel;
