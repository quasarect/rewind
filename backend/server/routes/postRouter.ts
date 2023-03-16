import express from "express";
import { createPost, deletePost, getPost } from "../controllers/posts";


const postRouter=express.Router();

postRouter.get('/:id',getPost);

postRouter.delete('/:id',deletePost);

postRouter.post('/create',createPost);

export default postRouter;