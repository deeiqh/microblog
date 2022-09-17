import { Exclude, Expose, Transform, Type } from "class-transformer";
import { RetrieveCommentDto } from "../../comments/response/retrieve.dto";
import { RetrieveUserDto } from "../../users/response/retrieve.dto";

@Exclude()
export class RetrievePostDto {
  @Expose()
  readonly uuid!: string;

  @Expose()
  readonly title?: string;

  @Expose()
  readonly content?: string;

  @Expose()
  readonly user_id!: string;

  @Expose()
  readonly category?: string;

  @Expose()
  readonly draft!: boolean;

  @Expose()
  @Transform(({ value }) => value?.toUTCString())
  readonly updated_at!: Date;

  @Expose()
  @Type(() => RetrieveCommentDto)
  readonly comments?: RetrieveCommentDto[];

  @Expose()
  readonly likes_number?: number;

  @Expose()
  @Transform(({ value }) => value?.toUTCString())
  readonly deleted_at!: Date;

  @Expose()
  @Type(() => RetrieveUserDto)
  readonly user!: RetrieveUserDto;
}
