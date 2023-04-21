import { RequestHandler } from "express";
import conversationModel from "../models/conversationSchema";
import { IError } from "../types/basic/IError";
import { statusCode } from "../enums/statusCodes";
import {
	createConversation,
	getConversation,
	pushMessage,
} from "../services/conversations";
import { Authenticated } from "../types/declarations/jwt";

export const createConvo: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	try {
		const userId = req.query.userId as string;
		const userId1 = req.user?.id as string;
		if (userId === userId1) {
			return res
				.json(statusCode.FORBIDDEN)
				.json({ message: "self conversation" });
		}
		const conversation = await createConversation([userId, userId1]);
		if (conversation instanceof IError) {
			return next(conversation);
		}
		res.status(200).json({ conversationId: conversation._id });
	} catch (err) {
		next(new IError("Couldnt create conversation", 500));
	}
};

export const getConvo: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	try {
		const conversationId = req.query.id as string;
		const conversation = await getConversation(conversationId);
		if (conversation instanceof IError) {
			return next(conversation);
		}
		res.status(200).json({ conversation });
	} catch (err) {
		next(new IError("Couldnt retrieve conversation", 500));
	}
};

export const userConvos: RequestHandler = (req: Authenticated, res, next) => {
	const userId = req.user?.id;
	conversationModel
		.find({ participants: { $in: [userId] } })
		.populate("participants")
		.then((conversations) => {
			res.status(200).json({ conversations });
		})
		.catch((err) => {
			console.log(err);
			next(new IError("No conversations found", statusCode.NOT_FOUND));
		});
};

export const sendMessage: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	try {
		const conversationId = req.query.id;
		const message = req.body.message;
		await conversationModel.findById(conversationId).then((con) => {
			pushMessage(con!, message);
		});
		res.status(200).json({ message: "message added" });
	} catch (err) {
		next(new IError("Message send error", 500));
	}
};
