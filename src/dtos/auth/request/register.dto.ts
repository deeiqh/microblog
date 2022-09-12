import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BaseDto } from "../../base.dto";

@Exclude()
export class RegisterDto extends BaseDto {
  @Expose()
  @IsString()
  readonly first_name!: string;

  @Expose()
  @IsString()
  readonly last_name!: string;

  @Expose()
  @IsEmail()
  readonly email!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}
