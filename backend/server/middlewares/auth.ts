import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IError } from "../types/basic/IError";
import { statusCode } from "../enums/statusCodes";

export function isAuth(req: Request, res: Response, next: NextFunction) {
	const token = req.header("Authorization")?.replace("Bearer ", "");
	if (!token) {
		throw new IError("Unauthorized", statusCode.UNAUTHORIZED);
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			email: string;
			username: string;
		};
		req.user = decoded;
		next();
	} catch (e) {
		throw new IError("Unauthorized", statusCode.UNAUTHORIZED);
	}
}

export function testToken(req: Request, res: Response) {
	const { email, username } = req.body;
	res.status(200).json({ Token: generateToken(email, username) });
}

export function generateToken(email: string, username: string): string {
	const user = { email: email, username: username };
	const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "7d" });
	return token;
}
