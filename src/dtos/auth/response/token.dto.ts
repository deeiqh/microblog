import { Exclude, Expose } from "class-transformer";

@Exclude()
export class TokenDto {
  @Expose()
  readonly token!: string;

  @Expose()
  readonly expiration!: number;
}
