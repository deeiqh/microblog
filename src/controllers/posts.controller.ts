import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";
import { CreatePostDto } from "../dtos/posts/request/create.dto";
import { PostsService } from "../services/posts.service";

export async function retrieveAll(req: Request, res: Response): Promise<void> {
  const allPosts = await PostsService.retrieveAll();
  res.status(200).json(allPosts);
}

export async function create(req: Request, res: Response): Promise<void> {
  const userId = req.user as string;

  const newPostData = plainToInstance(CreatePostDto, req.body);

  const newPost = await PostsService.create(userId, newPostData);
  res.status(200).json(newPost);
}
