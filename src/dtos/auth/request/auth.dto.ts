import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { BaseDto } from "../../base.dto";

export class RegisterDto extends BaseDto {
  @IsString()
  readonly firstName!: string;
  @IsString()
  readonly lastName!: string;
  @IsEmail()
  readonly email!: string;
  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}
