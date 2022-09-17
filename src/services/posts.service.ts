import { plainToInstance } from "class-transformer";
import { NotFound } from "http-errors";
import { CreateCommentDto } from "../dtos/comments/request/create.dto";
import { RetrieveCommentDto } from "../dtos/comments/response/retrieve.dto";
import { RetrievePostDto } from "../dtos/posts/response/retrieve.dto";
import { prisma } from "../prisma";

export class PostsService {
  static async retrieveAll(): Promise<RetrievePostDto[]> {
    const posts = await prisma.post.findMany({
      where: {
        deleted_at: null,
        draft: false,
      },
      include: {
        comments: {
          where: {
            deleted_at: null,
          },
        },
      },
    });
    return posts.map((post) => plainToInstance(RetrievePostDto, post));
  }

  static async createComment(
    postId: string,
    userId: string,
    newCommentData: CreateCommentDto
  ): Promise<RetrieveCommentDto> {
    try {
      const newComment = await prisma.comment.create({
        data: {
          ...newCommentData,
          post_id: postId,
          user_id: userId,
        },
      });
      return plainToInstance(RetrieveCommentDto, newComment);
    } catch (error) {
      throw new NotFound("Post not found");
    }
  }

  static async retrieveComments(postId: string): Promise<RetrieveCommentDto[]> {
    const commentsRetrieved = await prisma.post.findUnique({
      where: {
        uuid: postId,
      },
      select: {
        comments: true,
      },
    });

    if (!commentsRetrieved) {
      throw new NotFound("Post not found");
    }

    return commentsRetrieved.comments.map((comment) =>
      plainToInstance(RetrieveCommentDto, comment)
    );
  }
}
