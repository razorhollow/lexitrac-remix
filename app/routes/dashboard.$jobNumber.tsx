import { TrashIcon, PaperPlaneIcon, CheckboxIcon, SymbolIcon, DoubleArrowUpIcon } from "@radix-ui/react-icons";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import moment from "moment";
import invariant from "tiny-invariant";

import { Button } from "~/components/ui/Button";
import { deleteJob, getJob, submitJob, closeJob } from "~/models/job.server";


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

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData()
  const intent = formData.get('intent')
  switch (intent) {
    case 'delete': {
      const jobNumber = params.jobNumber as string
      await deleteJob({jobNumber: parseInt(jobNumber)})
      invariant(params.jobNumber, "Job Number not found")
      return redirect('/dashboard')
    }
    case 'submit': {
      const jobNumber = params.jobNumber as string
      await submitJob({jobNumber: parseInt(jobNumber)})
      invariant(params.jobNumber, "Job Number not found")
      return redirect('/dashboard')
    }
    case 'close': {
      const jobNumber = params.jobNumber as string
      await closeJob({jobNumber: parseInt(jobNumber)})
      invariant(params.jobNumber, "Job Number not found")
      return redirect('/dashboard')
    }
    default: {
      throw new Response(`Invalid intent: ${intent}`)
    }
  }
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
            <div className="flex justify-around w-100">
            <Button name="intent" value="delete" variant="destructive" type="submit"><TrashIcon className="mr-2" /> DELETE</Button>
            {job.submitted === false ? 
              <Button name="intent" value="submit" variant="outline" type="submit"><PaperPlaneIcon className="mr-2" />Submit</Button>
              :
              <Button name="intent" value="return for changes" variant="outline" type="submit"><SymbolIcon className="mr-2" />Return for Changes</Button>
            }
            {job.closed === false ?
              <Button name="intent" value="close" variant="secondary" type="submit"><CheckboxIcon className="mr-2" /> Close</Button>
              :
              <Button name="intent" value="reopen" variant="secondary" type="submit"><DoubleArrowUpIcon className="mr-2" /> Reopen</Button>
            }
          </div>
        </Form>
        </main>
    )
}