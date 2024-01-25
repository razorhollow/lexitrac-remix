import type { Job } from "@prisma/client";
import invariant from "tiny-invariant";

import { getIndex } from "app/utils";
import { prisma } from "~/db.server";
import { JobFormInput } from "~/types";

export function getJobListItems() {
    return prisma.job.findMany({
      where: {},
      select: 
        { 
          jobNumber: true, 
          caseName: true, 
          dueDate: true, 
          reporter: {
            select: {
              firstName: true,
            }
          }
        },
      orderBy: { dueDate: "desc" },
    });
  }

export function getJob(jobNumber: number) {
    return prisma.job.findFirst({
    select: { jobNumber: true, caseName: true, jobDate: true, dueDate: true, client: true, reporter: true, submitted: true, closed: true } ,
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
  invariant(jobDate, "Job Date is required")

  return prisma.job.create({
    data: {
      caseName,
      jobDate,
      dueDate,
      client,
      jobNumber: newJobIndex,
      reporterId: reporterId && reporterId !== "" ? reporterId : null,
    }
  })
}

export function deleteJob({jobNumber}: Pick<Job, "jobNumber">) {
  return prisma.job.delete({
    where: { jobNumber },
  });
}

export async function submitJob({jobNumber}: Pick<Job, "jobNumber">) {
  try {
    // Find the job by jobNumber
    const job = await prisma.job.findUnique({
      where: { jobNumber },
    });

    if (!job) {
      throw new Error(`Job with jobNumber ${jobNumber} not found`);
    }

    // Update the 'submit' field to true
    await prisma.job.update({
      where: { jobNumber },
      data: { submitted: true },
    });

    console.log(`Job with jobNumber ${jobNumber} submitted successfully.`);
  } catch (error) {
    // Handle the error as needed, e.g., log or throw
    console.error('Error submitting job:', error);
    throw error;
  }
}

export async function closeJob({jobNumber}: Pick<Job, "jobNumber">) {
  try {
    // Find the job by jobNumber
    const job = await prisma.job.findUnique({
      where: { jobNumber },
    });

    if (!job) {
      throw new Error(`Job with jobNumber ${jobNumber} not found`);
    }

    // Update the 'close' field to true
    await prisma.job.update({
      where: { jobNumber },
      data: { closed: true },
    });

    console.log(`Job with jobNumber ${jobNumber} closed successfully.`);
  } catch (error) {
    // Handle the error as needed, e.g., log or throw
    console.error('Error closing job:', error);
    throw error;
  }
}
export async function reopenJob({jobNumber}: Pick<Job, "jobNumber">) {
  try {
    // Find the job by jobNumber
    const job = await prisma.job.findUnique({
      where: { jobNumber },
    });

    if (!job) {
      throw new Error(`Job with jobNumber ${jobNumber} not found`);
    }

    // Update the 'close' field to false
    await prisma.job.update({
      where: { jobNumber },
      data: { closed: false },
    });

    console.log(`Job with jobNumber ${jobNumber} closed successfully.`);
  } catch (error) {
    // Handle the error as needed, e.g., log or throw
    console.error('Error closing job:', error);
    throw error;
  }
}
export async function returnJob({jobNumber}: Pick<Job, "jobNumber">) {
  try {
    // Find the job by jobNumber
    const job = await prisma.job.findUnique({
      where: { jobNumber },
    });

    if (!job) {
      throw new Error(`Job with jobNumber ${jobNumber} not found`);
    }

    // Update the 'submitted' field to false
    await prisma.job.update({
      where: { jobNumber },
      data: { submitted: false },
    });

    console.log(`Job with jobNumber ${jobNumber} returned successfully.`);
  } catch (error) {
    // Handle the error as needed, e.g., log or throw
    console.error('Error returning job:', error);
    throw error;
  }
}

export async function updateJob({
  jobNumber,
  caseName, 
  jobDate, 
  dueDate, 
  client,
  reporterId,
}: Pick<Job, "jobNumber" | "caseName" | "jobDate" | "dueDate" | "client" | "reporterId">) {
  await prisma.job.update({
    where: { 
      jobNumber 
    },
    data: {
      caseName,
      jobDate,
      dueDate,
      client,
      reporterId: reporterId && reporterId !== "" ? reporterId : null,
    },
})
}