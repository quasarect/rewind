import { Socket } from "socket.io";
import conversationModel from "../models/conversationSchema";
import { pushMessage } from "../services/conversations";

function createTime(): any {
	const d = new Date();
	let hours = d.getUTCHours();
	let minutes: any = d.getUTCMinutes();
	const ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? "0" + minutes : minutes;
	const timeString = hours + ":" + minutes + " " + ampm;
	return timeString;
}

export function chatSocket(socket: Socket, userId: string): void {
	/*
	On conversation start event we add users to the room with the conversationId
	
	const event={
		room:"conversationId",
		users:["user1Id","user2Id"]
	}
	*/
	socket.on("conversation", async (event) => {
		if (event.room === null) {
			console.log("no room id");
			return;
		}
		await socket.join(event.room);
		await conversationModel.findByIdAndUpdate(event.room, {
			$set: { seen: true },
		});
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
		// console.log("typing");
		// console.log(event.text);
		socket.in(event.room).emit("typing", userId);
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
		if (event.message.text === null) {
			console.log("no text");
			return;
		}
		// return;
		const timestamp = createTime();
		try {
			await conversationModel
				.findById(event.room)
				.then(async (conversation) => {
					await pushMessage(conversation!, {
						userId: userId,
						message: event.message.text,
						timestamp: timestamp,
					});
				});
		} catch (err) {
			console.log(err);
		}
		socket.in(event.room).emit("message", {
			message: {
				...event.message,
				timestamp: timestamp,
			},
			userId: userId,
		});
	});

	socket.on("leave", async (event) => {
		socket.leave(event.room);
	});
}
