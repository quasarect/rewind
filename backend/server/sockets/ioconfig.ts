import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { chatSocket } from "./conversation";
import jwt from "jsonwebtoken";
import { musicRoom } from "./musicRooms";

export const ioConfig = (
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) => {
	const chatRooms = io.of("/chat");
	chatRooms.on("connection", (socket: Socket) => {
		const token = socket.handshake.headers.authorization?.split(" ")[1];
		const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as {
			id: string;
			type: string;
			_v: string;
		};
		chatSocket(socket, decoded.id);
	});

	const musicRooms = io.of("/music");
	musicRooms.on("connection", (socket: Socket) => {
		const token = socket.handshake.headers.authorization?.split(" ")[1];
		const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as {
			id: string;
			type: string;
			_v: string;
		};
		musicRoom(socket, decoded.id);
	});
};
