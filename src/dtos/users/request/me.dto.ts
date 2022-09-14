import { Exclude, Expose } from "class-transformer";

@Exclude()
export class meDto {
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
