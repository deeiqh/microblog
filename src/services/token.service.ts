import { Token, Prisma } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { NotFound } from "http-errors";
import { prisma } from "../prisma";
import { TokenDto } from "../dtos/auth/response/token.dto";
import { PrismaErrors } from "../utils/enums";

export class TokenService {
  static async generateTokenDto(
    user_id: string,
    expirationMinutes = process.env.JWT_EXPIRATION_TIME_MINUTES as string,
    secret = process.env.JWT_SECRET as string
  ): Promise<TokenDto> {
    const iat = new Date().getTime();
    const exp = iat + parseInt(expirationMinutes) * 60 * 1000;

    const sub = (await this.createTokenRecord(user_id)).sub;
    const token = sign({ sub, iat, exp }, secret);

    return { token, expiration: exp };
  }

  static async createTokenRecord(user_id: string): Promise<Token> {
    try {
      const tokenRecord = await prisma.token.create({
        data: {
          user_id,
        },
      });
      return tokenRecord;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaErrors.FOREIGN_KEY_CONSTRAINT
      ) {
        throw new NotFound("user not found");
      }
      throw error;
    }
  }
}
