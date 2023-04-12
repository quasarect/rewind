import { RequestHandler } from "express";
import { Spotify } from "../enums/spotifyEnums";
import { IError } from "../types/basic/IError";
import axios from "axios";
import qs from "qs";
import { statusCode } from "../enums/statusCodes";
import keyModel from "../models/keySchema";
import userModel from "../models/userSchema";
import { generateToken } from "../middlewares/auth";
import querystring from "querystring";

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
							token: generateToken(data.email, "user"),
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
						profileUrl: data.images.url,
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
							statusCode.BAD_REQUEST,
						),
					);
				});
		})
		.catch((err) => {
			next(
				new IError(
					"Couldnt get tokens for code",
					statusCode.INTERNAL_SERVER_ERROR,
				),
			);
		});
};

export const authUrl: RequestHandler = (req, res) => {
	const scope = "user-read-private user-read-email";
	res.status(200).json({
		URL:
			"https://accounts.spotify.com/authorize?" +
			querystring.stringify({
				response_type: "code",
				client_id: process.env.SPOTIFY_CLIENT_ID,
				scope: scope,
				redirect_uri: process.env.REDIRECT_URL,
			}),
	});
};
