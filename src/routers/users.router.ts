import express from "express";
import expressAsyncHandler from "express-async-handler";
import passport from "passport";
import { confirm, me } from "../controllers/users.controller";

export const usersRouter = express.Router();

usersRouter.route("/confirm").post(expressAsyncHandler(confirm));
usersRouter
  .route("/me")
  .all(passport.authenticate("jwt", { session: false }))
  .get(expressAsyncHandler(me));
