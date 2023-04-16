import { statusCode } from "../enums/statusCodes";
import conversationModel from "../models/conversationSchema";
import { IError } from "../types/basic/IError";

export const createConversation = async (users: Array<string>) => {
	const conversation = new conversationModel({
		participants: users,
	});
	try {
		const data = await conversation.save();
		return data;
	} catch (err) {
		return new IError(
			"Couldnt create conversation",
			statusCode.INTERNAL_SERVER_ERROR,
		);
	}
};

export const getConversation = async (conversationId: string) => {
	try {
		const data = conversationModel.find({ _id: conversationId });
		return data;
	} catch (err) {
		new IError(
			"Couldnt find a conversation",
			statusCode.INTERNAL_SERVER_ERROR,
		);
	}
};
