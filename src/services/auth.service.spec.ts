import { faker } from "@faker-js/faker";
import { plainToClass, plainToInstance } from "class-transformer";
import { Unauthorized, NotFound, Forbidden } from "http-errors";
import { RegisterDto } from "../dtos/auth/request/register.dto";
import { SignInDto } from "../dtos/auth/request/signIn.dto";
import { clearDatabase, prisma } from "../prisma";
import { TokenActivity } from "../utils/enums";
import { TokenFactory } from "../utils/factories/token.factory";
import { UserFactory } from "../utils/factories/user.factory";
import { AuthService } from "./auth.service";
import { TokenService } from "./token.service";
import { UsersService } from "./users.service";

describe("AuthService", () => {
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;

  beforeAll(async () => {
    userFactory = new UserFactory();
    tokenFactory = new TokenFactory();

    await clearDatabase();
    await prisma.$disconnect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //   describe("register", async () => {

  //     let email: string;
  //     let password: string;

  //     beforeAll(() => {
  //       email = faker.internet.email();
  //       password = faker.internet.password();
  //     });

  //     it('should create a user if data is ok', async () => {
  //         const data = plainToClass(RegisterDto, {
  //             first_name: faker.name.firstName(),
  //             last_name: faker.name.lastName(),
  //             email ,
  //             password ,
  //           });
  //         await expect(AuthService.register(data)).
  //     })

  //     it('should throw error if email already registered', () => {
  //         return
  //     })

  //   })

  describe("sign in", () => {
    let email: string;
    let password: string;

    beforeAll(() => {
      email = faker.internet.email();
      password = faker.internet.password();
    });

    it("should throw an error if user not found", async () => {
      const data = plainToClass(SignInDto, {
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
      await expect(AuthService.signIn(data)).rejects.toThrowError(
        new Unauthorized("User not found")
      );
    });

    it("should throw an error if incorrect password", async () => {
      //   const dataRegister = plainToInstance(RegisterDto, {
      //     first_name: faker.name.firstName(),
      //     last_name: faker.name.lastName(),
      //     email,
      //     password,
      //   });
      //   const { token } = await AuthService.register(dataRegister);
      //   await AuthService.signOut(token);
      const { email } = await userFactory.make();

      const dataSignIn = plainToInstance(SignInDto, {
        email,
        password: faker.internet.password(),
      });

      await expect(AuthService.signIn(dataSignIn)).rejects.toThrowError(
        new Unauthorized("Invalid password")
      );
    });

    it("should create authorization token", async () => {
      const password = faker.internet.password();
      const { email } = await userFactory.make({ password });
      const dataSignIn = plainToInstance(SignInDto, {
        email,
        password,
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
      ).rejects.toThrowError("User not found");
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
      ).rejects.toThrowError("Forbidden. Sign out first");
    });

    it("should thrown an error if user has previous token to confirm email", async () => {
      const { uuid } = await userFactory.make();

      await TokenService.generateTokenDto(uuid, TokenActivity.RESET_PASSWORD);

      await expect(
        TokenService.createTokenRecord(uuid, TokenActivity.RESET_PASSWORD)
      ).rejects.toThrowError("Forbidden. Has previous token to confirm email");
    });
  });

  describe("signOut", () => {
    it("should return if no provided token", async () => {
      const token = undefined;
      await expect(AuthService.signOut(token)).rejects.toThrowError(
        "No token received"
      );
    });

    it("should throw error if invalid token", async () => {
      const token = faker.datatype.string();
      await expect(AuthService.signOut(token)).rejects.toThrowError(
        "Already signed out"
      );
    });

    // it('should delete the token', () => {

    // })
  });
});
