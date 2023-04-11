/* eslint-disable*/
//@ts-ignore
import { Request } from "express"; 


declare global {
	namespace Express {
		interface Request {
			user?: { email: string; type: string };
		}
	}
}
