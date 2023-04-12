import { Types } from "mongoose";
export interface IPost {
	user: Types.ObjectId;
	text: string;
	audioUrl?: string;
	imageUrl?: string;
	likeCount: number;
	commentCount: number;
	context?: Array<string>;
	createdAt: Date;
	likedBy: Types.ObjectId;
}
