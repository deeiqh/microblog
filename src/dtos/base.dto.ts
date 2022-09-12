import { validate, ValidationError } from "class-validator";
import createError from "http-errors";

export class BaseDto {
  async isValid(): Promise<boolean> {
    const validationErrors = await validate(this);

    if (validationErrors.length) {
      const badRequest = new createError.BadRequest();
      throw createError(badRequest.status, badRequest.message, {
        validationErrors: this.format(validationErrors),
      });
    }

    return true;
  }

  private format(
    errors: ValidationError[]
  ): { [errorDetail: string]: string | string[] }[] {
    return errors
      .map((error) => {
        if (!error.children?.length) {
          return {
            property: error.property,
            constraint: Object.values(error.constraints ?? {}),
          };
        }

        return this.format(error.children);
      })
      .flat();
  }
}
