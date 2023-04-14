import express from "express";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import { IError } from "./types/basic/IError";
import spotifyRouter from "./routes/spotifyRoutes";
import postRouter from "./routes/postRouter";
import uploadRouter from "./routes/uploadRoutes";
import { isAuth, testToken } from "./middlewares/auth";
import { Server, Socket } from "socket.io";
import { chatSocket } from "./sockets/conversation";
import convoRouter from "./routes/conversationRoutes";
import userRouter from "./routes/userRoutes";
import http from "http";
import { config } from "dotenv";

config();

const app = express();
const port = process.env.PORT || 3000;

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

// Upload routes
app.use("/uploads", isAuth, uploadRouter);

// Error handling
app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
	console.log("Error handler");
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
	// console.log(socket);
	chatSocket(socket);
});

server.listen(port, async () => {
	mongoose
		.connect(process.env.MONGO_URL!)
		.then(() => console.log("Connected to MongoDB"))
		.catch((err: Error) => console.log(err));
});
