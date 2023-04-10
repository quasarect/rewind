import { Types } from "mongoose";

export interface IUser {
	name: string;
	username: string;
	userId: string;
	country: string;
	email: string;
	profileUrl: string;
	tag: string;
	createdAt: Date;
	description: string;
	aiGeneratedLine: string;
	private: boolean;
	artist: boolean;
	followerCount: number;
	followingCount: number;
	spotifyData: Types.ObjectId;
	conversations: Array<Types.ObjectId>;
	followers: Array<Types.ObjectId>;
	following: Array<Types.ObjectId>;
	musists: Array<Types.ObjectId>;
}
