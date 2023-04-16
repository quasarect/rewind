import { Types } from "mongoose";

export interface IConversation {
	lastMessage: string;
	participants: Array<Types.ObjectId>;
	messages: Array<Types.ObjectId>;
}
