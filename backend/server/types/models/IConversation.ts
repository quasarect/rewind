import { Types } from "mongoose";
import { IMessage } from "../basic/IMessage";

export interface IConversation {
	lastMessage: string;
	participants: Types.ObjectId;
	messages: Array<IMessage>;
}
