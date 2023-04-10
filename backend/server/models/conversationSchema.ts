import mongoose, { model, Schema } from "mongoose";
import { IConversation } from "../types/models/IConversation";

const conversationSchema = new Schema<IConversation>(
	{
		lastMessage: {
			type: String,
		},
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		messages: [
			{
				type: Object,
			},
		],
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
