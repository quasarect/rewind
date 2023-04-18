import { IError } from "../types/basic/IError";
import { RequestHandler } from "express";
import postModel from "../models/postSchema";
import { statusCode } from "../enums/statusCodes";
import userArrayModel from "../models/userArraySchema";
import userModel from "../models/userSchema";
import fs from "fs";
import path from "path";
import { sendNotification } from "../services/notifications";
import { NotificationTypes } from "../enums/notificationEnums";
import { Types } from "mongoose";

export const getPost: RequestHandler = (req, res, next) => {
	const postId = req.params.id;
	const userId = req.user?.id;
	postModel
		.findById({ _id: postId })
		.populate({ path: "user", select: ["name", "profileUrl", "username"] })
		.populate({
			path: "likedBy",
			match: { users: userId },
		})
		.populate("dedicated.to")
		.then((result) => {
			if (!result) {
				throw new IError("Post not found", statusCode.NOT_FOUND);
			}
			res.status(200).json({ post: result });
		})
		.catch((err) => {
			next(new IError("Get post error", statusCode.NOT_FOUND));
		});
};

export const createPost: RequestHandler = (req, res, next) => {
	const userId = req.user?.id;
	const text = req.body?.text;
	const dedicated =
		req.body?.dedicated == undefined
			? undefined
			: JSON.parse(req.body.dedicated);
	const replyTo = req.body?.replyTo;
	const reshared = req.body?.reshared;
	let filepath;

	if (!text && !dedicated && !filepath) {
		return res
			.status(statusCode.BAD_REQUEST)
			.json({ message: "Invalid post" });
	}
	if (req.body.filename && req.body.fileType) {
		filepath = req.body.fileType + "/" + req.body.filename;
	}

	const post = new postModel({
		user: userId,
		text: text,
		dedicated: dedicated,
		filepath: filepath,
		replyTo: replyTo,
		reshared: reshared,
	});
	post.save()
		.then((response) => {
			res.status(200).json({
				message: "Post created successfully",
			});
		})
		.catch((err) => {
			next(
				new IError(
					"Post not created",
					statusCode.INTERNAL_SERVER_ERROR,
				),
			);
		});
	// Comment dedicating a song notif
	if (replyTo && dedicated) {
		return sendNotification(
			dedicated.to,
			userId,
			NotificationTypes.comment,
			post._id,
		);
	}
	// Only a dedication notif
	if (dedicated) {
		sendNotification(
			dedicated.to,
			userId,
			NotificationTypes.dedicate,
			post._id,
		);
	}

	// Comment notif
	if (replyTo) {
		// increment comment count
		postModel
			.findByIdAndUpdate(replyTo, { $inc: { commentCount: 1 } })
			.then((inc) => {
				sendNotification(
					inc?.user,
					userId,
					NotificationTypes.comment,
					post._id,
				);
			})
			.catch((err) => {
				console.log(err);
			});
	}
};

export const deletePost: RequestHandler = (req, res, next) => {
	const postId = req.params.id;
	postModel
		.findOneAndDelete({ _id: postId })
		.then((result) => {
			userArrayModel.deleteMany({ _id: { $in: [result?.likedBy] } });
			fs.unlink(path.resolve() + "/media/" + result?.filepath, (err) => {
				if (err) {
					console.log(err + "error deleting file");
				}
			});
			res.status(200).json({ message: "Post deleted successfully" });
		})
		.catch((err) => {
			next(new IError("Post not found", statusCode.NOT_FOUND));
		});
};

export const postsByUser: RequestHandler = async (req, res, next) => {
	const username = req.params.username;
	const user = await userModel.findOne({ username: username });
	postModel
		.find({ user: user?._id, replyTo: { $exists: false } })
		.populate({ path: "user", select: ["name", "profileUrl", "username"] })
		.populate({
			path: "likedBy",
			match: { users: user?._id },
		})
		.populate({ path: "reshared" })
		.populate("dedicated.to")
		.then((response) => {
			res.status(200).json({ posts: response });
		})
		.catch((err) => {
			next(
				new IError(
					"Error fetching posts",
					statusCode.INTERNAL_SERVER_ERROR,
				),
			);
		});
};

