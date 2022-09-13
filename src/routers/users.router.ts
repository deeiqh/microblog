import express from "express";
import expressAsyncHandler from "express-async-handler";
import { confirm } from "../controllers/users.controller";

export const usersRouter = express.Router();

usersRouter.route("/confirm").post(expressAsyncHandler(confirm));
usersRouter.route("/me");
