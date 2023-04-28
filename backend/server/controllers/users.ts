import { RequestHandler } from "express";
import userModel from "../models/userSchema";
import { statusCode } from "../enums/statusCodes";
import userArrayModel from "../models/userArraySchema";
import { IError } from "../types/basic/IError";
import { sendNotification } from "../services/notifications";
import { NotificationTypes } from "../enums/notificationEnums";
import notificationModel from "../models/notificationSchema";
import conversationModel from "../models/conversationSchema";
import { Authenticated } from "../types/declarations/jwt";

export const updateUser: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	try {
		const userId = req.user?.id;
		const userUpdates = req.body;
		// Add a validation later in middleware
		if (!userUpdates.name || !userUpdates.username) {
			return res
				.status(statusCode.BAD_REQUEST)
				.json({ message: "Name or Username cannot be empty" });
		}

		await userModel.findByIdAndUpdate(userId, {
			name: userUpdates?.name,
			bio: userUpdates?.bio,
			username: userUpdates?.username,
			aiGeneratedLine: userUpdates?.tagline,
		});

		res.status(200).json({ message: "User updated" });
	} catch (err) {
		next(
			new IError(
				"Error updating the user",
				statusCode.INTERNAL_SERVER_ERROR,
			),
		);
	}
};

export const followUser: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	const followerId = req.user?.id;
	const following = req.query.id;
	// Return if follow for self
	if (followerId === following) {
		return next(new IError("Cannot follow self", statusCode.BAD_REQUEST));
	}
	// check if already followed
	const followed = await userModel
		.findById(following)
		.populate({ path: "followers", match: { users: followerId } });
	if (followed?.followers) {
		return next(new IError("Already followed", statusCode.BAD_REQUEST));
	}
	try {
		await Promise.all([
			//Add in following of follower
			userModel
				.findByIdAndUpdate(
					{ _id: followerId },
					{ $inc: { followingCount: 1 } },
				)
				.then(async (user) => {
					// If objectId already exists for user array direct push
					if (user?.following) {
						return await userArrayModel.updateOne(
							{ _id: user.following },
							{ $addToSet: { users: following } },
						);
					}
					//creat new array of following
					const follow = await new userArrayModel({
						users: following,
					}).save();

					//Update the id of the following array users
					userModel.updateOne(
						{ _id: followerId },
						{ following: follow._id },
					);
				}),
			// Add in follower of following
			userModel
				.findOneAndUpdate(
					{ _id: following },
					{ $inc: { followerCount: 1 } },
				)
				.then(async (user) => {
					// If objectId already exists for user array direct push

					if (user?.followers) {
						return await userArrayModel.updateOne(
							{ _id: user.followers },
							{ $addToSet: { users: followerId } },
						);
					}
					// create new array of followers
					const followers = new userArrayModel({
						users: followerId,
					});
					followers.save();

					// update the id of the array ka object
					userModel.updateOne(
						{ _id: following },
						{ followers: followers._id },
					);
				}),
		]);
		res.status(200).json({ message: "Followed" });
		await sendNotification(following, followerId, NotificationTypes.follow);
	} catch (err) {
		next(
			new IError(
				"Error following the user",
				statusCode.INTERNAL_SERVER_ERROR,
			),
		);
	}
};

export const unfollow: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	try {
		const follower = req.user?.id;
		const following = req.query.id;
		if (follower === following) {
			return res
				.status(statusCode.BAD_REQUEST)
				.json({ message: "Cannot unfollow self" });
		}
		await Promise.all([
			userModel
				.findOneAndUpdate(
					{ _id: follower },
					{ $inc: { followingCount: -1 } },
				)
				.then((user) => {
					userArrayModel.findOneAndUpdate(
						{ _id: user?.following },
						{ $pull: { users: following } },
					);
				}),
			userModel
				.findOneAndUpdate(
					{ _id: following },
					{ $inc: { followerCount: -1 } },
				)
				.then((user) => {
					userArrayModel.findOneAndUpdate(
						{ _id: user?.followers },
						{ $pull: { users: follower } },
					);
				}),
		]);

		res.status(200).json({ message: "Unfollowed" });
	} catch (err) {
		next(
			new IError(
				"Error unfollowing the user",
				statusCode.INTERNAL_SERVER_ERROR,
			),
		);
	}
};

export const getMe: RequestHandler = async (req: Authenticated, res, next) => {
	try {
		const userId = req.user?.id;
		const user = await userModel
			.findById(userId)
			.populate("spotifyData")
			.populate("lastNotif");
		let createdAt;
		if (user?.lastNotif) {
			//@ts-ignore
			createdAt = user.lastNotif.createdAt;
		} else {
			//@ts-ignore
			createdAt = user?.createdAt;
		}
		const notificationCount = await notificationModel
			.find({
				createdAt: { $gt: createdAt },
				recipient: user?._id,
			})
			.count();
		const messageCount = await conversationModel
			.find({ by: { $ne: user?._id }, seen: false })
			.count();
		res.status(200).json({
			user: {
				// @ts-ignore
				...user._doc,
				notifCount: notificationCount || 0,
				messageCount: messageCount || 0,
			},
		});
	} catch (err) {
		next(
			new IError("Error getting user", statusCode.INTERNAL_SERVER_ERROR),
		);
	}
};

export const usernameUnique: RequestHandler = (
	req: Authenticated,
	res,
	next,
) => {
	const username = req.query.username;
	if (username == undefined) {
		return res.status(statusCode.FORBIDDEN).json({ message: "Invalid" });
	}
	userModel.findOne({ username: username }).then((user) => {
		if (user) {
			return res
				.status(statusCode.FORBIDDEN)
				.json({ message: "Username already taken" });
		}
		res.status(200).json({ message: "Username available" });
	});
};
