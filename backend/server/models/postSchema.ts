import { IPost } from "../types/models/IPost";
import mongoose, { model, Schema } from "mongoose";

const postSchema = new Schema<IPost>(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		text: {
			type: String,
		},
		likeCount: {
			type: Number,
			default: 0,
		},
		commentCount: {
			type: Number,
			default: 0,
		},
		reshareCount: {
			type: Number,
			default: 0,
		},
		context: [
			{
				type: String,
			},
		],
		likedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserArray",
		},
		dedicated: {
			type: {
				to: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				songName: String,
				songPhoto: String,
				songUrl: String,
			},
		},
		filepath: {
			type: String,
		},
		replyTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
		reshared: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
		resharedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserArray",
		},
	},
	{ timestamps: true },
);

const postModel = model<IPost>("Post", postSchema);
export default postModel;
