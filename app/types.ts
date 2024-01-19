import { Job } from "@prisma/client"

export type JobFormInput = Pick<Job, "caseName" | "jobDate" | "dueDate" | "client"> & {
  reporterId: string | null
}