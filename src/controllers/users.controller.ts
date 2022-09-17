import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";
import { UpdateUserDto } from "../dtos/users/request/update.dto";
import { UsersService } from "../services/users.service";
import { checkParam } from "../utils/controller";

export async function confirm(req: Request, res: Response): Promise<void> {
  const token = req.query?.token as string;
  await UsersService.confirm(token);
  res.status(204).end();
}

export async function me(req: Request, res: Response): Promise<void> {
  const userId = req.user as string;
  const myInfo = await UsersService.me(userId);
  res.status(200).json(myInfo);
}

export async function updateMe(req: Request, res: Response): Promise<void> {
  const userId = req.user as string;
  const newData = plainToInstance(UpdateUserDto, req.body);
  newData.isValid();
  const myInfo = await UsersService.updateMe(userId, newData);
  res.status(200).json(myInfo);
}

export async function retrieveUser(req: Request, res: Response): Promise<void> {
  const userId = checkParam(req.params.userId);
  const userInfo = await UsersService.retrieveUser(userId);
  res.status(200).json(userInfo);
}

export async function retrieveMyPosts(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.user as string;
  const userPosts = await UsersService.retrieveMyPosts(userId);
  console.log(userPosts);
  res.status(200).json(userPosts);
}

export async function retrievePosts(
  req: Request,
  res: Response
): Promise<void> {
  const userId = checkParam(req.params.userId);
  const userPosts = await UsersService.retrievePosts(userId);
  res.status(200).json(userPosts);
}

export async function retrieveMyComments(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.user as string;
  const comments = await UsersService.retrieveMyComments(userId);
  res.status(200).json(comments);
}
