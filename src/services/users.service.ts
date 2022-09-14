import { PreconditionFailed, Unauthorized } from "http-errors";
import { verify } from "jsonwebtoken";
import { plainToInstance } from "class-transformer";
import { prisma } from "../prisma";
import { TokenActivity } from "../utils/enums";
import { meDto } from "../dtos/users/request/me.dto";

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

      tokenRecord = await prisma.token.findUnique({
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
        rejectOnNotFound: true,
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

  static async me(user_id: string): Promise<meDto> {
    const user = await prisma.user.findUnique({
      where: {
        uuid: user_id,
      },
    });

    return plainToInstance(meDto, user);
  }
}
