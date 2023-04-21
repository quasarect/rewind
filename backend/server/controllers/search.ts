import { RequestHandler } from "express";
import userModel from "../models/userSchema";
import { statusCode } from "../enums/statusCodes";
import { IError } from "../types/basic/IError";
import { searchGlobalTracks } from "../services/spotify";
import postModel from "../models/postSchema";
import { Authenticated } from "../types/declarations/jwt";

export const globalSearch: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	const searchText: string = req.query.text as string;
	await Promise.all([
		postModel
			.find({
				$or: [{ text: { $regex: searchText, $options: "i" } }],
			})
			.populate({ path: "user", select: "name username profileUrl" }),
		userModel
			.find({
				$or: [
					{ username: { $regex: searchText, $options: "i" } },
					{ email: { $regex: searchText, $options: "i" } },
					{ userId: { $regex: searchText, $options: "i" } },
					{ name: { $regex: searchText, $options: "i" } },
				],
			})
			.select("name username email profileUrl"),
	])
		.then((global) => {
			res.status(200).json({ users: global[1], posts: global[0] });
		})
		.catch((err) => {
			console.log(err);
		});
};

export const searchbyUsername: RequestHandler = (
	req: Authenticated,
	res,
	next,
) => {
	const username = req.query.username as string;
	const regexp = new RegExp(username, "i");
	userModel
		.find({ username: regexp })
		.select("name username profileUrl email")
		.then((users) => {
			if (users.length == 0) {
				return res
					.status(statusCode.NOT_FOUND)
					.json({ message: "No user found" });
			}
			res.status(200).json({ users: users });
		})
		.catch((err) => {
			next(
				new IError(
					"Couldnt get users",
					statusCode.INTERNAL_SERVER_ERROR,
				),
			);
		});
};

export const searchSong: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	try {
		const songText = req.query.text as string;
		const userId = req.user?.id;
		const user = await userModel.findById(userId).populate("spotifyData");
		const tracks: any = await searchGlobalTracks(
			user?.spotifyData,
			songText,
			["track"],
			5,
		);
		const songs: any = [];
		if (tracks?.error) {
			return res
				.status(statusCode.BAD_REQUEST)
				.json({ message: tracks.error.message });
		}
		tracks.tracks.items.forEach((track: any) => {
			songs.push({
				trackName: track.name,
				imageUrl: track.album.images[0].url,
				artist: track.album.artists[0].name,
				external_url: track.external_urls.spotify,
			});
		});

		if (tracks) {
			return res.status(200).json({ tracks: songs });
		}
	} catch (err) {
		console.log(err);
		res.status(statusCode.INTERNAL_SERVER_ERROR).json({ err: err });
	}
};
