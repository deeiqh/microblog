import express, { Request, Response } from "express";

export const healthRouter = express.Router();

healthRouter.route("").get((req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: `${(process.uptime() / 60).toFixed(2)} min`,
  });
});
