import express from "express";
import { audioUpload, imageUpload, videoUpload } from "../controllers/uploads";
import { routingCheck } from "../middlewares/routingCheck";

const uploadRouter=express.Router();

uploadRouter.post('/audio',audioUpload);

uploadRouter.post('/video',videoUpload);

uploadRouter.post('/image',routingCheck,imageUpload);

export default uploadRouter;