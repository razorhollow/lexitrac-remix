import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { advanceIndex, getIndex } from "~/utils";

const prisma = new PrismaClient();



export async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.job.deleteMany({}).catch(() => {
    // no worries if it doesn't exist yet
  });
  await prisma.jobIndex.deleteMany({}).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      firstName: "Christine",
      lastName: "Reynolds",
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

  const jobIndex = await prisma.jobIndex.create({
    data: {
      index: 1001
    }
  })

  await prisma.job.create({
    data: {
      caseName: "Smith v. Jones",
      jobNumber: jobIndex.index,
      jobDate: new Date('2024-01-01T00:00:00.000Z'),
      dueDate: new Date('2024-01-15T00:00:00.000Z'),
      client: "Barclay Damon",
      reporter: {
        connect: {
          id: user.id
        }
      }
    }
  })

  await advanceIndex()

  await prisma.job.create({
    data: {
      caseName: "Porchek v. Wales",
      jobNumber: 1002,
      jobDate: new Date('2024-01-10T00:00:00.000Z'),
      dueDate: new Date('2024-01-25T00:00:00.000Z'),
      client: "Ziff",
      reporter: {
        connect: {
          id: user.id
        }
      }
    }
  })

  await advanceIndex()      

  await prisma.job.create({
    data: {
      caseName: "Roe v. Wade",
      jobNumber: 1003,
      jobDate: new Date('1971-12-13T00:00:00.000Z'),
      dueDate: new Date('1973-01-21T00:00:00.000Z'),
      client: "Dallas County",
      reporter: {
        connect: {
          id: user.id
        }
      }
    }
  })

  console.log(`Database has been seeded. 🌱`);
  const endIndex = await getIndex()
  console.log(`The Job Index is now ${endIndex}`)
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  export {getIndex, advanceIndex}
