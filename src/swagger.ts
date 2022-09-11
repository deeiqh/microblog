import fs from "fs";
import { load } from "js-yaml";
import { JsonObject } from "swagger-ui-express";

export const swaggerDoc = load(
  fs.readFileSync("./docs/swagger.yaml", "utf-8")
) as JsonObject;
