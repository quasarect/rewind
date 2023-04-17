export class IError extends Error {
	code: number;
	location: string | undefined;
	text: string;
	constructor(text: string, code: number, location?: string) {
		super();
		this.text = text;
		this.code = code;
		this.location = location;
	}
}
