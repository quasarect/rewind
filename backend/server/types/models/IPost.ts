import { Types } from "mongoose";
import { IDedicated } from "../basic/IDedicated";
export interface IPost {
	user: Types.ObjectId;
	text: string;
	audioUrl?: string;
	imageUrl?: string;
	likeCount: number;
	filepath: string;
	commentCount: number;
	context?: Array<string>;
	createdAt: Date;
	likedBy: Types.ObjectId;
	dedicated: IDedicated;
}
