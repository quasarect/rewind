import { Types } from "mongoose";
import { IGroup } from "../basic/IGroup";

export interface IConversation {
	_id: Types.ObjectId;
	lastMessage: string;
	participants: Array<Types.ObjectId>;
	messages: Array<Types.ObjectId>;
	group: IGroup;
	seen: boolean;
	by: Types.ObjectId;
}
