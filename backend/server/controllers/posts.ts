import { IError } from "../types/basic/IError";
import { RequestHandler } from "express";
import postModel from "../models/postSchema";
import { statusCode } from "../enums/statusCodes";
import userArrayModel from "../models/userArraySchema";
import userModel from "../models/userSchema";

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
			userModel
				.findOneAndUpdate({ _id: userId }, { $inc: { postCount: 1 } })
				.then((user) => {
					res.status(200).json({
						message: "Post created successfully",
					});
				})
				.catch((err) => {
					console.log(err);
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

export const postsByUser: RequestHandler = async (req, res, next) => {
	const username = req.params.username;
	const user = await userModel.findOne({ username: username });
	postModel
		.find({ user: user?._id })
		.populate({ path: "user", select: ["name", "profileUrl", "username"] })
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
		.find()
		.populate({ path: "user", select: ["name", "profileUrl", "username"] })
		.populate({
			path: "likedBy",
			match: { users: userId },
		})
		.then((response) => {
			res.status(200).json({ posts: response });
		})
		.catch((err) => {
			next(new IError("No posts", statusCode.NOT_FOUND));
		});
};

export const likePost: RequestHandler = async (req, res, next) => {
	const userId = req.user?.id;
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
			console.log(post?.likedBy);
			if (!post?.likedBy) {
				const likeBy = new userArrayModel({
					users: userId,
				});
				likeBy
					.save()
					.then((users) => {
						console.log("likedby array created");
						post!.likedBy = users._id;
						post?.save()
							.then((post) => {
								console.log("Post updated with likedby _id");
							})
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
					.then((users) => {
						console.log("pushed liked user");
					})
					.catch((err) => {
						console.log("Could not push user");
					});
			}
			// console.log(post);
		})
		.catch((err) => {
			console.log("Error" + err);
		});
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
