import { IUser } from "../types/models/IUser";
import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema<IUser>(
	{
		//Spotify
		name: {
			type: String,
			required: true,
		},
		//Rewind unique
		username: {
			type: String,
			// required: true,
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
		//Spotify
		userId: {
			type: String,
			required: true,
			unique: true,
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
			default: "",
		},
		// rewind from AI
		tag: {
			type: String,
		},
		//rewind 
		description: {
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
		//Spotify
		spotifyData: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "keyModel",
		},
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "",
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "",
			},
		],
	},
	{ timestamps: true },
);
const userModel = model<IUser>("User", userSchema);
export default userModel;
