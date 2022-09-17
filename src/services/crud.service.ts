import { plainToInstance } from "class-transformer";
import { NotFound, Unauthorized } from "http-errors";
import { RetrieveCommentDto } from "../dtos/comments/response/retrieve.dto";
import { RetrievePostDto } from "../dtos/posts/response/retrieve.dto";
import { RetrieveUserDto } from "../dtos/users/response/retrieve.dto";
import { prisma } from "../prisma";
import { Model } from "../utils/enums";
import {
  CrudInput,
  CrudOutput,
  RetrieveDtoClass,
  UseModel,
} from "../utils/types/crud-service.type";

export class CrudService {
  private static which({ model }: CrudInput): {
    useModel: UseModel;
    retrieveDto: RetrieveDtoClass;
  } {
    switch (model) {
      case Model.POST:
        return {
          useModel: prisma.post,
          retrieveDto: RetrievePostDto,
        };
      case Model.COMMENT:
        return {
          useModel: prisma.comment,
          retrieveDto: RetrieveCommentDto,
        };
      default:
        throw new Error();
    }
  }

  static async create({ ...args }: CrudInput): CrudOutput {
    const { useModel, retrieveDto } = CrudService.which(args);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newRecord = await (useModel as any).create({
      data: {
        ...args.data,
        user_id: args.userId,
      },
    });
    return plainToInstance(retrieveDto, newRecord);
  }

  static async retrieve({ ...args }: CrudInput): CrudOutput {
    const { useModel, retrieveDto } = CrudService.which(args);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recordRetrieved = await (useModel as any).findUnique({
      where: {
        uuid: args.uuid,
      },
      include: {
        user: true,
      },
    });

    if (!recordRetrieved) {
      throw new NotFound();
    }

    recordRetrieved.comments = await prisma.comment.findMany({
      where: {
        post_id: args.uuid,
        deleted_at: null,
        draft: false,
      },
    });

    return plainToInstance(retrieveDto, recordRetrieved);
  }

  static async own({ ...args }: CrudInput): CrudOutput {
    const { useModel } = CrudService.which(args);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const author = await (useModel as any).findUnique({
      where: { uuid: args.uuid },
      select: { user_id: true },
    });

    if (!author) {
      throw new NotFound();
    }

    if (author.user_id !== args.userId) {
      throw new Unauthorized("Not owner");
    }
  }

  static async update({ ...args }: CrudInput): CrudOutput {
    const { useModel, retrieveDto } = CrudService.which(args);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = await (useModel as any).update({
      where: {
        uuid: args.uuid,
      },
      data: {
        ...args.data,
      },
    });
    return plainToInstance(retrieveDto, updated);
  }

  static async deleteIt({ ...args }: CrudInput): CrudOutput {
    const { useModel, retrieveDto } = CrudService.which(args);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deletedRecord = await (useModel as any).update({
      where: {
        uuid: args.uuid,
      },
      data: {
        deleted_at: new Date(),
      },
    });
    return plainToInstance(retrieveDto, deletedRecord);
  }

  static async like({ ...args }: CrudInput): CrudOutput {
    const { useModel } = CrudService.which(args);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const likeUser = await (useModel as any).findUnique({
      where: {
        uuid: args.uuid,
      },
      select: {
        likes: {
          where: {
            uuid: args.userId,
          },
        },
      },
    });

    if (!likeUser) {
      throw new NotFound("Post not found");
    }

    if (likeUser.likes.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (useModel as any).update({
        where: {
          uuid: args.uuid,
        },
        data: {
          likes: {
            disconnect: {
              uuid: args.userId,
            },
          },
          likes_number: {
            decrement: 1,
          },
        },
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (useModel as any).update({
        where: {
          uuid: args.uuid,
        },
        data: {
          likes: {
            connect: {
              uuid: args.userId,
            },
          },
          likes_number: {
            increment: 1,
          },
        },
      });
    }
  }

  static async likes({ ...args }: CrudInput): CrudOutput {
    const { useModel } = CrudService.which(args);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const users = await (useModel as any).findUnique({
      where: {
        uuid: args.uuid,
      },
      select: {
        likes: true,
      },
    });

    if (!users) {
      throw new NotFound("Post not found");
    }

    if (users.likes.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return users.likes.map((user: any) =>
        plainToInstance(RetrieveUserDto, user)
      );
    }
    return [];
  }
}
