import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IError } from "../types/basic/IError";
import { statusCode } from "../enums/statusCodes";

export function isAuth(req: Request, res: Response, next: NextFunction) {
	console.log("Auth check");
	const token = req.header("Authorization")?.replace("Bearer ", "");
	if (!token) {
		throw new IError("Unauthorized", statusCode.UNAUTHORIZED);
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			email: string;
			type: string;
		};
		req.user = decoded;
		if (req.body.test) {
			return res.json({ message: "Auhtorized" });
		}
		next();
	} catch (e) {
		throw new IError("Unauthorized", statusCode.UNAUTHORIZED);
	}
}

export function testToken(req: Request, res: Response) {
	const { email, type } = req.body;
	res.status(200).json({ token: generateToken(email, type) });
}

export function generateToken(email: string, type: string): string {
	const user = { email: email, username: type };
	const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "7d" });
	return token;
}
