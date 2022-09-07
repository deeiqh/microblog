import express from "express";
import { serve, setup } from "swagger-ui-express";
import { PrismaClient } from "@prisma/client";
import { documentation } from "./swagger";

const app = express();
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || "development";

app.use("/api-docs", serve, setup(documentation, { explorer: true }));

const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.update({
    where: { id: 1 },
    data: {
      published: true,
    },
  });
  console.dir(post, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}, env: ${ENVIRONMENT}`);
});
