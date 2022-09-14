import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";
import { meDto } from "../dtos/users/me.dto";
import { UsersService } from "../services/users.service";

export async function confirm(req: Request, res: Response): Promise<void> {
  const token = req.query?.token as string;
  await UsersService.confirm(token);

  res.status(204).end();
}

export async function me(req: Request, res: Response): Promise<void> {
  const user_id = req.user as string;
  const myInfo = await UsersService.me(user_id);
  res.status(200).json(myInfo);
}

export async function updateMe(req: Request, res: Response): Promise<void> {
  const user_id = req.user as string;

  const newData = plainToInstance(meDto, req.body);
  newData.isValid();

  const myInfo = await UsersService.updateMe(user_id, newData);

  res.status(200).json(myInfo);
}
