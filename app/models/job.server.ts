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
}: JobFormInput 
){
  const jobIndex = await getIndex()
  invariant(jobIndex, "No Job Index Found")
  const newJobIndex = parseInt(jobIndex) + 1

  return prisma.job.create({
    data: {
      caseName,
      jobDate: new Date(jobDate),
      dueDate: new Date(dueDate),
      client,
      jobNumber: newJobIndex,
      reporter: reporterId === "" ? null
      :{
        connect: {
          id: reporterId 
        }
      } 
    }
  })
}

export function deleteJob({jobNumber}: Pick<Job, "jobNumber">) {
  return prisma.job.delete({
    where: { jobNumber },
  });
}