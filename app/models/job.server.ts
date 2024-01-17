import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export function getJobListItems() {
    return prisma.job.findMany({
      where: {},
      select: { jobNumber: true, caseName: true, dueDate: true, client: true },
      orderBy: { dueDate: "desc" },
    });
  }

export function getJob(jobNumber: number) {
    return prisma.job.findFirst({
    select: { jobNumber: true, caseName: true, jobDate: true, dueDate: true, client: true, reporter: true } ,
    where: { jobNumber }
    })
}