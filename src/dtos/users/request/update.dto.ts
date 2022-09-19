import { Exclude, Expose } from "class-transformer";
import { BaseDto } from "../../base.dto";

@Exclude()
export class UpdateUserDto extends BaseDto {
  @Expose()
  readonly first_name!: string;

  @Expose()
  readonly last_name!: string;

  @Expose()
  readonly configurations!: { name_public: boolean; email_public: boolean };
}
