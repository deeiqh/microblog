import { Exclude, Expose, Transform, Type } from "class-transformer";
import { RetrieveUserDto } from "../../users/response/retrieve.dto";

@Exclude()
export class RetrieveCommentDto {
  @Expose()
  readonly uuid!: string;

  @Expose()
  readonly content!: string;

  @Expose()
  @Type(() => RetrieveUserDto)
  readonly user!: RetrieveUserDto;

  @Expose()
  readonly likes_number!: number;

  @Expose()
  @Transform(({ value }) => value?.toUTCString())
  readonly updated_at!: Date;
}
