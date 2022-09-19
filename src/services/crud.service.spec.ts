import { faker } from "@faker-js/faker";
import { Comment, Post, User } from "@prisma/client";
import "reflect-metadata";
import { NotFound, Unauthorized } from "http-errors";
import { CreatePostDto } from "../dtos/posts/request/create.dto";
import { clearDatabase, prisma } from "../prisma";
import { Model } from "../utils/enums";
import { UserFactory } from "../utils/factories/user.factory";
import { CrudService } from "./crud.service";
import { PostFactory } from "../utils/factories/post.factory";
import { CommentFactory } from "../utils/factories/comment.factory";
import { CreateCommentDto } from "../dtos/comments/request/create.dto";

describe("CrudService", () => {
  let user: User;
  let post: Post;
  let comment: Comment;
  let postData: CreatePostDto;

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
    postData = {
      title: faker.lorem.lines(1),
      content: faker.lorem.lines(3),
      category: faker.word.noun(),
      draft: false,
    } as CreatePostDto;
  });

  describe("create", () => {
    it("should create a post", async () => {
      const result = await CrudService.create({
        model: Model.POST,
        userId: user.uuid,
        data: postData,
      });
      expect(result).toHaveProperty("title");
    });
  });

  describe("retrieve", () => {
    it("should throw an error if uuid not found", async () => {
      await expect(
        CrudService.retrieve({
          model: Model.POST,
          uuid: faker.datatype.string(),
        })
      ).rejects.toThrowError(new NotFound());
    });

    it("should retrieve post", async () => {
      const postRetrieved = await CrudService.retrieve({
        model: Model.POST,
        uuid: post.uuid,
      });
      expect(postRetrieved).toHaveProperty("title");
    });

    it("should retrieve comment", async () => {
      const commentRetrieved = await CrudService.retrieve({
        model: Model.COMMENT,
        uuid: comment.uuid,
      });
      expect(commentRetrieved).toHaveProperty("content");
    });
  });

  describe("own", () => {
    it("should throw an error if post not found", async () => {
      const postId = faker.datatype.string();
      await expect(
        CrudService.own({ model: Model.POST, uuid: postId, userId: user.uuid })
      ).rejects.toThrowError(new NotFound());
    });

    it("should throw an error if user is not post author", async () => {
      const userId = faker.datatype.string();
      await expect(
        CrudService.own({ model: Model.POST, uuid: post.uuid, userId })
      ).rejects.toThrowError(new Unauthorized("Not owner"));
    });

    it("should throw an error if comment not found", async () => {
      const commentId = faker.datatype.string();
      await expect(
        CrudService.own({
          model: Model.COMMENT,
          uuid: commentId,
          userId: user.uuid,
        })
      ).rejects.toThrowError(new NotFound());
    });

    it("should throw an error if user is not comment author", async () => {
      const userId = faker.datatype.string();
      await expect(
        CrudService.own({ model: Model.COMMENT, uuid: comment.uuid, userId })
      ).rejects.toThrowError(new Unauthorized("Not owner"));
    });
  });

  describe("update", () => {
    it("should update a post", async () => {
      const postUpdated = await CrudService.update({
        model: Model.POST,
        uuid: post.uuid,
        data: postData,
      });

      expect(postUpdated).toHaveProperty("title");
    });

    it("should update a comment", async () => {
      const commentUpdated = await CrudService.update({
        model: Model.COMMENT,
        uuid: comment.uuid,
        data: {
          content: faker.lorem.lines(3),
          draft: false,
        } as CreateCommentDto,
      });

      expect(commentUpdated).toHaveProperty("content");
    });
  });

  describe("like", () => {
    it("should throw error if post not found", async () => {
      await expect(
        CrudService.like({
          model: Model.POST,
          uuid: faker.datatype.string(),
          userId: user.uuid,
        })
      ).rejects.toThrowError(new NotFound("Model not found"));
    });

    it("should decrement likes counter if user has liked a post before", async () => {
      await prisma.post.update({
        where: {
          uuid: post.uuid,
        },
        data: {
          likes: {
            connect: {
              uuid: user.uuid,
            },
          },
        },
      });

      await CrudService.like({
        model: Model.POST,
        uuid: post.uuid,
        userId: user.uuid,
      });

      const result = await prisma.post.findUnique({
        where: {
          uuid: post.uuid,
        },
        select: {
          likes_number: true,
        },
      });

      expect(result?.likes_number).toBe(-1);
    });

    it("should decrement likes counter if user has liked a comment before", async () => {
      await prisma.comment.update({
        where: {
          uuid: comment.uuid,
        },
        data: {
          likes: {
            connect: {
              uuid: user.uuid,
            },
          },
        },
      });

      await CrudService.like({
        model: Model.COMMENT,
        uuid: comment.uuid,
        userId: user.uuid,
      });

      const result = await prisma.comment.findUnique({
        where: {
          uuid: comment.uuid,
        },
        select: {
          likes_number: true,
        },
      });

      expect(result?.likes_number).toBe(-1);
    });

    it("should increment likes counter if user has not liked a post before", async () => {
      await CrudService.like({
        model: Model.POST,
        uuid: post.uuid,
        userId: user.uuid,
      });

      const result = await prisma.post.findUnique({
        where: {
          uuid: post.uuid,
        },
        select: {
          likes_number: true,
        },
      });

      expect(result?.likes_number).toBe(1);
    });

    it("should increment likes counter if user has not liked a comment before", async () => {
      await CrudService.like({
        model: Model.COMMENT,
        uuid: comment.uuid,
        userId: user.uuid,
      });

      const result = await prisma.comment.findUnique({
        where: {
          uuid: comment.uuid,
        },
        select: {
          likes_number: true,
        },
      });

      expect(result?.likes_number).toBe(1);
    });
  });
});
