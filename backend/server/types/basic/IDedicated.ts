import mongoose from "mongoose";

export interface IDedicated {
	songName: string;
	songPhoto: string;
	songUrl: string;
	to: mongoose.Schema.Types.ObjectId;
}
