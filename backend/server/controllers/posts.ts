import { IError } from "../types/basic/IError";
import { RequestHandler } from "express";
import postModel from "../models/postSchema";
import { statusCode } from "../enums/statusCodes";
import userArrayModel from "../models/userArraySchema";

export const getPost: RequestHandler = (req, res, next) => {
	const postId = req.params.id;
	const userId = req.user?.id;
	postModel
		.findById({ _id: postId })
		.populate({ path: "user", select: ["name", "profileUrl", "username"] })
		.populate({
			path: "likedBy",
			match: { users: userId },
			select: "none",
		})
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
	const text = req.body.text;
	const imageUrl = req.body.imageUrl || undefined;
	const audioUrl = req.body.audioUrl || undefined;
	const post = new postModel({
		user: userId,
		text: text,
		imageUrl: imageUrl,
		audioUrl: audioUrl,
	});

	post.save()
		.then((response) => {
			res.status(200).json({ message: "Post created successfully" });
		})
		.catch((err) => {
			next(
				new IError(
					"Post not created",
					statusCode.INTERNAL_SERVER_ERROR,
				),
			);
		});
};

export const deletePost: RequestHandler = (req, res, next) => {
	const postId = req.params.id;

	postModel
		.deleteOne({ _id: postId })
		.then((result) => {
			res.status(200).json({ message: "Post deleted successfully" });
		})
		.catch((err) => {
			next(new IError("Post not found", statusCode.NOT_FOUND));
		});
};

export const postsByUser: RequestHandler = (req, res, next) => {
	const userId = req.params.id;

	postModel
		.find({ user: userId })
		.populate({ path: "user", select: ["name", "profileUrl", "username"] })
		.then((response) => {
			console.log(response);
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
		.find()
		.populate({ path: "user", select: ["name", "profileUrl", "username"] })
		.populate({
			path: "likedBy",
			match: { users: userId },
			select: "none",
		})
		.then((response) => {
			res.status(200).json({ posts: response });
		})
		.catch((err) => {
			next(new IError("No posts", statusCode.NOT_FOUND));
		});
};

export const likePost: RequestHandler = (req, res, next) => {
	const userId = req.user?.id;
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
	postModel.findById(req.query.id).then((post) => {
		if (!post?.likedBy) {
			const likeBy = new userArrayModel({
				users: userId,
			});
			likeBy.save().then((users) => {
				post!.likedBy = users._id;
				post?.save().then((post) => {
					console.log("saved");
				});
			});
		} else {
			userArrayModel
				.updateOne(
					{ _id: post.likedBy._id },
					{ $push: { users: userId } },
				)
				.then((users) => {
					console.log("pushded user");
				})
				.catch((err) => {
					console.log("Could not push user");
				});
		}
		// console.log(post);
	});
};

export const unlikePost: RequestHandler = (req, res, next) => {
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
		console.log(post);
		if (!post) {
			return;
		}
		userArrayModel
			.findByIdAndUpdate(
				{ _id: post?.likedBy },
				{ $pull: { users: req.user?.id } },
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
