import { UnprocessableEntity, NotFound } from "http-errors";
import { hashSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Token, Prisma } from "@prisma/client";
import { RegisterDto } from "../dtos/auth/request/register.dto";
import { prisma } from "../prisma";
import { PrismaErrors } from "../utils/enums";
import { TokenDto } from "../dtos/auth/response/token.dto";

export class AuthService {
  static async register({
    password,
    ...input
  }: RegisterDto): Promise<TokenDto> {
    const userFound = await prisma.user.findUnique({
      select: { uuid: true },
      where: { email: input.email },
      rejectOnNotFound: false,
    });

    if (userFound) {
      throw new UnprocessableEntity("email already registered");
    }

    const user = await prisma.user.create({
      data: {
        password: hashSync(password),
        ...input,
      },
    });
    const sub = (await this.createToken(user.uuid)).sub;
    const token = this.generateToken(sub);

    //emit email

    return token;
  }

  static async createToken(user_id: string): Promise<Token> {
    try {
      const tokenRow = prisma.token.create({
        data: {
          user_id: user_id,
        },
      });
      return tokenRow;
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

  static generateToken(sub: string): TokenDto {
    const now = new Date().getTime();
    const iat = Math.floor(now / 1000);
    const exp =
      iat + parseInt(process.env.JWT_EXPIRATION_TIME_MINUTES as string) * 60;

    const token = sign({ sub, iat, exp }, process.env.JWT_SECRET as string);

    return { token, expiration: exp };
  }
}
