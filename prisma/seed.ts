import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { fakerFR as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function main()
{
  await prisma.user.createMany({
    data: [
      {
        username: "Vinke013",
        email: "vinke013@nextract.io",
        password: await bcrypt.hash("admin", 10),
        isAdmin: true
      },

      {
        username: "Nova Recruiter",
        email: "nova@nextract.io",
        password: await bcrypt.hash("admin", 10),
        isAdmin: true
      },
    ]
  });

  for(let i = 0 ; i < 98 ; i++)
  {
    await prisma.user.create({
      data: {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: await bcrypt.hash("1234", 10),
        isAdmin: false
      }
    });
  }

  //

  console.log("✅ Seed OK");
}

main();