import { IPost } from "../types/models/IPost";
import mongoose, { model, Schema } from "mongoose";

const postSchema = new Schema<IPost>({
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
	context: [
		{
			type: String,
		},
	],
	audioUrl: {
		type: String,
	},
	imageUrl: {
		type: String,
	},
});

const postModel = model<IPost>("Post", postSchema);
export default postModel;
