import express from "express";
import { followUser, userByID, userbyEmail } from "../controllers/users";
import { isAuth } from "../middlewares/auth";

const userRouter = express.Router();

userRouter.get("/follow", isAuth, followUser);

userRouter.get("/:id", userByID);

userRouter.get("/:email", userbyEmail);

export default userRouter;
