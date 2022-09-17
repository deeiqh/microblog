import { Exclude, Expose, Transform, Type } from "class-transformer";
import { RetrieveUserDto } from "../../users/response/retrieve.dto";

@Exclude()
export class RetrieveCommentDto {
  @Expose()
  readonly uuid!: string;

  @Expose()
  readonly content?: string;

  @Expose()
  readonly user_id!: string;

  @Expose()
  readonly post_id?: string;

  @Expose()
  readonly likes_number?: number;

  @Expose()
  @Transform(({ value }) => value?.toUTCString())
  readonly updated_at!: Date;

  @Expose()
  readonly draft!: boolean;

  @Expose()
  @Transform(({ value }) => value?.toUTCString())
  readonly deleted_at!: Date;

  @Expose()
  @Type(() => RetrieveUserDto)
  readonly user!: RetrieveUserDto;
}
