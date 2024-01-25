import { json, redirect, type ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import {DateTime} from 'luxon'
import invariant from "tiny-invariant";

import { updateJob, getJob, } from "~/models/job.server";
import { getUserList } from "~/models/user.server";
import { advanceIndex } from "~/utils";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const reporterList = await getUserList()
  invariant(reporterList, "No reporters found")
  invariant(typeof params.jobNumber === 'string', 'jobNumber not found')
  const jobNumber = parseInt(params.jobNumber, 10)

  invariant(params.jobNumber, "jobNumber not found")

  const job = await getJob(jobNumber)
  invariant(params.jobNumber, `job not found: ${params.jobNumber}`)

  if(!job){
      throw new Response('Job Not Found', { status: 404 })
  }

  return json({job, reporterList})
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData();
    invariant(params.jobNumber, "Missing param")
    const jobNumber = +params.jobNumber
    const caseName = formData.get("caseName") as string;
    const jobDateString = formData.get("jobDate") as string;
    const jobDate = DateTime.fromISO(jobDateString).toUTC().toJSDate()
    const dueDateString = formData.get("dueDate") as string;
    const dueDate = new Date(dueDateString)
    const client = formData.get("client") as string;
    const reporterId = formData.get("reporter") as string;
  
    invariant(caseName, "Case Name is Required" )
    invariant(jobDate, "Job Date is Required")

    await updateJob({ jobNumber, caseName, jobDate, dueDate, client, reporterId })
    await advanceIndex()
  
    return redirect('/dashboard');
  };

export default function EditJob() {
    const data = useLoaderData<typeof loader>()
  return (
    <div className="w-4/5 flex flex-col justify-center items-center">
      <Form
      method="post"
      className="flex flex-col w-100"
    >
      <h2>Job Number {data.job.jobNumber}</h2>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Case Name: </span>
          <input
            required
            name="caseName"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            defaultValue={data.job.caseName}
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
            defaultValue={DateTime.fromISO(data.job.jobDate, { zone: 'utc' }).toFormat('h:mm a')}
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
            defaultValue={DateTime.fromISO(data.job.dueDate).toFormat("yyyy-MM-dd'T'HH:mm")}
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
            {data.reporterList.map((reporter) => (
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
            defaultValue={data.job.client}
          />
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded mt-3 bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Update
        </button>
      </div>
    </Form>
    </div>
  );
}