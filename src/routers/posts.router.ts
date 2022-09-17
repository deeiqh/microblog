import express from "express";
import asyncHandler from "express-async-handler";
import passport from "passport";
import {
  retrieveAll,
  create,
  retrieve,
  own,
  update,
  deleteIt,
  like,
  likes,
  createComment,
  retrieveComments,
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
  .all(asyncHandler(own))
  .patch(asyncHandler(update))
  .delete(asyncHandler(deleteIt));

postsRouter
  .route("/:postId/like")
  .all(passport.authenticate("jwt", { session: false }))
  .patch(asyncHandler(like));

postsRouter.route("/:postId/likes").get(asyncHandler(likes));

postsRouter
  .route("/:postId/comments")
  .get(asyncHandler(retrieveComments))
  .all(passport.authenticate("jwt", { session: false }))
  .post(asyncHandler(createComment));
