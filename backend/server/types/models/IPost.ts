export interface IPost {
	text: string;
	audioUrl?: string;
	imageUrl?: string;
	likeCount: number;
	commentCount: number;
	context?: Array<string>;
}
