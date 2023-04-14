import { RequestHandler } from "express";
import userModel from "../models/userSchema";
import { statusCode } from "../enums/statusCodes";
import userArrayModel from "../models/userArraySchema";

export const userByFields: RequestHandler = (req, res, next) => {
	const username = req.query.username;
	const userId = req.query.userId;
	const email = req.query.email;
	let isMe = false;
	userModel
		.findOne({
			$or: [{ username }, { _id: userId }, { email }],
		})
		.populate({ path: "followers", match: { users: req.user?.id } })
		.then((user) => {
			if (!user) {
				return res.status(statusCode.NOT_FOUND);
			}
			if (req.user?.id) {
				if (req.user.id == user._id.toString()) {
					isMe = true;
				}
			}
			res.status(200).json({ user: user, isMe: isMe });
		})
		.catch((err) => {
			console.log(err);
		});
};

export const updateUser: RequestHandler = (req, res, next) => {
	const userId = req.user?.id;
	const userUpdates = req.body.updates;
	const updates = {
		name: userUpdates.name,
		description: userUpdates.description,
		username: userUpdates.username,
	};
	userModel
		.findByIdAndUpdate({ userId }, updates)
		.then((updated) => {
			res.status(200).json({ message: "User updated" });
		})
		.catch((err) => {
			console.log("Couldnt update user");
		});
};

export const followUser: RequestHandler = async (req, res, next) => {
	const followerId = req.user?.id;
	const following = req.query.id;
	// Return if follow for self
	if (followerId == following) {
		return res
			.status(statusCode.BAD_REQUEST)
			.json({ message: "Cannot follow self" });
	}
	// check if already followed
	const followed = await userModel
		.findById(following)
		.populate({ path: "followers", match: { users: followerId } });
	if (followed?.followers) {
		return res
			.status(statusCode.BAD_REQUEST)
			.json({ message: "Already followed" });
	}
	//Add in following of follower
	userModel
		.findByIdAndUpdate({ _id: followerId }, { $inc: { followingCount: 1 } })
		.then(async (user) => {
			// If objectId already exists for user array direct push
			if (user?.following) {
				return await userArrayModel
					.updateOne(
						{ _id: user.following },
						{ $addToSet: { users: following } },
					)
					.then((up) => {
						console.log("following added");
					})
					.catch((err) => {
						console.log(err);
					});
			}
			//creat new array of following
			const follow = new userArrayModel({ users: following });
			follow
				.save()
				.then((follow) => {
					console.log("following adedd");
				})
				.catch((err) => {
					console.log("dup");
					console.log(err);
				});
			//Update the id of the following array users
			userModel
				.updateOne({ _id: followerId }, { following: follow._id })
				.then((up) => {
					console.log("_id updated");
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {
			console.log(err);
		});
	// Add in follower of following
	userModel
		.findOneAndUpdate({ _id: following }, { $inc: { followerCount: 1 } })
		.then(async (user) => {
			// If objectId already exists for user array direct push

			if (user?.followers) {
				console.log("followers doc  found");
				return await userArrayModel
					.updateOne(
						{ _id: user.followers },
						{ $addToSet: { users: followerId } },
					)
					.then((rep) => {
						res.status(200).json({ message: "follower added" });
						console.log("Added follower");
					})
					.catch((err) => {
						console.log(err);
					});
			}
			// create new array of followers
			const followers = new userArrayModel({
				users: followerId,
			});
			followers
				.save()
				.then((user) => {
					console.log("Followers created");
				})
				.catch((err) => {
					console.log("dup");
					console.log(err);
				});
			// update the id of the array ka object
			userModel
				.updateOne({ _id: following }, { followers: followers._id })
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

export const unfollow: RequestHandler = async (req, res, next) => {
	const follower = req.user?.id;
	const following = req.query.id;
	if (follower == following) {
		return res
			.status(statusCode.BAD_REQUEST)
			.json({ message: "Cannot unfolow self" });
	}
	console.log(follower, following);
	await Promise.all([
		userModel
			.findOneAndUpdate(
				{ _id: follower },
				{ $inc: { followingCount: -1 } },
			)
			.then((user) => {
				userArrayModel
					.findOneAndUpdate(
						{ _id: user?.following },
						{ $pull: { users: following } },
					)
					.then((up) => {
						console.log("removde following");
					});
			}),
		userModel
			.findOneAndUpdate(
				{ _id: following },
				{ $inc: { followerCount: -1 } },
			)
			.then((user) => {
				userArrayModel
					.findOneAndUpdate(
						{ _id: user?.followers },
						{ $pull: { users: follower } },
					)
					.then((up) => {
						console.log("removde follower");
					});
			}),
	])
		.then((response) => {
			res.status(200).json({ message: "Unfollowed" });
		})
		.catch((err) => {
			console.log(err);
		});
};

export const getMe: RequestHandler = (req, res, next) => {
	const userId = req.user?.id;
	userModel
		.findById(userId)
		.then((user) => {
			res.status(200).json({ user: user });
		})
		.catch((err) => {
			console.log(err);
		});
};
