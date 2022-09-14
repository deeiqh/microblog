import express from "express";
import asyncHandler from "express-async-handler";
import passport from "passport";
import { retrieveAll, create } from "../controllers/posts.controller";

export const postsRouter = express.Router();

postsRouter
  .route("")
  .get(asyncHandler(retrieveAll))
  .post(passport.authenticate("jwt", { session: false }))
  .post(asyncHandler(create));
