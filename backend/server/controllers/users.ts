import { RequestHandler } from "express";
import userModel from "../models/userSchema";
import { statusCode } from "../enums/statusCodes";
import { IError } from "../types/basic/IError";
import userArrayModel from "../models/userArraySchema";

export const userByID: RequestHandler = (req, res, next) => {
	const userId = req.params.id;
	userModel
		.findById(userId)
		.then((user) => {
			if (!user) {
				return res
					.status(statusCode.NOT_FOUND)
					.json({ message: "User not found" });
			}
			res.status(200).json({ user: user });
		})
		.catch((err) => {
			next(
				new IError(
					"Error finding user",
					statusCode.INTERNAL_SERVER_ERROR,
				),
			);
		});
};

export const userbyEmail: RequestHandler = (req, res, next) => {
	const email = req.params.email;
	userModel
		.find({ email: email })
		.then((user) => {
			if (!user) {
				return res
					.status(statusCode.NOT_FOUND)
					.json({ message: "user not found" });
			}
			res.status(200).json({ user: user });
		})
		.catch((err) => {
			next(
				new IError(
					"Error finding user",
					statusCode.INTERNAL_SERVER_ERROR,
				),
			);
		});
};

export const followUser: RequestHandler = async (req, res, next) => {
	const followerId = req.user?.id;
	const following = req.query.id;
	const followed = await userModel
		.findById(followerId)
		.populate({ path: "followers", match: { users: following } });
	if (followed?.followers) {
		console.log(followed);
		return res
			.status(statusCode.BAD_REQUEST)
			.json({ message: "Already followed" });
	}
	userModel
		.findOneAndUpdate({ _id: followerId }, { $inc: { followerCount: 1 } })
		.then(async (user) => {
			console.log("count incremented");
			if (user?.followers) {
				console.log("followers doc  found");
				return await userArrayModel
					.updateOne(
						{ _id: user.followers },
						{ $push: { users: followerId } },
					)
					.then((rep) => {
						res.status(200).json({ message: "follower added" });
						console.log("Added follower");
					})
					.catch((err) => {
						console.log(err);
					});
			}
			const followers = new userArrayModel({
				users: followerId,
			});
			followers
				.save()
				.then((user) => {
					console.log("Followers created");
				})
				.catch((err) => {
					console.log(err);
				});
			userModel
				.updateOne({ _id: followerId }, { followers: followers._id })
				.then((user) => {
					console.log("updated user" + user);
					res.status(200).json({ message: "follower added" });
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {
			console.log("err" + err);
		});
};
