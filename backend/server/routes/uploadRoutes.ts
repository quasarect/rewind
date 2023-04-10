import express from "express";
import { audioUpload, imageUpload, videoUpload } from "../controllers/uploads";

const uploadRouter=express.Router();

uploadRouter.post('/audio',audioUpload);

uploadRouter.post('/video',videoUpload);

uploadRouter.post('/image',imageUpload);

export default uploadRouter;