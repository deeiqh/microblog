import express from "express";
import asyncHandler from "express-async-handler";
import passport from "passport";
import {
  retrieveComment,
  own,
  update,
  deleteIt,
  like,
  likes,
} from "../controllers/comments.controller";

export const commentsRouter = express.Router();

commentsRouter
  .route("/:commentId")
  .get(asyncHandler(retrieveComment))
  .all(passport.authenticate("jwt", { session: false }))
  .all(asyncHandler(own))
  .patch(asyncHandler(update))
  .delete(asyncHandler(deleteIt));

commentsRouter
  .route("/:commentId/like")
  .all(passport.authenticate("jwt", { session: false }))
  .patch(asyncHandler(like));

commentsRouter.route("/:commentId/likes").get(asyncHandler(likes));
