import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function clearDatabase(schema = "public"): Promise<void> {
  const tableNames = await prisma.$queryRaw<
    {
      tablename: string;
    }[]
  >`SELECT tablename FROM pg_tables WHERE schemaname=${schema};`;

  tableNames.forEach(async ({ tablename }) => {
    if (tablename !== "_prisma_migrations") {
      try {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "${schema}"."${tablename}" CASCADE;`
        );
      } catch (error) {
        console.error(error);
      }
    }
  });
}
