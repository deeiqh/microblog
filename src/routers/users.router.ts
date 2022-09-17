import express from "express";
import asyncHandler from "express-async-handler";
import passport from "passport";
import {
  confirm,
  me,
  updateMe,
  retrieveUser,
  retrieveMyPosts,
  retrievePosts,
  retrieveMyComments,
} from "../controllers/users.controller";

export const usersRouter = express.Router();

usersRouter.route("/confirm").post(asyncHandler(confirm));

usersRouter
  .route("/me")
  .all(passport.authenticate("jwt", { session: false }))
  .get(asyncHandler(me))
  .patch(asyncHandler(updateMe));

usersRouter.route("/:userId").get(asyncHandler(retrieveUser));

usersRouter
  .route("/me/posts")
  .all(passport.authenticate("jwt", { session: false }))
  .get(asyncHandler(retrieveMyPosts));

usersRouter.route("/:userId/posts").get(asyncHandler(retrievePosts));

usersRouter
  .route("/me/comments")
  .all(passport.authenticate("jwt", { session: false }))
  .get(asyncHandler(retrieveMyComments));
