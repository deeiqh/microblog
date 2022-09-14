import { compareSync, hashSync } from "bcryptjs";
import { emitter } from "../events";
import { RegisterDto } from "../dtos/auth/request/register.dto";
import { NotFound, BadRequest, PreconditionFailed } from "http-errors";
import { prisma } from "../prisma";
import { TokenDto } from "../dtos/auth/response/token.dto";
import { TokenService } from "./token.service";
import { CONFIRM_USER_EMAIL } from "../events/mail.event";
import { SignInDto } from "../dtos/auth/request/signIn.dto";
import { verify } from "jsonwebtoken";

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
      throw new BadRequest("Email already registered");
    }

    const user = await prisma.user.create({
      data: {
        password: hashSync(password),
        ...input,
      },
    });

    const tokenDto = await TokenService.generateTokenDto(user.uuid);

    emitter.emit(CONFIRM_USER_EMAIL, {
      user_id: user.uuid,
      email: user.email,
    });

    return tokenDto;
  }

  static async signIn({ email, password }: SignInDto): Promise<TokenDto> {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      rejectOnNotFound: false,
    });

    if (!user) {
      throw new NotFound("User not found");
    }

    const passwordOk = compareSync(password, user.password);

    if (!passwordOk) {
      throw new BadRequest("Invalid password");
    }

    const tokenDto = await TokenService.generateTokenDto(user.uuid);
    return tokenDto;
  }

  static async signOut(tokenString: undefined | string): Promise<void> {
    if (!tokenString) {
      throw new PreconditionFailed("No token received");
    }

    const { sub } = verify(tokenString, process.env.JWT_SECRET as string);

    await prisma.token.delete({
      where: {
        sub: sub as string,
      },
    });
  }
}
