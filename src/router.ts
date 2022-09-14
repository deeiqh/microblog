import express from "express";
import { healthRouter } from "./routers/health.router";
import { authRouter } from "./routers/auth.router";
import { usersRouter } from "./routers/users.router";
import { postsRouter } from "./routers/posts.router";

export const router = express.Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
