import { Exclude, Expose } from "class-transformer";
import { RetrieveUserDto } from "../../users/response/retrieve.dto";

@Exclude()
export class RetrieveCommentDto {
  @Expose()
  readonly uuid!: string;

  @Expose()
  readonly content!: string;

  @Expose()
  readonly likes!: number;

  @Expose()
  readonly created_at!: string;

  @Expose()
  readonly author!: RetrieveUserDto;
}
