import { Types } from "mongoose";

export interface INotification {
	recipient: Types.ObjectId;
	sender: Types.ObjectId;
	type: string; // Like comment dedicated
	createdAt: Date;
	post: Types.ObjectId;
}
