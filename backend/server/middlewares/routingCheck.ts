import { RequestHandler } from "express";

export const routingCheck:RequestHandler=(req,res,next)=>{
    console.log("Routing check ;)");
    next();
}