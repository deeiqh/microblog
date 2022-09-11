import {} from "class-validator";
import { BaseDto } from "../../base.dto";

export class RegisterDto extends BaseDto {
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
}
