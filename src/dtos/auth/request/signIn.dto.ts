import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { BaseDto } from "../../base.dto";

@Exclude()
export class SignInDto extends BaseDto {
  @Expose()
  @IsEmail()
  readonly email!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}
