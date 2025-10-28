import 'dotenv/config';
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  generatorOverrides: {
    client: {
      binaryTargets: ["native", "rhel-openssl-3.0.x"],
    },
  },
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
