import { Exclude, Expose } from "class-transformer";
import { RetrieveCommentDto } from "../../comments/response/retrieve.dto";

@Exclude()
export class RetrievePostDto {
  @Expose()
  readonly uuid!: string;

  @Expose()
  readonly title!: string;

  @Expose()
  readonly category!: string;

  @Expose()
  readonly content!: string;

  @Expose()
  readonly likes!: number;

  @Expose()
  readonly comments!: RetrieveCommentDto[];
}
