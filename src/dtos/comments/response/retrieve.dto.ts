import { Exclude, Expose, Transform } from "class-transformer";
import { RetrieveUserDto } from "../../users/response/retrieve.dto";

@Exclude()
export class RetrieveCommentDto {
  @Expose()
  readonly uuid!: string;

  @Expose()
  readonly content!: string;

  @Expose()
  readonly user_id!: RetrieveUserDto;

  @Expose()
  readonly likes_number!: number;

  @Expose()
  @Transform(({ value }) => value?.toUTCString())
  readonly updated_at!: Date;
}
