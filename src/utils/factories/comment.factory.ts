import { faker } from "@faker-js/faker";
import { Comment, Prisma } from "@prisma/client";
import { prisma } from "../../prisma";
import { Factory } from "./abstract.factory";

type Args = {
  userId: string;
  postId: string;
  commentData?: Partial<Prisma.CommentCreateInput>;
};

export class CommentFactory extends Factory<Comment> {
  async make(input: Args = {} as Args): Promise<Comment> {
    return prisma.comment.create({
      data: {
        user_id: input.userId,
        post_id: input.postId,
        content: input.commentData?.content ?? faker.lorem.lines(),
        draft: input.commentData?.draft ?? faker.datatype.boolean(),
      },
    });
  }

  async makeMany(fibonacci: number): Promise<Comment[]> {
    return Promise.all(Array(fibonacci).map(() => this.make()));
  }
}
