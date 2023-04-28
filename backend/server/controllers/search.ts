import { RequestHandler } from "express";
import userModel from "../models/userSchema";
import { statusCode } from "../enums/statusCodes";
import { IError } from "../types/basic/IError";
import { getUserTopTrack, searchGlobalTracks } from "../services/spotify";
import postModel from "../models/postSchema";
import { Authenticated } from "../types/declarations/jwt";

export const globalSearch: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	const searchText: string = req.query.text as string;
	await Promise.all([
		// Search posts using regex
		postModel
			.find({
				$or: [{ text: { $regex: searchText, $options: "i" } }],
			})
			.populate({ path: "user", select: "name username profileUrl" }),
		// Search users using regex
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
			next(
				new IError(
					"Couldnt search globally",
					statusCode.INTERNAL_SERVER_ERROR,
				),
			);
		});
};

export const userByFields: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	try {
		const username = req.query.username;
		const userId = req.query.userId;
		const email = req.query.email;
		let isMe = false;
		const user = await userModel
			.findOne({
				$or: [{ username }, { _id: userId }, { email }],
			})
			.populate({ path: "followers", match: { users: req.user?.id } })
			.populate({ path: "spotifyData" });

		if (req.user?.id) {
			if (req.user.id === user?._id.toString()) {
				isMe = true;
			}
		}
		const track = await getUserTopTrack("short_term", 1, user?.spotifyData);
		// Change frontend for the object changes here and then delete this comment
		//@ts-ignore
		res.status(200).json({ ...user?._doc, isMe, track: track });
	} catch (err) {
		next(
			new IError("Error fetching User", statusCode.INTERNAL_SERVER_ERROR),
		);
	}
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
		next(
			new IError(
				"Couldnt search for songs",
				statusCode.INTERNAL_SERVER_ERROR,
			),
		);
	}
};
