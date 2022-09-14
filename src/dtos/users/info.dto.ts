import { Exclude, Expose } from "class-transformer";
import { BaseDto } from "../base.dto";

@Exclude()
export class userInfoDto extends BaseDto {
  @Expose()
  readonly uuid!: string;

  @Expose()
  readonly first_name!: string;

  @Expose()
  readonly last_name!: string;

  @Expose()
  readonly email!: string;

  @Expose()
  readonly configurations!: { name_public: boolean; email_public: boolean };
}
