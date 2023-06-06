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
import { Authenticated } from "../types/declarations/jwt";

export const getPost: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	try {
		const postId = req.params.id;
		const userId = req.user?.id;
		const post = await postModel
			.findById({ _id: postId })
			.populate({
				path: "user",
				select: ["name", "profileUrl", "username"],
			})
			.populate({
				path: "likedBy",
				match: { users: userId },
			})
			.populate("dedicated.to");
		if (!post) {
			return next(new IError("Post not found", statusCode.NOT_FOUND));
		}
		res.status(200).json({ post: post });
	} catch (err) {
		next(new IError("Couldnt find post", statusCode.NOT_FOUND));
	}
};

export const createPost: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	try {
		const userId = req.user?.id as string;
		const text = req.body?.text;
		const dedicated =
			req.body?.dedicated === undefined
				? undefined
				: JSON.parse(req.body.dedicated);
		const replyTo = req.body?.replyTo;
		const reshared = req.body?.reshared;
		let filepath;
		// Check if already shared and increment the count and send notification
		if (reshared) {
			const reshare = await resharePost(reshared, userId);
			// This doesnt creates a new post so dont return the post will be created below
			if (reshare instanceof IError) {
				return res
					.status(statusCode.FORBIDDEN)
					.json({ message: "Already reposted" });
			}
			return res.status(201).json({ message: "Post reshared" });
		}
		// If file is uploaded then save the path of the file in db
		if (req.body.filename && req.body.fileType) {
			filepath = req.body.fileType + "/" + req.body.filename;
		}
		// If nothing is provided then return error
		if (!text && !dedicated && !filepath && !reshared) {
			return res
				.status(statusCode.BAD_REQUEST)
				.json({ message: "Invalid post" });
		}

		const post = new postModel({
			user: userId,
			text: text,
			dedicated: dedicated,
			filepath: filepath,
			replyTo: replyTo,
			reshared: reshared,
		});
		await post.save();
		res.status(201).json({
			message: "Post created successfully",
			postId: post._id,
		});

		// Comment on a post dedicating a song notif
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
			// increment comment count of the post
			postModel
				.findByIdAndUpdate(replyTo, { $inc: { commentCount: 1 } })
				.then((inc) => {
					// send notification to the user who posted the post
					sendNotification(
						inc?.user,
						userId,
						NotificationTypes.comment,
						post._id,
					);
				});
		}
	} catch (err) {
		next(new IError("Post not created", statusCode.INTERNAL_SERVER_ERROR));
	}
};

export const deletePost: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	try {
		const postId = req.params.id;
		// Delete the post
		const result = await postModel.findOneAndDelete({ _id: postId });
		// remove the list of all users list who reposted the post
		if (result?.resharedBy) {
			userArrayModel.findByIdAndDelete({
				_id: result.resharedBy,
			});
		}
		// decrement the reshare count of the post if it was reshared
		if (result?.reshared) {
			postModel.findByIdAndUpdate(result.reshared, {
				$inc: { reshareCount: -1 },
			});
		}
		// remove the list of all users who liked the post
		await userArrayModel.findByIdAndDelete({ _id: result?.likedBy });
		// If the post has a file then delete the file
		if (result?.filepath) {
			fs.unlink(path.resolve() + "/media/" + result?.filepath, (err) => {
				if (err) {
					console.error("Error deleting file", err);
				}
			});
		}
		// If the post is a reply then decrement the comment count of the post
		if (result?.replyTo) {
			postModel.findByIdAndUpdate(result.replyTo, {
				$inc: { commentCount: -1 },
			});
		}
		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		next(new IError("Post not deleted", statusCode.INTERNAL_SERVER_ERROR));
	}
};

export const postsByUser: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	try {
		const username = req.params.username;
		const user = await userModel.findOne({ username: username });
		const posts = await postModel
			.find({ user: user?._id, replyTo: { $exists: false } })
			.populate({
				path: "user",
				select: ["name", "profileUrl", "username"],
			})
			.populate({
				path: "likedBy",
				match: { users: user?._id },
			})
			.populate({ path: "reshared" })
			.populate("dedicated.to");
		res.status(200).json({ posts: posts });
	} catch (err) {
		next(
			new IError(
				"Error fetching posts",
				statusCode.INTERNAL_SERVER_ERROR,
			),
		);
	}
};

export const allPosts: RequestHandler = (req: Authenticated, res, next) => {
	const userId = req.user?.id;
	postModel
		.find({ replyTo: { $exists: false } })
		.populate({ path: "user", select: ["name", "profileUrl", "username"] })
		.populate({
			path: "likedBy",
			match: { users: userId },
		})
		.populate("reshared")
		.populate({
			path: "resharedBy",
			match: { users: userId },
		})
		.populate("dedicated.to")
		.then((response) => {
			res.status(200).json({ posts: response });
		})
		.catch((err) => {
			next(new IError("No posts", statusCode.NOT_FOUND));
		});
};

