import { IUser } from "../types/models/IUser";
import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema<IUser>(
	{
		//Spotify
		name: {
			type: String,
			required: true,
		},
		//Spotify
		username: {
			type: String,
			required: true,
			unique: true,
		},
		//Spotify
		country: {
			type: String,
			required: true,
		},
		//Rewind
		status: {
			type: String,
			default: "Offline",
		},
		//spotify
		email: {
			type: String,
			required: true,
			unique: true,
		},
		//spotify first and then rewind custom
		profileUrl: {
			type: String,
			default:
				"https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
		},
		// rewind from AI
		tag: {
			type: String,
		},
		//rewind
		bio: {
			type: String,
		},
		aiGeneratedLine: {
			type: String,
		},
		private: {
			type: Boolean,
			default: false,
		},
		artist: {
			type: Boolean,
			default: false,
		},
		followerCount: {
			type: Number,
			default: 0,
		},
		followingCount: {
			type: Number,
			default: 0,
		},
		postCount: {
			type: Number,
			default: 0,
		},
		//Spotify
		spotifyData: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Key",
		},
		followers: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserArray",
		},

		following: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "UserArray",
		},
		lastNotif: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Notification",
			default: null,
		},
	},
	{ timestamps: true },
);
const userModel = model<IUser>("User", userSchema);
export default userModel;
