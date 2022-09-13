import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { RegisterDto } from "../dtos/auth/request/register.dto";
import { AuthService } from "../services/auth.service";
import { SignInDto } from "../dtos/auth/request/signIn.dto";

export async function register(req: Request, res: Response): Promise<void> {
  const userData = plainToInstance(RegisterDto, req.body);
  await userData.isValid();

  const userTokenDto = await AuthService.register(userData);

  res.status(200).json(userTokenDto);
}

export async function signIn(req: Request, res: Response): Promise<void> {
  const signInData = plainToInstance(SignInDto, req.body);
  await signInData.isValid();

  const userTokenDto = await AuthService.signIn(signInData);

  res.status(200).json(userTokenDto);
}
