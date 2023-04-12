import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IError } from "../types/basic/IError";
import { statusCode } from "../enums/statusCodes";

export function isAuth(
	req: Request,
	res: Response,
	next: NextFunction,
): unknown {
	const token = req.header("Authorization")?.replace("Bearer ", "");
	if (!token) {
		return next(new IError("Unauthorized", statusCode.UNAUTHORIZED));
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			id: string;
			type: string;
		};
		req.user = decoded;
		if (req.body.test) {
			return res.json({ message: "Auhtorized" });
		}
		next();
	} catch (e) {
		next(new IError("Unauthorized", statusCode.UNAUTHORIZED));
	}
}

export function testToken(req: Request, res: Response): void {
	const { id, type } = req.body;
	res.status(200).json({ token: generateToken(id, type) });
}

export function generateToken(id: string, type: string): string {
	const user = { id: id, username: type };
	const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "7d" });
	return token;
}
