import { serve, setup } from "swagger-ui-express";
import morgan from "morgan";
import express, { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import "reflect-metadata";
import { plainToClass } from "class-transformer";
import { swaggerDoc } from "./swagger";
import { router } from "./router";
import { HttpErrorDto } from "./dtos/http-error.dto";
import { initEvents } from "./events";

const app = express();
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || "development";

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api-docs", serve, setup(swaggerDoc));
app.use("/api", router);

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: HttpError, req: Request, res: Response, next: NextFunction): void => {
    res.status(err.status ?? 500).json(plainToClass(HttpErrorDto, err));
  }
);

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}, env: ${ENVIRONMENT}`);
  initEvents();
});
