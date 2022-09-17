import { faker } from "@faker-js/faker";
import { Prisma, User } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { prisma } from "../../prisma";
import { Factory } from "./abstract.factory";

export class UserFactory extends Factory<User> {
  async make(input: Partial<Prisma.UserCreateInput> = {}): Promise<User> {
    return prisma.user.create({
      data: {
        first_name: input.first_name ?? faker.name.firstName(),
        last_name: input.last_name ?? faker.name.lastName(),
        email: input.email ?? faker.internet.email(),
        password: hashSync(input.password ?? faker.internet.password()),
      },
    });
  }

  async makeMany(fibonacci: number): Promise<User[]> {
    return Promise.all(Array(fibonacci).map(() => this.make()));
  }
}
