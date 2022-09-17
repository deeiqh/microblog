import { Prisma, Token } from "@prisma/client";
import { prisma } from "../../prisma";
import { Factory } from "./abstract.factory";

export class TokenFactory extends Factory<Token> {
  async make(input: Prisma.TokenCreateInput): Promise<Token> {
    return prisma.token.create({
      data: {
        ...input,
      },
    });
  }

  async makeMany(
    fibonacci: number,
    input: Prisma.TokenCreateInput
  ): Promise<Token[]> {
    return Promise.all(Array(fibonacci).map(() => this.make(input)));
  }
}
