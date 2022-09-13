import { UnprocessableEntity } from "http-errors";
import { hashSync } from "bcryptjs";
import { emitter } from "../events";
import { RegisterDto } from "../dtos/auth/request/register.dto";
import { prisma } from "../prisma";
import { TokenDto } from "../dtos/auth/response/token.dto";
import { TokenService } from "./token.service";
import { CONFIRM_USER_EMAIL } from "../events/mail.event";

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

    const tokenDto = await TokenService.generateTokenDto(user.uuid);

    emitter.emit(CONFIRM_USER_EMAIL, {
      user_id: user.uuid,
      email: user.email,
    });

    return tokenDto;
  }
}