export const allPosts: RequestHandler = (req, res, next) => {
	const userId = req.user?.id;
	postModel
		.find({ replyTo: { $exists: false } })
		.populate({ path: "user", select: ["name", "profileUrl", "username"] })
		.populate({
			path: "likedBy",
			match: { users: userId },
		})
		.populate({ path: "reshared" })
		.populate("dedicated.to")
		.then((response) => {
			res.status(200).json({ posts: response });
		})
		.catch((err) => {
			next(new IError("No posts", statusCode.NOT_FOUND));
		});
};

export const likePost: RequestHandler = async (req, res, next) => {
	const userId = req.user?.id as Types.ObjectId;
	const post = await postModel
		.findById(req.query.id)
		.populate({ path: "likedBy", match: { users: userId } });
	if (post?.likedBy) {
		return res
			.status(statusCode.BAD_REQUEST)
			.json({ message: "ALready liked" });
	}
	postModel
		.updateOne({ _id: req.query.id }, { $inc: { likeCount: 1 } })
		.then((response) => {
			res.status(200).json({ message: "Like count incremented" });
		})
		.catch((err) => {
			next(
				new IError(
					"Couldnt increment like count",
					statusCode.INTERNAL_SERVER_ERROR,
				),
			);
		});
	postModel
		.findById(req.query.id)
		.then((post) => {
			if (!post?.likedBy) {
				const likeBy = new userArrayModel({
					users: userId,
				});
				likeBy
					.save()
					.then((users) => {
						post!.likedBy = users._id;
						post?.save()
							.then((post) => {})
							.catch((err) => {
								console.log("id store error");
								console.log(err);
							});
					})
					.catch((err) => {
						console.log("likeby store array erroe");
						console.log(err);
					});
			} else {
				userArrayModel
					.updateOne(
						{ _id: post.likedBy._id },
						{ $addToSet: { users: userId } },
					)
					.then((users) => {})
					.catch((err) => {
						console.log("Could not push user");
					});
			}
		})
		.catch((err) => {
			console.log("Error" + err);
		});
	sendNotification(post?.user!, userId, NotificationTypes.like, post?._id);
};

export const unlikePost: RequestHandler = async (req, res, next) => {
	const userId = req.user?.id;
	const post = await postModel
		.findById(req.query.id)
		.populate({ path: "likedBy", match: { users: userId } });
	if (!post?.likedBy) {
		return res
			.status(statusCode.BAD_REQUEST)
			.json({ message: "ALready unliked" });
	}
	postModel
		.updateOne({ _id: req.query.id }, { $inc: { likeCount: -1 } })
		.then((response) => {
			res.status(200).json({ message: "Like count decremented" });
		})
		.catch((err) => {
			next(
				new IError(
					"Couldnt decrement like count",
					statusCode.INTERNAL_SERVER_ERROR,
				),
			);
		});

	postModel.findById(req.query.id).then((post) => {
		if (!post) {
			return;
		}
		userArrayModel
			.findByIdAndUpdate(
				{ _id: post?.likedBy },
				{ $pull: { users: userId } },
				{ new: true },
			)
			.then((up) => {
				console.log(up);
				console.log("Updated");
			})
			.catch((err) => {
				console.log("err");
			});
	});
};

export const fetchComments: RequestHandler = (req, res, next) => {
	const postId = req.params.postId as string;
	postModel
		.find({ replyTo: { $in: [postId] }, reshared: { $exists: false } })
		.populate({ path: "user", select: "name username profileUrl" })
		.then((posts) => {
			res.status(200).json({ posts });
		})
		.catch((err) => {
			console.log(err);
			console.log("comments error");
		});
};
