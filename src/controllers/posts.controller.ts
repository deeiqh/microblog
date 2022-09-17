import { plainToInstance } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import { CreateCommentDto } from "../dtos/comments/request/create.dto";
import { CreatePostDto } from "../dtos/posts/request/create.dto";
import { CrudService } from "../services/crud.service";
import { PostsService } from "../services/posts.service";
import { checkParam } from "../utils/controller";
import { Model } from "../utils/enums";

export async function retrieveAll(req: Request, res: Response): Promise<void> {
  const allPosts = await PostsService.retrieveAll();
  res.status(200).json(allPosts);
}

export async function create(req: Request, res: Response): Promise<void> {
  const userId = req.user as string;
  const newPostData = plainToInstance(CreatePostDto, req.body);
  newPostData.isValid();
  const newPost = await CrudService.create({
    model: Model.POST,
    userId,
    data: newPostData,
  });
  res.status(200).json(newPost);
}

export async function retrieve(req: Request, res: Response): Promise<void> {
  const postId = checkParam(req.params.postId);
  const postRetrieved = await CrudService.retrieve({
    model: Model.POST,
    uuid: postId,
  });
  res.status(200).json(postRetrieved);
}

export async function own(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const postId = checkParam(req.params.postId);
  const userId = req.user as string;
  await CrudService.own({ model: Model.POST, uuid: postId, userId });
  next();
}

export async function update(req: Request, res: Response): Promise<void> {
  const newData = plainToInstance(CreatePostDto, req.body);
  newData.isValid();
  const postId = checkParam(req.params.postId);
  const updatedPost = await CrudService.update({
    model: Model.POST,
    uuid: postId,
    data: newData,
  });
  res.status(200).json(updatedPost);
}

export async function deleteIt(req: Request, res: Response): Promise<void> {
  const postId = checkParam(req.params.postId);
  const deletedPost = await CrudService.deleteIt({
    model: Model.POST,
    uuid: postId,
  });
  res.status(200).json(deletedPost);
}

export async function like(req: Request, res: Response): Promise<void> {
  const userId = req.user as string;
  const postId = checkParam(req.params.postId);
  await CrudService.like({ model: Model.POST, uuid: postId, userId });
  res.status(204).end();
}

export async function likes(req: Request, res: Response): Promise<void> {
  const postId = checkParam(req.params.postId);
  const users = await CrudService.likes({ model: Model.POST, uuid: postId });
  res.status(200).json(users);
}

export async function createComment(
  req: Request,
  res: Response
): Promise<void> {
  const postId = checkParam(req.params.postId);
  const userId = req.user as string;
  const newCommentData = plainToInstance(CreateCommentDto, req.body);
  newCommentData.isValid();
  const comments = await PostsService.createComment(
    postId,
    userId,
    newCommentData
  );
  res.status(200).json(comments);
}

export async function retrieveComments(
  req: Request,
  res: Response
): Promise<void> {
  const postId = checkParam(req.params.postId);
  const commentsRetrieved = await PostsService.retrieveComments(postId);
  res.status(200).json(commentsRetrieved);
}
