import { Types } from "mongoose";
import { IMessage } from "../basic/IMessage";

export interface IConversation {
	lastMessage: string;
	participants: Array<Types.ObjectId>;
	messages: Array<IMessage>;
}
