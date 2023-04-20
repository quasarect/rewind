import mongoose, { model, Schema } from "mongoose";
import { IConversation } from "../types/models/IConversation";

const conversationSchema = new Schema<IConversation>(
	{
		lastMessage: {
			type: String,
		},
		seen: {
			type: Boolean,
		},
		by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		participants: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
			required: true,
		},

		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
			},
		],
		group: {
			type: {
				createdBy: {
					type: mongoose.Types.ObjectId,
					ref: "User",
				},
				name: String,
				description: String,
			},
		},
	},
	{
		timestamps: true,
	},
);

const conversationModel = model<IConversation>(
	"Conversation",
	conversationSchema,
);
export default conversationModel;
