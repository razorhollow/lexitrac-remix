import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import invariant from "tiny-invariant";
import moment from "moment";

import { deleteJob, getJob } from "~/models/job.server";


export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(typeof params.jobNumber === 'string', 'jobNumber not found')
    const jobNumber = parseInt(params.jobNumber, 10)

    invariant(params.jobNumber, "jobNumber not found")

    const job = await getJob(jobNumber)

    if(!job){
        throw new Response('Job Not Found', { status: 404 })
    }

    return json(job)
}

export async function action({ params }: ActionFunctionArgs) {
  invariant(params.jobNumber, "Job Number not found")
  await deleteJob({jobNumber: parseInt(params.jobNumber)})
  return redirect('/dashboard')
}

export default function JobDetailsPage() {
    const job = useLoaderData<typeof loader>()
    return (
        <main>
          <h1>Job Number {job.jobNumber}</h1>  
          <h2>{job.caseName}</h2>
          <h3>{job.client}</h3>
          <p>Due: {moment(job.dueDate).format('MM/DD/YYYY')}</p>
          <p>{job.reporter?.firstName} {job.reporter?.lastName}</p>
        <Form
          method="POST"
          >
          <button type="submit">DELETE</button>
        </Form>
        </main>
    )
}