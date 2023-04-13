import { Types } from "mongoose";

export interface IUser {
	name: string;
	username: string;
	userId: string;
	country: string;
	email: string;
	profileUrl: string;
	tag: string;
	status: string;
	description: string;
	aiGeneratedLine: string;
	private: boolean;
	artist: boolean;
	followerCount: number;
	followingCount: number;
	spotifyData: Types.ObjectId;
	conversations: Array<Types.ObjectId>;
	followers: Types.ObjectId;
	following: Types.ObjectId;
	musists: Array<Types.ObjectId>;
}
