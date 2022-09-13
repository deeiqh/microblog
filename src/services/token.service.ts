import { Token, Prisma } from "@prisma/client";
import { sign } from "jsonwebtoken";
import createHttpError, { NotFound } from "http-errors";
import { prisma } from "../prisma";
import { TokenDto } from "../dtos/auth/response/token.dto";
import { PrismaErrors, TokenActivity } from "../utils/enums";

export class TokenService {
  static async generateTokenDto(
    user_id: string,
    activity = TokenActivity.AUTHENTICATE,
    expirationMinutes = process.env.JWT_EXPIRATION_TIME_MINUTES as string,
    secret = process.env.JWT_SECRET as string
  ): Promise<TokenDto> {
    const iat = new Date().getTime();
    const exp = iat + parseInt(expirationMinutes) * 60 * 1000;

    const sub = (await this.createTokenRecord(user_id, activity)).sub;
    const token = sign({ sub, iat, exp }, secret);

    return { token, expiration: exp };
  }

  static async createTokenRecord(
    user_id: string,
    activity: TokenActivity
  ): Promise<Token> {
    try {
      const tokenRecord = await prisma.token.create({
        data: {
          user_id,
          activity,
        },
      });
      return tokenRecord;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrors.FOREIGN_KEY_CONSTRAINT:
            throw new NotFound("user not found");
          case PrismaErrors.DUPLICATED:
            throw createHttpError(403, "Forbidden, user already signed in");
          default:
            throw error;
        }
      }
      throw error;
    }
  }
}