export const likePost: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	try {
		const userId = req.user?.id as Types.ObjectId;
		const alreadylikedpost = await postModel
			.findById(req.query.id)
			.populate({ path: "likedBy", match: { users: userId } });
		// If the post is already liked by the user then return
		if (alreadylikedpost?.likedBy) {
			return res
				.status(statusCode.BAD_REQUEST)
				.json({ message: "Already liked" });
		}
		// Increment the like count of the post
		const post = await postModel.findByIdAndUpdate(req.query.id, {
			$inc: { likeCount: 1 },
		});
		// If the post has no likedBy array then create one and add the user to it
		if (!post?.likedBy) {
			const likeBy = await new userArrayModel({
				users: userId,
			}).save();
			post!.likedBy = likeBy._id;
			post?.save();
			// This is the same as the above code if it not works
			// likeBy
			// 	.save()
			// 	.then((users) => {
			// 		post!.likedBy = users._id;
			// 		post?.save();
			// 	})
		}
		// If the post has a likedBy array then add the user to it
		else {
			userArrayModel.updateOne(
				{ _id: post.likedBy._id },
				{ $addToSet: { users: userId } },
			);
		}
		res.status(200).json({ message: "Like count incremented" });
		sendNotification(
			post?.user!,
			userId,
			NotificationTypes.like,
			post?._id,
		);
	} catch (err) {
		next(
			new IError(
				"Couldnt Like the post",
				statusCode.INTERNAL_SERVER_ERROR,
			),
		);
	}
};

export const unlikePost: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	try {
		const userId = req.user?.id;
		const alreadyunlikepost = await postModel
			.findById(req.query.id)
			.populate({ path: "likedBy", match: { users: userId } });
		if (!alreadyunlikepost) {
			throw new IError("Post not found", statusCode.NOT_FOUND);
		}
		// Check if the post is already unliked
		if (!alreadyunlikepost?.likedBy) {
			return res
				.status(statusCode.BAD_REQUEST)
				.json({ message: "Already unliked" });
		}
		// Decrement the like count of the post
		const post = await postModel.findByIdAndUpdate(req.query.id, {
			$inc: { likeCount: -1 },
		});
		// Remove the user from the likedBy array
		await userArrayModel.findByIdAndUpdate(
			{ _id: post?.likedBy },
			{ $pull: { users: userId } },
		);
		res.status(200).json({ message: "Unliked the post" });
	} catch (err) {
		next(
			new IError(
				"Couldnt unlike the post",
				statusCode.INTERNAL_SERVER_ERROR,
			),
		);
	}
};

export const fetchComments: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	try {
		const postId = req.params.postId as string;
		const posts = await postModel
			.find({ replyTo: { $in: [postId] }, reshared: { $exists: false } })
			.populate({ path: "user", select: "name username profileUrl" });
		res.status(200).json({ posts: posts });
	} catch (err) {
		next(
			new IError(
				"Couldnt fetch comments",
				statusCode.INTERNAL_SERVER_ERROR,
			),
		);
	}
};
/**
 *
 * @param reshared  Id of the post reshared
 * @param userId The post reshared by the user
 * @returns
 */
async function resharePost(
	reshared: Types.ObjectId,
	userId: string,
): Promise<any> {
	try {
		// Find the post to be reshared
		let post = await postModel.findById(reshared);
		// Check if the user already reshared the post
		const alreadyReposted = await post
			?.populate({ path: "resharedBy", match: { users: userId } })
			.then((post) => {
				if (post.resharedBy) {
					return new IError("Already reposted", statusCode.FORBIDDEN);
				}
				return post;
			});
		if (alreadyReposted instanceof IError) {
			return alreadyReposted;
		}
		// Increment the reshare count of the post reshared
		post = await postModel.findByIdAndUpdate(reshared, {
			$inc: { reshareCount: 1 },
		});
		// If the post is already reshared by someone else then add the user to the array
		if (post?.resharedBy) {
			await userArrayModel.findByIdAndUpdate(post.resharedBy, {
				$push: { users: userId },
			});
		}
		// If the post is not reshared by anyone then create a new array and add the user to it
		else {
			const user = new userArrayModel({
				users: userId,
			});
			await user.save();
			await postModel.findByIdAndUpdate(post?._id, {
				resharedBy: user._id,
			});
		}
		
		// Send notification for reshare
		await sendNotification(
			post?.user,
			userId,
			NotificationTypes.reshare,
			post?._id,
		);
	} catch (err) {
		return new IError("Reshare error", statusCode.INTERNAL_SERVER_ERROR);
	}
}
