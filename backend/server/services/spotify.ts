import axios from "axios";
import { Spotify } from "../enums/spotifyEnums";
import keyModel from "../models/keySchema";

export async function refreshToken(objectId: string, refresh_token: string) {
	try {
		const config = {
			method: "post",
			url: "https://accounts.spotify.com/api/token",
			headers: {
				json: true,
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization:
					"Basic " +
					Buffer.from(
						`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
					).toString("base64"),
			},
			data: {
				refresh_token,
				grant_type: "refresh_token",
			},
		};
		const keys = await axios(config);

		const accessToken = keys.data.access_token;
		console.log("acces" + accessToken);
		await keyModel.findByIdAndUpdate(objectId, {
			accessToken: accessToken,
		});
		return {
			accessToken: keys.data.access_token,
			refreshToken: keys.data.refresh_token,
		};
	} catch (err) {
		console.log("refresh error" + err);
		return {
			error: err,
		};
	}
}

export const getUserTopTrack = async (
	term: string,
	limit: number,
	access_token: string,
	refresh_token: string,
	objectId: string,
): Promise<unknown> => {
	try {
		const track = await axios.get(
			`${Spotify.BASE_URL}/v1/me/top/tracks?time_range=${term}&limit=${limit}`,
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			},
		);

		return {
			name: track.data.items[0].album.name,
			external_url: track.data.items[0].album.external_urls.spotify,
			image_url: track.data.items[0].album.images[0].url,
		};
	} catch (err: any) {
		if (err.response?.data.error?.status == 401) {
			const newtokens = await refreshToken(objectId, refresh_token);
			if (newtokens.error) {
				console.log("refresh error");
			}
			if (newtokens) {
				return await getUserTopTrack(
					term,
					limit,
					newtokens?.accessToken,
					newtokens?.refreshToken,
					objectId,
				);
			}
		}
	}
};
