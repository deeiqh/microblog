import { BadRequest } from "http-errors";

export function checkParam(id: string): string {
  if (!id) {
    throw new BadRequest();
  }
  return id;
}
