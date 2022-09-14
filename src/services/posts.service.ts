import { plainToInstance } from "class-transformer";
import { CreatePostDto } from "../dtos/posts/request/create.dto";
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
}
