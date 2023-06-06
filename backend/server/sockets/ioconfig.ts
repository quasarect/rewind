import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { chatSocket } from "./conversation";
import jwt from "jsonwebtoken";

export const ioConfig = (
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) => {
	io.on("connection", (socket: Socket) => {
		console.log("connected to main room");
	});
	const chatRooms = io.of("/chat");
	chatRooms.on("connection", (socket: Socket) => {
		// console.log("Connected to chat room");
		const token = socket.handshake.headers.authorization?.split(" ")[1];
		try {
			//@ts-ignore
			const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as {
				id: string;
				type: string;
				_v: string;
			};
			chatSocket(socket, decoded.id);
		} catch (err) {
			console.log("Unauthorized");
			// return;
		}
	});

	io.on("disconnect", (socket: Socket) => {});
};
