import express from "express";
import { serve, setup } from "swagger-ui-express";
import { documentation } from "./swagger";

const app = express();
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || "development";

app.use("/api-docs", serve, setup(documentation, { explorer: true }));

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}, env: ${ENVIRONMENT}`);
});
