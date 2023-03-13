import express from "express";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { IError } from "./types/basic/IError";
import spotifyRouter from "./routes/spotifyRoutes";
const app = express();
const port = process.env.PORT || 3000;

//test route
app.use("/test", (req, res, next) => {
	console.log("Recieved the request");
	res.json({ message: "Recieved" });
});

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
