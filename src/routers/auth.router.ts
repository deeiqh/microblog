import express from "express";
import asyncHandler from "express-async-handler";
import { register, signIn, signOut } from "../controllers/auth.controller";

export const authRouter = express.Router();

authRouter.route("/register").post(asyncHandler(register));
authRouter.route("/sign-in").post(asyncHandler(signIn));
authRouter.route("/sign-out").post(asyncHandler(signOut));
