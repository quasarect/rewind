import { Types } from "mongoose";
import { IDedicated } from "../basic/IDedicated";
export interface IPost {
	user: Types.ObjectId;
	text: string;
	likeCount: number;
	filepath: string;
	commentCount: number;
	context?: Array<string>;
	createdAt: Date;
	likedBy: Types.ObjectId;
	dedicated: IDedicated;
	replyTo: Types.ObjectId;
	reshared: Types.ObjectId;
	reshareCount: number;
	resharedBy: Types.ObjectId;
}
