import type { Job } from "@prisma/client";
import invariant from "tiny-invariant";

import { getIndex } from "app/utils";
import { prisma } from "~/db.server";
import { JobFormInput } from "~/types";

export function getJobListItems() {
    return prisma.job.findMany({
      where: {},
      select: { jobNumber: true, caseName: true, dueDate: true, reporter: true },
      orderBy: { dueDate: "desc" },
    });
  }

export function getJob(jobNumber: number) {
    return prisma.job.findFirst({
    select: { jobNumber: true, caseName: true, jobDate: true, dueDate: true, client: true, reporter: true } ,
    where: { jobNumber }
    })
}

export async function createJob({ 
  caseName, 
  jobDate, 
  dueDate, 
  client,
  reporterId,
}: Pick<Job, "caseName" | "jobDate" | "dueDate" | "client" | "reporterId"> 
){
  const jobIndex = await getIndex()
  console.log('here is the job index received: ', jobIndex)
  invariant(jobIndex, "No Job Index Found")
  const newJobIndex = parseInt(jobIndex) + 1
  console.log('the job index should be:', newJobIndex)

  return prisma.job.create({
    data: {
      caseName,
      jobDate: new Date(jobDate),
      dueDate: new Date(dueDate),
      client,
      jobNumber: newJobIndex,
      reporter: reporterId != null ? {
        connect: {
          id: reporterId
        }
      }
      : undefined,
    }
  })
}

export function deleteJob({jobNumber}: Pick<Job, "jobNumber">) {
  return prisma.job.delete({
    where: { jobNumber },
  });
}