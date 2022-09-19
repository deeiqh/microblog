import "reflect-metadata";
import { Comment, Post, User } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { NotFound } from "http-errors";
import { CreateCommentDto } from "../dtos/comments/request/create.dto";
import { RetrieveCommentDto } from "../dtos/comments/response/retrieve.dto";
import { RetrievePostDto } from "../dtos/posts/response/retrieve.dto";
import { clearDatabase, prisma } from "../prisma";
import { CommentFactory } from "../utils/factories/comment.factory";
import { PostFactory } from "../utils/factories/post.factory";
import { UserFactory } from "../utils/factories/user.factory";
import { PostsService } from "./posts.service";
import { faker } from "@faker-js/faker";

describe("PostService", () => {
  let user: User;
  let post: Post;
  let comment: Comment;

  beforeAll(async () => {
    await clearDatabase();
    prisma.$disconnect;
  });

  beforeEach(async () => {
    user = await new UserFactory().make();
    post = await new PostFactory().make({
      userId: user.uuid,
      postData: { draft: false },
    });
    comment = await new CommentFactory().make({
      userId: user.uuid,
      postId: post.uuid,
      commentData: { draft: false },
    });
  });

  describe("createComment", () => {
    it("should throw an error if post not found", async () => {
      const uuid = faker.datatype.string();

      await expect(
        PostsService.createComment(uuid, user.uuid, {} as CreateCommentDto)
      ).rejects.toThrowError(new NotFound("Post not found"));
    });

    it("should create a comment", async () => {
      const result = await PostsService.createComment(post.uuid, user.uuid, {
        content: faker.lorem.lines(),
        draft: false,
      } as CreateCommentDto);

      expect(result).toHaveProperty("content");
    });
  });

  describe("retrieveComments", () => {
    it("should throw an error if post not found", async () => {
      const uuid = faker.datatype.string();

      await expect(PostsService.retrieveComments(uuid)).rejects.toThrowError(
        new NotFound("Post not found")
      );
    });

    it("should retrieve comments", async () => {
      const result = await PostsService.retrieveComments(post.uuid);

      expect(result).toEqual(
        expect.arrayContaining([
          {
            ...result[0],
            ...plainToInstance(RetrieveCommentDto, comment),
            user_id: user.uuid,
            post_id: post.uuid,
          },
        ])
      );
    });
  });
});
