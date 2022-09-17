import { plainToInstance } from "class-transformer";
import { NotFound, Unauthorized } from "http-errors";
import { CreateCommentDto } from "../dtos/comments/request/create.dto";
import { RetrieveCommentDto } from "../dtos/comments/response/retrieve.dto";
import { CreatePostDto } from "../dtos/posts/request/create.dto";
import { RetrievePostDto } from "../dtos/posts/response/retrieve.dto";
import { RetrieveUserDto } from "../dtos/users/response/retrieve.dto";
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

  static async create(
    userId: string,
    newPostData: CreatePostDto
  ): Promise<RetrievePostDto> {
    const newPost = await prisma.post.create({
      data: {
        ...newPostData,
        user_id: userId,
      },
    });
    return plainToInstance(RetrievePostDto, newPost);
  }

  static async retrieve(postId: string): Promise<RetrievePostDto> {
    try {
      const postRetrieved = await prisma.post.findUniqueOrThrow({
        where: {
          uuid: postId,
        },
        include: {
          user: true,
        },
      });

      return plainToInstance(RetrievePostDto, postRetrieved);
    } catch (error) {
      throw new NotFound();
    }
  }

  static async ownPost(postId: string, userId: string): Promise<void> {
    let postAuthor;
    try {
      postAuthor = await prisma.post.findUniqueOrThrow({
        where: { uuid: postId },
        select: { user_id: true },
      });
    } catch (error) {
      throw new NotFound("Post not found");
    }

    if (postAuthor.user_id !== userId) {
      throw new Unauthorized("Not post owner");
    }
  }

  static async update(
    postId: string,
    newData: CreatePostDto
  ): Promise<RetrievePostDto> {
    const updated = await prisma.post.update({
      where: {
        uuid: postId,
      },
      data: {
        ...newData,
      },
    });

    return plainToInstance(RetrievePostDto, updated);
  }

  static async deleteIt(postId: string): Promise<RetrievePostDto> {
    const deletedPost = await prisma.post.update({
      where: {
        uuid: postId,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return plainToInstance(RetrievePostDto, deletedPost);
  }

  static async like(postId: string, userId: string): Promise<void> {
    const likeUser = await prisma.post.findUnique({
      where: {
        uuid: postId,
      },
      select: {
        likes: {
          where: {
            uuid: userId,
          },
        },
      },
    });

    if (!likeUser) {
      throw new NotFound("Post not found");
    }

    if (likeUser.likes.length) {
      await prisma.post.update({
        where: {
          uuid: postId,
        },
        data: {
          likes: {
            disconnect: {
              uuid: userId,
            },
          },
          likes_number: {
            decrement: 1,
          },
        },
      });
    } else {
      await prisma.post.update({
        where: {
          uuid: postId,
        },
        data: {
          likes: {
            connect: {
              uuid: userId,
            },
          },
          likes_number: {
            increment: 1,
          },
        },
      });
    }
  }

  static async likes(postId: string): Promise<RetrieveUserDto[]> {
    const users = await prisma.post.findUnique({
      where: {
        uuid: postId,
      },
      select: {
        likes: true,
      },
    });

    if (!users) {
      throw new NotFound("Post not found");
    }

    if (users.likes.length) {
      return users.likes.map((user) => plainToInstance(RetrieveUserDto, user));
    }

    return [];
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
    try {
      const commentsRetrieved = await prisma.post.findUnique({
        where: {
          uuid: postId,
        },
        select: {
          comments: true,
        },
      });

      if (!commentsRetrieved) return [];

      return commentsRetrieved.comments.map((comment) =>
        plainToInstance(RetrieveCommentDto, comment)
      );
    } catch (error) {
      throw new NotFound("Post not found");
    }
  }
}
