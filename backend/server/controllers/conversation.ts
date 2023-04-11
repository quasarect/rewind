import { RequestHandler } from "express";
import conversationModel from "../models/conversationSchema";
import { IError } from "../types/basic/IError";
import { statusCode } from "../enums/statusCodes";

export const createConvo: RequestHandler = (req, res, next) => {
	const users: Array<string> = req.body.users;
	const conversation = new conversationModel({
		lastMessage: "",
		messages: [{}],
		participants: users,
	});
	conversation
		.save()
		.then((response) => {
			res.status(200).json({ conversationId: conversation._id });
		})
		.catch((err) => {
			next(
				new IError(
					"Couldnt create conversation",
					statusCode.INTERNAL_SERVER_ERROR,
				),
			);
		});
};

export const getConvo: RequestHandler = (req, res, next) => {
	const conversationId = req.params.id;
	conversationModel
		.find({ _id: conversationId })
		.then((response) => {
			res.status(200).json({ conversation: response });
		})
		.catch((err) => {
			next(
				new IError(
					"Couldnt find a conversation",
					statusCode.INTERNAL_SERVER_ERROR,
				),
			);
		});
};

export const userConvos: RequestHandler = (req, res, next) => {
	const userId = req.params.id;
	conversationModel
		.find({ participants: { $in: [userId] } })
		.then((response) => {
			res.status(200).json({ conversations: response });
		})
		.catch((err) => {
			next(new IError("No conversations found", statusCode.NOT_FOUND));
		});
};
