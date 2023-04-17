import mongoose from "mongoose";

export interface IGroup {
	name: string;
	description: string;
	createdBy: mongoose.Schema.Types.ObjectId;
}
