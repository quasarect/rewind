import express from "express";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import { IError } from "./types/basic/IError";
import spotifyRouter from "./routes/spotifyRoutes";
import postRouter from "./routes/postRouter";
import { isAuth, testToken } from "./middlewares/auth";
import { Server, Socket } from "socket.io";
import { chatSocket } from "./sockets/conversation";
import convoRouter from "./routes/conversationRoutes";
import userRouter from "./routes/userRoutes";
import http from "http";
import { config } from "dotenv";
import searchRouter from "./routes/searchRoutes";
import jwt from "jsonwebtoken";

config();

const app = express();
const port = process.env.PORT || 3000;
app.use("/media", express.static("media"));
//Use body-parser
app.use(express.json());

app.use(cors());

//test route
app.use("/test", (req, res, next) => {
	console.log("Recieved the request");
	res.json({ message: "Recieved" });
});

// Call to get token and check auth
app.get("/ping", isAuth);
app.post("/ping", testToken);

// Post routes
app.use("/posts", postRouter);

// User routes
app.use("/user", userRouter);

//Conversation routes
app.use("/convo", convoRouter);

//Spotify routes
app.use("/spotify", spotifyRouter);

// Search routes
app.use("/search", searchRouter);

// Error handling
app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
	console.log("Error handler");
	console.log(error);
	res.status(error.code).json({ message: error.message });
});

// Start the server
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
		allowedHeaders: ["Authorization"],
	},
});

io.on("connection", (socket: Socket) => {
	console.log("Connected to socket.io");
	const token = socket.handshake.headers.authorization?.split(" ")[1];

	const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as {
		id: string;
		type: string;
	};
	if (!decoded) {
		return console.log("unauthorized");
	}
	chatSocket(socket, decoded.id);
});

server.listen(port, async () => {
	mongoose
		.connect(process.env.MONGO_URL!)
		.then(() => console.log("Connected to MongoDB"))
		.catch((err: Error) =>
			console.log("Couldnt connect to mongodb :" + err),
		);
});
