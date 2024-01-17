import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export function getJobListItems() {
    return prisma.job.findMany({
      where: {},
      select: { id: true, caseName: true, dueDate: true, client: true },
      orderBy: { dueDate: "desc" },
    });
  }