import { plainToInstance } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import { BadRequest } from "http-errors";
import { CreatePostDto } from "../dtos/posts/request/create.dto";
import { PostsService } from "../services/posts.service";

export async function retrieveAll(req: Request, res: Response): Promise<void> {
  const allPosts = await PostsService.retrieveAll();
  res.status(200).json(allPosts);
}

export async function create(req: Request, res: Response): Promise<void> {
  const userId = req.user as string;

  const newPostData = plainToInstance(CreatePostDto, req.body);
  newPostData.isValid();

  const newPost = await PostsService.create(userId, newPostData);
  res.status(200).json(newPost);
}

export async function retrieve(req: Request, res: Response): Promise<void> {
  const postId = req.params.postId;

  if (!postId) {
    throw new BadRequest();
  }

  const postRetrieved = await PostsService.retrieve(postId);

  res.status(200).json(postRetrieved);
}

export async function ownPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const postId = req.params.postId;
  if (!postId) {
    throw new BadRequest();
  }

  const userId = req.user as string;

  await PostsService.ownPost(postId, userId);

  next();
}

export async function update(req: Request, res: Response): Promise<void> {
  const newData = plainToInstance(CreatePostDto, req.body);
  newData.isValid();

  const postId = req.params.postId;
  if (!postId) {
    throw new BadRequest();
  }

  const updatedPost = await PostsService.update(postId, newData);

  res.status(200).json(updatedPost);
}

export async function deleteIt(req: Request, res: Response): Promise<void> {
  const postId = req.params.postId;
  if (!postId) {
    throw new BadRequest();
  }

  const deletedPost = await PostsService.deleteIt(postId);

  res.status(200).json(deletedPost);
}

export async function like(req: Request, res: Response): Promise<void> {
  const userId = req.user as string;

  const postId = req.params.postId;
  if (!postId) {
    throw new BadRequest();
  }

  await PostsService.like(postId, userId);

  res.status(204).end();
}
