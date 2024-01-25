import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import invariant from "tiny-invariant";

import { prisma } from "~/db.server";
import { createJob } from "~/models/job.server";
import { getUserList } from "~/models/user.server";
import { advanceIndex } from "~/utils";

export async function loader() {
  const reporterList = await getUserList()
  invariant(reporterList, "No reporters found")
  const jobNumber = await prisma.jobIndex.findFirst()
  invariant(jobNumber, "No job number found")
  return json({ reporterList, jobNumber })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  
    const formData = await request.formData();
    const caseName = formData.get("caseName") as string;
    const jobDateString = formData.get("jobDate") as string;
    const jobDate = DateTime.fromISO(jobDateString).toUTC().toJSDate()
    const dueDateString = formData.get("dueDate") as string;
    const dueDate = new Date(dueDateString)
    const client = formData.get("client") as string;
    const reporterId = formData.get("reporter") as string;
  
    invariant(caseName, "Case Name is Required" )
    invariant(jobDate, "Job Date is Required")

    await createJob({ caseName, jobDate, dueDate, client, reporterId })
    await advanceIndex()
  
    return redirect('/dashboard');
  };

export default function CreateJob() {
    const loaderData = useLoaderData<typeof loader>()
    const oldJob = loaderData.jobNumber.index
    const thisJob = oldJob + 1
  return (
    <div className="w-4/5 flex flex-col justify-center items-center">
      <Form
      method="post"
      className="flex flex-col w-100"
    >
      <h2>Job Number {thisJob}</h2>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Case Name: </span>
          <input
            required
            name="caseName"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Job Date: </span>
          <input
          required
            name="jobDate"
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            type="datetime-local"
            aria-label="date and time"
          />
        </label>
      </div>
      
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Due Date: </span>
          <input
          required
            name="dueDate"
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            type="datetime-local"
            aria-label="due date"
          />
        </label>
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Reporter:</span>
          <select 
            name="reporter" 
            id='reporter'
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2"
          >
            <option value="">Unassigned</option>
            {loaderData.reporterList.map((reporter) => (
              <option key={reporter.id} value={reporter.id} className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6">
                {reporter.firstName} {reporter.lastName?.[0]?.toUpperCase() ?? ""}.
              </option>
            ))}
          </select>
        </label>
      </div>
      
      
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Client: </span>
          <input
            name="client"
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            type="text"
            aria-label="client"
          />
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded mt-3 bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
    </div>
  );
}