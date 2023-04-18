import { Socket } from "socket.io";
import conversationModel from "../models/conversationSchema";
import { createConversation, pushMessage } from "../services/conversations";
import { IError } from "../types/basic/IError";

export function chatSocket(socket: Socket, userId: string): void {
	/*
	On conversation start event we add users to the room with the conversationId
	
	const event={
		room:"conversationId",
		users:["user1Id","user2Id"]
	}
	*/
	socket.on("conversation", async (event) => {
		if (!event.room) {
			const id = await createConversation(event.users);
			if (id instanceof IError) {
				console.log("sokcet error");
				return;
			}
			event.room = id;
		}
		await socket.join(event.room);
		socket.in(event.room).emit("online", { user: userId });
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
		socket.in(event.room).emit("typing", event);
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
		//store message
		const message = event.message;
		await conversationModel
			.findById(event.room)
			.then(async (conversation) => {
				await pushMessage(conversation!, message);
			});
		socket.in(event.room).emit("message", { message: event.message });
	});

	socket.on("leave", async (event) => {
		socket.leave(event.room);
	});
}
