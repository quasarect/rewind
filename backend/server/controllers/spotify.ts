import { RequestHandler } from "express";
import { Spotify } from "../enums/spotifyEnums";
import { IError } from "../types/basic/IError";
import axios from "axios";
import qs from "qs";
import keyModel from "../models/keySchema";

export const handleOauth: RequestHandler = async (req, res, next) => {
	if (req.query.error) {
		throw new IError(req.params.error, 403);
	}
	const code = req.query.code;
	// const state = req.params.state;
	// if (state !== "fsdd") {
	// 	res.redirect("/login");
	// }
	let body = qs.stringify({
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
	await axios(config)
		.then((response) => {
			const keys = new keyModel({
				accessToken: response.data.access_token,
				refreshToken: response.data.refresh_token,
			});
			keys.save();
		})
		.catch((err) => {
			throw new IError("Spotify auth unsuccessfull", 400);
		});
};
