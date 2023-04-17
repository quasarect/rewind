//@ts-ignore
import { Request } from "express";
import { Types } from "mongoose";

declare global {
	namespace Express {
		interface Request {
			user?: { id: string | Types.ObjectId; type: string; _v: string };
		}
	}
}
