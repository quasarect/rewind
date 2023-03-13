import { ISpotify } from "../types/models/ISpotify";
import { model, Schema } from "mongoose";

const keySchema = new Schema<ISpotify>({
	accessToken: {
		type: String,
		required: true,
	},
	refreshToken: {
		type: String,
		required: true,
	}
});
const keyModel = model<ISpotify>("Key", keySchema);
export default keyModel;
