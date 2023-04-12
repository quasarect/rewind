import express from "express";
import { userByID, userbyEmail } from "../controllers/users";

const userRouter = express.Router();

userRouter.get("/:id", userByID);

userRouter.get("/:email", userbyEmail);

export default userRouter;
