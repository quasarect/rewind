import { Types } from "mongoose";
import { ISpotify } from "./ISpotify";

export interface IUser {
	name: string;
	username: string;
	email: string;
	password: string;
	profileUrl: string;
	tag: string;
	createdAt: Date;
	description: string;
	aiGeneratedLine: string;
	private: boolean;
	artist: boolean;
	followerCount: number;
	followingCount: number;
	spotifyData: ISpotify;
	conversations: Array<Types.ObjectId>;
	followers: Array<Types.ObjectId>;
	following: Array<Types.ObjectId>;
	musists: Array<Types.ObjectId>;
}
