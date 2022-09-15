import express from "express";
import asyncHandler from "express-async-handler";
import passport from "passport";
import {
  retrieveAll,
  create,
  retrieve,
  ownPost,
  update,
  deleteIt,
  like,
} from "../controllers/posts.controller";

export const postsRouter = express.Router();

postsRouter
  .route("")
  .get(asyncHandler(retrieveAll))
  .post(passport.authenticate("jwt", { session: false }))
  .post(asyncHandler(create));

postsRouter
  .route("/:postId")
  .get(asyncHandler(retrieve))
  .all(passport.authenticate("jwt", { session: false }))
  .all(asyncHandler(ownPost))
  .patch(asyncHandler(update))
  .delete(asyncHandler(deleteIt));

postsRouter
  .route("/:postId/like")
  .all(passport.authenticate("jwt", { session: false }))
  .patch(asyncHandler(like));
