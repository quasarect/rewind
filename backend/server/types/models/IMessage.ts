export interface IMessage {
	messages: Array<{
		userId: string;
		timestamp: any;
		message: string;
	}>;
}
