import { statusCode } from "../enums/statusCodes";
import conversationModel from "../models/conversationSchema";
import messageModel from "../models/messageSchema";
import { IError } from "../types/basic/IError";
import { IConversation } from "../types/models/IConversation";
/**
 *
 * @param users Array of users
 * @returns conversationId
 */
export const createConversation = async (users: Array<string>) => {
	try {
		const oldconversation = await conversationModel.find({
			participants: users,
		});
		if (oldconversation.length > 0) {
			return new IError("Already a conversation", statusCode.FORBIDDEN);
		}
		const conversation = new conversationModel({
			participants: users,
		});
		const data = await conversation.save();
		return data;
	} catch (err) {
		console.log(err);
		return new IError(
			"Couldnt create conversation",
			statusCode.INTERNAL_SERVER_ERROR,
		);
	}
};
/**
 *
 * @param conversationId string of conversationId
 * @returns conversation document
 */
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
/**
 *
 * @param conversation conversation MongoDB document
 * @param message
 * @example
 * const message={
 * 			userId:"",
 * 			message:""
 * 		}
 * @returns boolean
 */
export const pushMessage = async (
	conversation: IConversation,
	message: any,
) => {
	try {
		let messageId;
		let length = conversation.messages.length;
		if (length == 0) {
			// Create new message document and update in conversation model
			const newMessage = new messageModel({
				messages: [
					{
						userId: message.userId,
						message: message.message,
					},
				],
			});
			newMessage.save();
			conversationModel.findByIdAndUpdate(conversation._id, {
				$push: {
					messages: newMessage._id,
				},
			});
			length = 0;
			messageId = newMessage._id;
		} else {
			messageId = conversation.messages[length - 1];
		}
		await messageModel
			.findByIdAndUpdate(messageId, {
				$push: { messages: message },
			})
			.then((mess) => {
				console.log("message pushed");
			});
		return true;
	} catch (err) {
		console.log(err);
		console.log("message push err");
		return new IError("Message push error", 500);
	}
};
