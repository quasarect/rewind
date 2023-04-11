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
	if (req.query.error) {
		next(new IError(req.params.error, statusCode.FORBIDDEN));
	}
	const code = req.body.code;
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
	try {
		const tokens = await axios(config);
		const { data } = await axios.get(Spotify.ME, {
			headers: {
				Authorization: "Bearer " + tokens.data.access_token,
			},
		});
		const keyId = new keyModel({
			accessToken: tokens.data.access_token,
			refreshToken: tokens.data.refresh_token,
		});
		await keyId.save();
		console.log(data);
		const user = new userModel({
			name: data.display_name,
			email: data.email,
			country: data.country,
			userId: data.id,
			profileUrl: data.images.url,
			spotifyData: keyId.id,
		});
		await user.save();
		res.status(200).json({
			token: generateToken(data.email, "user"),
		});
	} catch (err: any) {
		console.log(err.message);
		next(
			new IError(
				"Spotify auth insuccessful",
				statusCode.INTERNAL_SERVER_ERROR,
			),
		);
	}
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
