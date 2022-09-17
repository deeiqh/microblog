import { Prisma } from "@prisma/client";
import { CreateCommentDto } from "../../dtos/comments/request/create.dto";
import { RetrieveCommentDto } from "../../dtos/comments/response/retrieve.dto";
import { CreatePostDto } from "../../dtos/posts/request/create.dto";
import { RetrievePostDto } from "../../dtos/posts/response/retrieve.dto";

export type CreateDto = CreatePostDto | CreateCommentDto;

export type RetrieveDtoInstance = RetrievePostDto | RetrieveCommentDto;
export type RetrieveDtoClass =
  | typeof RetrievePostDto
  | typeof RetrieveCommentDto;

export type CrudOutput = Promise<
  RetrieveDtoInstance | RetrieveDtoInstance[] | void
>;

export type CrudInput = {
  userId?: string;
  model: string;
  uuid?: string;
  data?: CreateDto;
};

export type UsePost = Prisma.PostDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;
export type UseComment = Prisma.CommentDelegate<
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;
export type UseModel = UsePost | UseComment;
