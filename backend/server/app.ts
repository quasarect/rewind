import express from "express";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { IError } from "./types/basic/IError";
import spotifyRouter from "./routes/spotifyRoutes";
import postRouter from "./routes/postRouter";
import querystring from "querystring";
const app = express();
const port = process.env.PORT || 3000;

//test route
app.use("/test", (req, res, next) => {
	console.log("Recieved the request");
	res.json({ message: "Recieved" });
});

app.get("/authUrl", (req, res) => {
	const scope = "user-read-private user-read-email";
	res.redirect(
		"https://accounts.spotify.com/authorize?" +
			querystring.stringify({
				response_type: "code",
				client_id: process.env.SPOTIFY_CLIENT_ID,
				scope: scope,
				redirect_uri: process.env.REDIRECT_URL,
			})
	);
});

app.use('/posts',postRouter);

app.use("/spotify", spotifyRouter);



// Error handling middleware
app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
	res.status(error.code).json({ message: error.message });
});

// Start the server
app.listen(port, async () => {
	await mongoose.connect(process.env.MONGO_URL!);
	console.log(`Musistic running on ${port}`);
});
