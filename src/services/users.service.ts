import { prisma } from "../prisma";
import { PreconditionFailed, UnprocessableEntity } from "http-errors";
import { verify } from "jsonwebtoken";

export class UsersService {
  static async confirm(token: undefined | string): Promise<void> {
    if (!token) {
      throw new PreconditionFailed("No token received");
    }

    let sub, user;
    try {
      ({ sub } = verify(
        token,
        process.env.JWT_EMAIL_CONFIRMATION_SECRET as string
      ));

      user = await prisma.token.findUnique({
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
      throw new UnprocessableEntity("Token already used");
    }

    if (!user) {
      throw new UnprocessableEntity("User does not exist");
    }

    if (user.user.confirmed_at) {
      throw new UnprocessableEntity("User already confirmed");
    }

    await prisma.user.update({
      where: {
        uuid: user.user.uuid,
      },
      data: {
        confirmed_at: new Date(),
      },
    });
  }
}
