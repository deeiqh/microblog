import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { RegisterDto } from "../dtos/auth/request/auth.dto";

export async function register(req: Request, res: Response): Promise<void> {
  const dto = plainToInstance(RegisterDto, req.body);
  await dto.isValid();
}
