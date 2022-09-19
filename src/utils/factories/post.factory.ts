import { faker } from "@faker-js/faker";
import { Post, Prisma } from "@prisma/client";
import { prisma } from "../../prisma";
import { Factory } from "./abstract.factory";

type Args = {
  postData?: Partial<Prisma.PostCreateInput>;
  userId: string;
};

export class PostFactory extends Factory<Post> {
  async make(input: Args = {} as Args): Promise<Post> {
    return prisma.post.create({
      data: {
        user_id: input.userId,
        title: input.postData?.title ?? faker.lorem.lines(1),
        content: input.postData?.content ?? faker.lorem.lines(),
        category: input.postData?.category ?? faker.word.noun(),
        draft: input.postData?.draft ?? faker.datatype.boolean(),
      },
    });
  }

  async makeMany(fibonacci: number): Promise<Post[]> {
    return Promise.all(Array(fibonacci).map(() => this.make()));
  }
}
