export class HttpErrorDto {
  readonly status!: number;
  readonly message!: string;
  readonly validationErrors?: { errors: ValidationError }[];
}

type ValidationError = { [errorDetail: string]: string | string[] }[];
