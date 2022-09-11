import express from "express";
import asyncHandler from "express-async-handler";
import { register } from "../controllers/auth.controller";

export const authRouter = express.Router();

authRouter.route("/register").get(asyncHandler(register));
