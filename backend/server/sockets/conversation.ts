import { Socket } from "socket.io";
import conversationModel from "../models/conversationSchema";
import { createConversation } from "../services/conversations";
import { IError } from "../types/basic/IError";
import messageModel from "../models/messageSchema";

export function chatSocket(socket: Socket, userId: string): void {
	/*
	On conversation start event we add users to the room with the conversationId
	
	const event={
		room:"conversationId",
		users:["user1Id","user2Id"]
	}
	*/
	socket.on("conversation", async (event) => {
		console.log("conversation");
		if (!event.room) {
			const id = await createConversation(event.users);
			if (id instanceof IError) {
				console.log("error");
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
		socket.in(event.room).emit("typing", { user: userId });
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
		const message = event.message;
		await conversationModel.findById(event.room).then((conversation) => {
			messageModel.findByIdAndUpdate(conversation?.messages[0]._id, {
				$push: { messages: message },
			});
		});
		socket.in(event.room).emit("message", { message: event.message });
	});

	socket.on("leave", async (event) => {
		socket.leave(event.room);
	});
}
