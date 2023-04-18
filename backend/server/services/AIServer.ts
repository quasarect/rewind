import axios from "axios";
import userModel from "../models/userSchema";

export const getTagline = async (userId: string) => {
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
			.findByIdAndUpdate(userId, { aiGeneratedLine: tagline })
			.then(() => {
				console.log("tagline updated");
			})
			.catch((err) => {
				console.error(err);
				console.log("tagline update erro");
			});
		return tagline.data.tagline;
	} catch (err: any) {
		console.log(err+ "Tagline errror");
	}
};
