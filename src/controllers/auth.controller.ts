import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { RegisterDto } from "../dtos/auth/request/register.dto";
import { AuthService } from "../services/auth.service";

export async function register(req: Request, res: Response): Promise<void> {
  const dto = plainToInstance(RegisterDto, req.body);
  await dto.isValid();
  const tokenResponse = await AuthService.register(dto);
  res.status(200).json(tokenResponse);
}
