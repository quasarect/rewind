import { RequestHandler } from "express";
import conversationModel from "../models/conversationSchema";
import { IError } from "../types/basic/IError";
import { statusCode } from "../enums/statusCodes";
import { createConversation, getConversation } from "../services/conversations";

export const createConvo: RequestHandler = async (req, res, next) => {
	const users: Array<string> = req.body.users;
	const conversation = await createConversation(users);
	if (conversation instanceof IError) {
		return next(conversation);
	}
	res.status(200).json({ conversationId: conversation._id });
};

export const getConvo: RequestHandler = async (req, res, next) => {
	const conversationId = req.params.id as string;
	const conversation = await getConversation(conversationId);
	if (conversation instanceof IError) {
		return next(conversation);
	}
	res.status(200).json({ conversation });
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
