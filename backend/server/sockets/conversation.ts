import { Socket } from "socket.io";
import { IMessage } from "../types/basic/IMessage";
import conversationModel from "../models/conversationSchema";

export function chatSocket(socket: Socket): void {
	/*
	On conversation start event we add users to the room with the conversationId
	
	const event={
		room:"conversationId"
	}
	*/
	socket.on("conversation", (event) => {
		console.log("conversation");
		socket.join(event.id);
	});
	/* On typing and stoptyping event we emit typing action and array of users
	event={
		room:"conversationId",
		user:[
			"userIdentifier"     as per preference
		]    
		}
	*/
	socket.on("typing", (event) => {
		console.log("typing");
		socket.in(event.room).emit("typing", { user: event.user });
	});
	socket.on("stopTyping", (event) => {
		socket.in(event.room).emit("stopTyping", { user: event.user });
	});
	/* 
	On message sent event we emit to all room connected users.
	event={
		room:"conversationId",
		message:{
			userId,     
			text
		}
	}
	*/

	socket.on("message", async (event) => {
		console.log("message");
		//store message
		const message: IMessage = {
			userId: event.message.userId,
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
