import "reflect-metadata";
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import createHttpError, { NotFound } from "http-errors";
import { UpdateUserDto } from "../dtos/users/request/update.dto";
import { clearDatabase, prisma } from "../prisma";
import { UserFactory } from "../utils/factories/user.factory";
import { UsersService } from "./users.service";
import { PostFactory } from "../utils/factories/post.factory";
import { RetrievePostDto } from "../dtos/posts/response/retrieve.dto";
import { CommentFactory } from "../utils/factories/comment.factory";
import { RetrieveCommentDto } from "../dtos/comments/response/retrieve.dto";

describe("UserService", () => {
  let userFactory: UserFactory;
  let user: User;

  beforeAll(async () => {
    await clearDatabase();
    prisma.$disconnect;

    userFactory = new UserFactory();
  });

  beforeEach(async () => {
    user = await new UserFactory().make();
    jest.clearAllMocks();
  });

  describe("updateMe", () => {
    it("should throw an error if tries to update to an existing email", async () => {
      const otherUser = await userFactory.make();

      await expect(
        UsersService.updateMe(
          user.uuid,
          plainToInstance(UpdateUserDto, { ...user, email: otherUser.email })
        )
      ).rejects.toThrowError(
        createHttpError(403, "Forbidden, email already taken")
      );
    });

    it("should update own profile", async () => {
      const update = await UsersService.updateMe(user.uuid, {
        first_name: faker.name.firstName(),
      } as UpdateUserDto);

      expect(update).toHaveProperty("first_name", update.first_name);
    });
  });

  describe("retrieveUser", () => {
    it("should throw error if user not found", async () => {
      const uuid = faker.datatype.string();

      await expect(UsersService.retrieveUser(uuid)).rejects.toThrowError(
        new NotFound("User not found")
      );
    });

    it("should retrieve the user", async () => {
      const user = await userFactory.make();
      const retrieve = await UsersService.retrieveUser(user.uuid);
      expect(retrieve).toHaveProperty("last_name");
    });
  });

  describe("retrieveMyPosts, retrievePosts", () => {
    let postFactory: PostFactory;

    beforeAll(async () => {
      postFactory = new PostFactory();
    });

    describe("retriveMyPosts", () => {
      it("should retrieve own posts", async () => {
        const post = plainToInstance(
          RetrievePostDto,
          await postFactory.make({ userId: user.uuid })
        );
        const result = await UsersService.retrieveMyPosts(user.uuid);

        expect(result).toEqual(
          expect.arrayContaining([
            {
              ...result[0],
              ...post,
              comments: [],
            },
          ])
        );
      });
    });

    describe("retrivePosts", () => {
      it("should retrieve user posts", async () => {
        const user = await userFactory.make();
        const post = plainToInstance(
          RetrievePostDto,
          await postFactory.make({ userId: user.uuid })
        );

        const result = await UsersService.retrieveMyPosts(user.uuid);

        expect(result).toEqual(
          expect.arrayContaining([
            {
              ...result[0],
              ...post,
              comments: [],
            },
          ])
        );
      });
    });
  });

  describe("retrieveMyComments", () => {
    it("should retrieve my comments", async () => {
      const post = await new PostFactory().make({ userId: user.uuid });

      const comment = plainToInstance(
        RetrieveCommentDto,
        await new CommentFactory().make({
          userId: user.uuid,
          postId: post.uuid,
        })
      );

      const result = await UsersService.retrieveMyComments(user.uuid);

      expect(result).toEqual(
        expect.arrayContaining([
          {
            ...result[0],
            ...comment,
            user_id: user.uuid,
            post_id: post.uuid,
          },
        ])
      );
    });
  });
});
