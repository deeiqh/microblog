import createHttpError, {
  PreconditionFailed,
  Unauthorized,
  NotFound,
} from "http-errors";
import { verify } from "jsonwebtoken";
import { plainToInstance } from "class-transformer";
import { prisma } from "../prisma";
import { PrismaErrors, TokenActivity } from "../utils/enums";
import { RetrieveUserDto } from "../dtos/users/response/retrieve.dto";
import { UpdateUserDto } from "../dtos/users/request/update.dto";
import { RetrievePostDto } from "../dtos/posts/response/retrieve.dto";
import { Prisma } from "@prisma/client";

export class UsersService {
  static async confirm(token: undefined | string): Promise<void> {
    if (!token) {
      throw new PreconditionFailed("No token received");
    }

    let sub, tokenRecord;
    try {
      ({ sub } = verify(
        token,
        process.env.JWT_EMAIL_CONFIRMATION_SECRET as string
      ));

      tokenRecord = await prisma.token.findUniqueOrThrow({
        where: {
          sub: sub as string,
        },
        select: {
          user: {
            select: {
              uuid: true,
              confirmed_at: true,
            },
          },
          activity: true,
        },
      });

      await prisma.token.delete({
        where: {
          sub: sub as string,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Unauthorized("Token already used");
    }

    if (!tokenRecord) {
      throw new Unauthorized("User does not exist");
    }

    if (tokenRecord.activity !== TokenActivity.RESET_PASSWORD) {
      throw new Unauthorized("Wrong token");
    }

    if (tokenRecord.user.confirmed_at) {
      throw new Unauthorized("User already confirmed");
    }

    await prisma.user.update({
      where: {
        uuid: tokenRecord.user.uuid,
      },
      data: {
        confirmed_at: new Date(),
      },
    });
  }

  static async me(userId: string): Promise<RetrieveUserDto> {
    const user = await prisma.user.findUnique({
      where: {
        uuid: userId,
      },
    });

    return plainToInstance(RetrieveUserDto, user);
  }

  static async updateMe(
    userId: string,
    newData: UpdateUserDto
  ): Promise<UpdateUserDto> {
    try {
      const user = await prisma.user.update({
        where: {
          uuid: userId,
        },
        data: {
          ...newData,
        },
      });

      return plainToInstance(UpdateUserDto, user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaErrors.DUPLICATED
      ) {
        throw createHttpError(403, "Forbidden, email already taken");
      }
      throw error;
    }
  }

  static async retrieveUser(userId: string): Promise<RetrieveUserDto> {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          uuid: userId,
        },
      });

      return plainToInstance(RetrieveUserDto, user);
    } catch (error) {
      throw new NotFound("User not found");
    }
  }

  static async retrieveMyPosts(userId: string): Promise<RetrievePostDto[]> {
    const posts = await prisma.post.findMany({
      where: {
        user_id: userId,
      },
      include: {
        comments: {
          where: {
            deleted_at: null,
            draft: false,
          },
        },
      },
    });

    return posts.map((post) => plainToInstance(RetrievePostDto, post));
  }

  static async retrievePosts(userId: string): Promise<RetrievePostDto[]> {
    const posts = await prisma.post.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
        draft: false,
      },
      include: {
        comments: {
          where: {
            deleted_at: null,
            draft: false,
          },
        },
      },
    });

    return posts.map((post) => plainToInstance(RetrievePostDto, post));
  }

  static async retrieveComments(userId: string) {
    //Promise<RetrieveCommentDto[]> {
    const comments = await prisma.user.findFirst({
      where: {
        uuid: userId,
      },
      select: {
        comments: true,
      },
    });
    console.log(comments);
  }
}
