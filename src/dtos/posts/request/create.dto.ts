import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { BaseDto } from "../../base.dto";

@Exclude()
export class CreatePostDto extends BaseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly title!: string;

  @Expose()
  @IsString()
  readonly category!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly content!: string;

  @Expose()
  @IsBoolean()
  readonly draft!: boolean;

  @Expose()
  @IsBoolean()
  readonly like!: boolean;
}
