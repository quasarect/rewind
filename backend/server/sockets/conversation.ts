import { Socket } from "socket.io";
import { IMessage } from "../types/basic/IMessage";
import conversationModel from "../models/conversationSchema";

export function chatSocket(socket: Socket) {
	// On conversation start event we add users to the room with the conversationId
	socket.on("conversation", (data) => {
		socket.join(data.id);
	});
	// On typing and stoptyping event we emit typing action and array of users
	socket.on("typing", (event) => {
		socket.in(event.room).emit("typing", { user: event.user });
	});
	socket.on("stopTyping", (event) => {
		socket.in(event.room).emit("stopTyping", { user: event.user });
	});
	// On message sent event we emit to all room connected users.
	socket.on("message", async (event) => {
		//store message
		const message: IMessage = {
			username: event.message.username,
			message: event.message.text,
			timestamp: Date.now(),
		};
		await conversationModel.updateOne(
			{ _id: event.room },
			{ $push: { messages: message }, lastMessage: event.message.text },
		);
		socket.in(event.room).emit("message", { message: event.message });
	});
}
