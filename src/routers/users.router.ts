import express from "express";
import asyncHandler from "express-async-handler";
import passport from "passport";
import {
  confirm,
  me,
  updateMe,
  retrieveUser,
  retrievePosts,
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
  .get(asyncHandler(retrievePosts));

usersRouter.route("/:userId/posts").get(asyncHandler(retrievePosts));
