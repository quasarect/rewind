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
			_id: objectId,
			accessToken: keys.data.access_token,
			refreshToken: keys.data.refresh_token,
		};
	} catch (err: any) {
		console.log("refresh error" + JSON.stringify(err.response.data));
		return {
			error: err,
		};
	}
}

export const getUserTopTrack = async (
	term: string,
	limit: number,
	spotifyData: any,
): Promise<unknown> => {
	try {
		const track = await axios.get(
			`${Spotify.BASE_URL}/v1/me/top/tracks?time_range=${term}&limit=${limit}`,
			{
				headers: {
					Authorization: `Bearer ${spotifyData.accessToken}`,
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
			const newtokens = await refreshToken(
				spotifyData._id,
				spotifyData.refreshToken,
			);
			if (newtokens.error) {
				return console.log("refresh error");
			}
			if (newtokens) {
				return await getUserTopTrack(term, limit, newtokens);
			}
		}
	}
};

export const searchGlobalTracks = async (
	spotifyData: any,
	query: string,
	type: Array<string>,
	limit: number,
): Promise<unknown> => {
	try {
		const types = type.join(",");

		const track = await axios.get(
			`https://api.spotify.com/v1/search?q=${query}&type=${types}&limit=${limit}`,
			{
				headers: {
					Authorization: `Bearer ${spotifyData.accessToken}`,
				},
			},
		);
		return track.data;
	} catch (err: any) {
		if (err.response?.data.error?.status == 401) {
			const newtokens = await refreshToken(
				spotifyData._id,
				spotifyData.refreshToken,
			);
			if (newtokens.error) {
				console.log("refresh error");
			}
			if (newtokens) {
				return await searchGlobalTracks(newtokens, query, type, limit);
			}
		}
		if (err.response?.error?.status == 400) {
			return { error: { message: err.response?.error?.message } };
		}
	}
};
