import { RequestHandler } from "express";
import userModel from "../models/userSchema";
import { statusCode } from "../enums/statusCodes";
import { IError } from "../types/basic/IError";

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
