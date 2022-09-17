import { plainToInstance } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import { CreateCommentDto } from "../dtos/comments/request/create.dto";
import { CrudService } from "../services/crud.service";
import { checkParam } from "../utils/controller";

export async function retrieveComment(
  req: Request,
  res: Response
): Promise<void> {
  const commentId = checkParam(req.params.commentId);

  const commentRetrieved = await CrudService.retrieve({
    model: "comment",
    uuid: commentId,
  });

  res.status(200).json(commentRetrieved);
}

export async function ownComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const commentId = checkParam(req.params.commentId);

  const userId = req.user as string;

  await CrudService.own({ model: "comment", userId, uuid: commentId });

  next();
}

export async function update(req: Request, res: Response): Promise<void> {
  const newData = plainToInstance(CreateCommentDto, req.body);
  newData.isValid();

  const commentId = checkParam(req.params.commentId);

  const updatedPost = await CrudService.update({
    model: "comment",
    uuid: commentId,
    data: newData,
  });

  res.status(200).json(updatedPost);
}

export async function deleteIt(req: Request, res: Response): Promise<void> {
  const commentId = checkParam(req.params.commentId);

  const deletedComment = await CrudService.deleteIt({
    model: "comment",
    uuid: commentId,
  });

  res.status(200).json(deletedComment);
}

export async function like(req: Request, res: Response): Promise<void> {
  const userId = req.user as string;

  const commentId = checkParam(req.params.commentId);
  await CrudService.like({ model: "comment", uuid: commentId, userId });

  res.status(204).end();
}

export async function likes(req: Request, res: Response): Promise<void> {
  const commentId = checkParam(req.params.commentId);

  const users = await CrudService.likes({ model: "comment", uuid: commentId });
  res.status(200).json(users);
}
