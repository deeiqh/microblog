import { Request, Response } from "express";
import { UsersService } from "../services/users.service";

export async function confirm(req: Request, res: Response): Promise<void> {
  const token = req.query?.token as string;
  await UsersService.confirm(token);

  res.status(204).end();
}
