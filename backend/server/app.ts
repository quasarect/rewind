import express from "express";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
// import cors from "cors";
import { IError } from "./types/basic/IError";
import spotifyRouter from "./routes/spotifyRoutes";
import postRouter from "./routes/postRouter";
import uploadRouter from "./routes/uploadRoutes";
import { isAuth, testToken } from "./middlewares/auth";
import { Server, Socket } from "socket.io";
import { chatSocket } from "./sockets/conversation";
import convoRouter from "./routes/conversationRoutes";
import userRouter from "./routes/userRoutes";
// import http from "http";

const app = express();
const port = process.env.PORT || 3000;

//Use body-parser
app.use(express.json());

// app.use(cors());
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"OPTIONS, GET, POST, PUT, PATCH, DELETE",
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization",
	);
	next();
});

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
app.use("/users", userRouter);

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
app.listen(port, async () => {
	await mongoose.connect(process.env.MONGO_URL!);
	console.log(`Rewind running on ${port}`);
});
// const server = http.createServer(app);
const io = new Server();
// console.log(io);
io.on("connection", (socket: Socket) => {
	console.log("Connected to socket.io");
	chatSocket(socket);
});
