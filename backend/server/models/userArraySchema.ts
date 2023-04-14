import mongoose, { Schema, model } from "mongoose";
import { IUsersArray } from "../types/models/IUsersArray";

const userArraySchema = new Schema<IUsersArray>({
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			// unique: true,
		},
	],
});

const userArrayModel = model<IUsersArray>("UserArray", userArraySchema);
export default userArrayModel;
