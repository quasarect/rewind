import { RequestHandler } from "express";
import conversationModel from "../models/conversationSchema";

export const createConvo: RequestHandler = (req, res, next) => {
	const users: Array<any> = req.body.users;

	const conversation = new conversationModel({
		lastMessage: "",
		messages: [{}],
		participants: users,
	});
	conversation.save().then((response) => {
		res.status(200).json({ conversationId: conversation._id });
	});
};

export const getConvo: RequestHandler = (req, res, next) => {
	const conversationId = req.params.id;
	conversationModel.find({ _id: conversationId }).then((response) => {
		res.status(200).json({ conversation: response });
	});
};

export const userConvos: RequestHandler = (req, res, next) => {
	const userId = req.params.id;
	conversationModel
		.find({ participants: { $in: [userId] } })
		.then((response) => {
			res.status(200).json({ conversations: response });
		});
};
