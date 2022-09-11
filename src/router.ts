import express from "express";
import { healthRouter } from "./routers/health.router";
import { authRouter } from "./routers/auth.router";

export const router = express.Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
