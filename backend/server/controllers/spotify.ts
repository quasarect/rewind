import { RequestHandler } from "express";
import { Spotify } from "../enums/spotifyEnums";
import { IError } from "../types/basic/IError";
import axios from "axios";
import qs from "qs";
import { statusCode } from "../enums/statusCodes";
import keyModel from "../models/keySchema";
import userModel from "../models/userSchema";
import { generateToken } from "../middlewares/auth";
import { refreshToken } from "../services/spotify";
import { setTagline } from "../services/AIServer";
import { Authenticated } from "../types/declarations/jwt";

export const refresh: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
	//@ts-ignore
	const userId = req.user?.id;
	const data = await userModel.findById(userId).populate("spotifyData");
	const tokens = await refreshToken(
		//@ts-ignore
		data?.spotifyData._id!,
		//@ts-ignore
		data?.spotifyData.refreshToken,
	);
	res.status(200).json({ accessToken: tokens.accessToken });
};

export const handleOauth: RequestHandler = async (
	req: Authenticated,
	res,
	next,
) => {
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
			console.log("test request");
			axios
				.get(process.env.AI_SERVER_URL + "/test")
				.then((reply) => {
					console.log("test request success");
					console.log(reply.data);
				})
				.catch((err) => {
					console.log(process.env.AI_SERVER_URL + "/test");
					console.log(err);
				});
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
					if (!data.email) {
						return res
							.status(statusCode.FORBIDDEN)
							.json({ message: "Email not provided" });
					}

					//Check if user already exists
					const oldUser = await userModel.findOne({
						email: data.email,
					});
					if (oldUser) {
						// If user already exists update new tokens
						await keyModel.findByIdAndUpdate(oldUser!.spotifyData, {
							accessToken: tokens.data.access_token,
							refreshToken: tokens.data.refresh_token,
						});
						await setTagline(oldUser._id.toString());
						return res.status(200).json({
							token: generateToken(
								oldUser!._id.toString(),
								"user",
							),
							userId: oldUser!._id,
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
					// for now cause ai server not working for me

					const user = new userModel({
						username: data.id,
						name: data.display_name,
						email: data.email,
						country: data.country,
						profileUrl: data.images[0]?.url,
						spotifyData: keyId.id,
					});
					//Save user data
					await user
						.save()
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
					await setTagline(user._id.toString());
				})
				.catch((err) => {
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
