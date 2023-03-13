import { IMessage } from "../basic/IMessage";

export interface IConversation {
	conversationId: string;
	lastMessage: string;
	lastTimestamp: Date;
	createdAt: Date;
    participants:Array<string>;
	messages: Array<IMessage>;
}
