import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.job.create({
    data: {
      caseName: "Smith v. Jones",
      jobDate: new Date('2024-01-01T00:00:00.000Z'),
      dueDate: new Date('2024-01-15T00:00:00.000Z'),
      client: "Barclay Damon",
      userId: user.id
    }
  })
  await prisma.job.create({
    data: {
      caseName: "Porchek v. Wales",
      jobDate: new Date('2024-01-10T00:00:00.000Z'),
      dueDate: new Date('2024-01-25T00:00:00.000Z'),
      client: "Ziff",
      userId: user.id
    }
  })
  await prisma.job.create({
    data: {
      caseName: "Roe v. Wade",
      jobDate: new Date('1971-12-13T00:00:00.000Z'),
      dueDate: new Date('1973-01-21T00:00:00.000Z'),
      client: "Dallas County",
      userId: user.id
    }
  })

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
