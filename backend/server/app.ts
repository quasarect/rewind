import express from "express";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { IError } from "./types/basic/IError";
import spotifyRouter from "./routes/spotifyRoutes";
import postRouter from "./routes/postRouter";
import querystring from "querystring";
import uploadRouter from "./routes/uploadRoutes";
import { isAuth, testToken } from "./middlewares/auth";
import { Server, Socket } from "socket.io";
import { chatSocket } from "./sockets/conversation";
import convoRouter from "./routes/conversationRoutes";
import http from "http";
const app = express();
const port = process.env.PORT || 3000;
//Use body-parser
app.use(express.json());
//test route
app.use("/test", (req, res, next) => {
	console.log("Recieved the request");
	res.json({ message: "Recieved" });
});

// Get Oauth url
app.get("/authUrl", (req, res) => {
	const scope = "user-read-private user-read-email";
	res.json({
		URL:
			"https://accounts.spotify.com/authorize?" +
			querystring.stringify({
				response_type: "code",
				client_id: process.env.SPOTIFY_CLIENT_ID,
				scope: scope,
				redirect_uri: process.env.REDIRECT_URL,
			}),
	});
});

// Call to get token and check auth
app.get("/ping", testToken);
app.post("/ping", isAuth);

// Post routes
app.use("/posts", postRouter);

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
io.on("connection", (socket) => {
	console.log("Connected to socket.io");
	chatSocket(socket);
});
