import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import createHttpError, {
  Unauthorized,
  BadRequest,
  NotFound,
  PreconditionFailed,
} from "http-errors";
import jwt from "jsonwebtoken";
import { RegisterDto } from "../dtos/auth/request/register.dto";
import { SignInDto } from "../dtos/auth/request/signIn.dto";
import { clearDatabase, prisma } from "../prisma";
import { TokenActivity } from "../utils/enums";
import { TokenFactory } from "../utils/factories/token.factory";
import { UserFactory } from "../utils/factories/user.factory";
import { AuthService } from "./auth.service";
import { TokenService } from "./token.service";

describe("AuthService", () => {
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;

  beforeAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();

    userFactory = new UserFactory();
    tokenFactory = new TokenFactory();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    let data: RegisterDto;

    beforeEach(() => {
      data = {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      } as RegisterDto;
    });

    it("should throw error if email already registered", async () => {
      const data = await userFactory.make();
      await expect(
        AuthService.register(plainToInstance(RegisterDto, data))
      ).rejects.toThrowError(new BadRequest("Email already registered"));
    });

    it("should return tokenDto if input data is ok", async () => {
      const result = await AuthService.register(data);

      expect(result).toHaveProperty("token");
    });

    it("should emit confirm email event", async () => {
      const emitter = jest.mock("eventemitter2");

      await AuthService.register(data);

      expect(emitter.mock.call.length).toBe(1);
    });
  });

  describe("signIn", () => {
    let dataSignIn: SignInDto;

    beforeEach(() => {
      dataSignIn = plainToInstance(SignInDto, {
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
    });

    it("should throw an error if user not found", async () => {
      await expect(AuthService.signIn(dataSignIn)).rejects.toThrowError(
        new Unauthorized("User not found")
      );
    });

    it("should throw an error if incorrect password", async () => {
      const { email } = await userFactory.make();
      dataSignIn = { ...dataSignIn, email } as SignInDto;

      await expect(AuthService.signIn(dataSignIn)).rejects.toThrowError(
        new Unauthorized("Invalid password")
      );
    });

    it("should create authorization token", async () => {
      const password = faker.internet.password();
      const { email } = await userFactory.make({ password });
      dataSignIn = plainToInstance(SignInDto, {
        password,
        email,
      });

      await expect(AuthService.signIn(dataSignIn)).resolves.toHaveProperty(
        "token"
      );
    });
  });

  describe("createTokenRecord", () => {
    it("should thrown an error if the user doesn't exist", async () => {
      await expect(
        TokenService.createTokenRecord(
          faker.datatype.string(),
          TokenActivity.AUTHENTICATE
        )
      ).rejects.toThrowError(new NotFound("User not found"));
    });

    it("should thrown an error if user is already signed in", async () => {
      const data = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const user = await userFactory.make(data);
      await AuthService.signIn(data as SignInDto);

      await expect(
        TokenService.createTokenRecord(user.uuid, TokenActivity.AUTHENTICATE)
      ).rejects.toThrowError(createHttpError(403, "Forbidden. Sign out first"));
    });

    it("should thrown an error if user has previous token to confirm email", async () => {
      const { uuid } = await userFactory.make();

      await TokenService.generateTokenDto(uuid, TokenActivity.RESET_PASSWORD);

      await expect(
        TokenService.createTokenRecord(uuid, TokenActivity.RESET_PASSWORD)
      ).rejects.toThrowError(
        createHttpError(403, "Forbidden. Has previous token to confirm email")
      );
    });
  });

  describe("signOut", () => {
    it("should return error if no provided token", async () => {
      const token = undefined;
      await expect(AuthService.signOut(token)).rejects.toThrowError(
        new PreconditionFailed("No token received")
      );
    });

    it("should throw error if invalid token", async () => {
      const token = faker.datatype.string();
      await expect(AuthService.signOut(token)).rejects.toThrowError(
        new PreconditionFailed("Already signed out")
      );
    });

    it("should delete the token", async () => {
      const token = await tokenFactory.make({
        sub: faker.datatype.string(),
        activity: TokenActivity.AUTHENTICATE,
        user: { connect: { uuid: (await userFactory.make()).uuid } },
      });

      jest
        .spyOn(jwt, "verify")
        .mockImplementation(jest.fn(() => ({ sub: token.sub })));

      const result = await AuthService.signOut(faker.datatype.string());

      expect(result).toBeUndefined();
    });

    describe("generateTokenDto", () => {
      it("should generate confirm email token", async () => {
        const { uuid } = await userFactory.make();
        const activity = TokenActivity.RESET_PASSWORD;

        jest.spyOn(jwt, "sign").mockImplementation(jest.fn(() => "13:11:07"));

        const result = await TokenService.generateTokenDto(
          uuid,
          activity,
          TokenActivity.RESET_PASSWORD
        );

        expect(result).toHaveProperty("token", "13:11:07");
      });
    });
  });
});
