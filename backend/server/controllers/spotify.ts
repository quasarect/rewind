import { RequestHandler } from "express";
import { Spotify } from "../enums/spotifyEnums";
import { IError } from "../types/basic/IError";
import axios from "axios";
import qs from "qs";
import { statusCode } from "../enums/statusCodes";
import keyModel from "../models/keySchema";
import userModel from "../models/userSchema";
import { generateToken } from "../middlewares/auth";
import { getUserTopTrack } from "../services/spotify";

export const handleOauth: RequestHandler = async (req, res, next) => {
	// Recieive request from front end extract code
	const code = req.body.code;
	if (!code) {
		next(new IError("Code not given", statusCode.BAD_REQUEST));
	}

	const body = qs.stringify({
		grant_type: "authorization_code",
		code: code,
		redirect_uri: process.env.REDIRECT_URL,
	});
	const config = {
		method: "post",
		url: Spotify.ACCESS_TOKEN_URL,
		headers: {
			json: true,
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization:
				"Basic " +
				Buffer.from(
					`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
				).toString("base64"),
		},
		data: body,
	};
	// First exhange code for tokens
	axios(config)
		.then(async (tokens) => {
			// Once tokens are received hit me endpoint for user details
			axios
				.get(Spotify.ME, {
					headers: {
						Authorization: "Bearer " + tokens.data.access_token,
					},
				})
				.then(async (reply) => {
					// User data response
					const data = reply.data;
					//Check if user already exists
					const newUser = await userModel.find({ email: data.email });
					if (newUser.length !== 0) {
						return res.status(200).json({
							token: generateToken(
								newUser[0]._id.toString(),
								"user",
							),
							userId: newUser[0]._id,
							message: "User already exists",
						});
					}
					if (!data.email) {
						return res
							.status(statusCode.BAD_REQUEST)
							.json({ message: "Email not registered" });
					}
					const keyId = new keyModel({
						accessToken: tokens.data.access_token,
						refreshToken: tokens.data.refresh_token,
					});
					// Save keys
					await keyId.save().catch((err) => {
						next(
							new IError(
								"Couldnt save keys",
								statusCode.INTERNAL_SERVER_ERROR,
							),
						);
					});
					const user = new userModel({
						username: data.id,
						name: data.display_name,
						email: data.email,
						country: data.country,
						profileUrl: data.images[0].url,
						spotifyData: keyId.id,
					});
					//Save user data
					user.save()
						.then((response) => {
							res.status(200).json({
								token: generateToken(
									user._id.toString(),
									"user",
								),
								userId: user._id,
								message: "New user created",
							});
						})
						.catch((err) => {
							next(
								new IError(
									"Couldnt create user",
									statusCode.INTERNAL_SERVER_ERROR,
								),
							);
						});
				})
				.catch((err) => {
					console.log(err);
					next(
						new IError(
							"Couldnt get user data",
							statusCode.UNAUTHORIZED,
						),
					);
				});
		})
		.catch((err) => {
			next(
				new IError(
					"Couldnt get tokens for code",
					statusCode.UNAUTHORIZED,
				),
			);
		});
};

export const userTopTrack: RequestHandler = async (req, res, next) => {
	try {
		const userId = req.user?.id;
		console.log(userId);
		const user = await userModel
			.findOne({ _id: userId })
			.populate({ path: "spotifyData" });
		if (!user) {
			res.status(statusCode.NOT_FOUND).json({
				message: "user not found",
			});
		}
		//@ts-ignore
		const track = await getUserTopTrack(
			"short_term",
			1,
			//@ts-ignore
			user?.spotifyData.accessToken,
			//@ts-ignore
			user?.spotifyData.refreshToken,
			//@ts-ignore
			user?.spotifyData,
		);
		res.status(200).json({
			track
		});
	} catch (err) {
		console.log(err);
	}
};
