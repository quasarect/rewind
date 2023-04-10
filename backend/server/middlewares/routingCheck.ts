import { RequestHandler } from "express";

export const routingCheck:RequestHandler=(req,res,next)=>{
    next();
}