import axios from "axios";
import userModel from "../models/userSchema";

export const setTagline = async (userId: string) => {
	try {
		const tagline = await axios.get(
			process.env.AI_SERVER_URL! + "/tagline",
			{
				headers: {
					Authorization: "Bearer " + userId,
				},
			},
		);
		await userModel
			.findByIdAndUpdate(userId, {
				aiGeneratedLine: tagline.data.tagline,
			})
			.then(() => {
				console.log("tagline updated");
			})
			.catch((err) => {
				console.error(err);
				console.log("tagline update error");
			});
		return tagline.data.tagline;
	} catch (err: any) {
		console.log(err + "Tagline errror");
	}
};
