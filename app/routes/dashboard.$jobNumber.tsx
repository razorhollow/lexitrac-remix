import { TrashIcon, DownloadIcon, CheckboxIcon, SymbolIcon, DoubleArrowUpIcon, Pencil2Icon, PaperPlaneIcon } from "@radix-ui/react-icons";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
import { DateTime } from "luxon";
import invariant from "tiny-invariant";

import { Button } from "~/components/ui/Button";
import { deleteJob, getJob, submitJob, closeJob, returnJob, reopenJob } from "~/models/job.server";


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
    case 'reopen': {
      const jobNumber = params.jobNumber as string
      await reopenJob({jobNumber: parseInt(jobNumber)})
      invariant(params.jobNumber, "Job Number not found")
      return redirect('/dashboard')
    }
    case 'return': {
      const jobNumber = params.jobNumber as string
      await returnJob({jobNumber: parseInt(jobNumber)})
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
    const dueDate = DateTime.fromISO(job.dueDate)
    console.log('------------------client logs-------------')
    console.log('this is the jobDate that is being returned with the loader: ', job.jobDate)
    console.log('this is the formatted jobDate time being displayed: ', DateTime.fromISO(job.jobDate, { zone: 'utc' }).toFormat('h:mm a'))
    return (
      <div className="w-4/5 mx-auto">
      <div className="px-4 sm:px-0 flex justify-between align-baseline">
        <div>
          <h3 className="text-base font-semibold leading-7 text-gray-900">Job Information</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Details and files</p>
        </div>
        <Link to='edit'><Button><Pencil2Icon className="me-2"/>Edit</Button></Link>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Case Name</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{job.caseName}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Job Number</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{job.jobNumber}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Client</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{job.client}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Job Date</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{DateTime.fromISO(job.jobDate).toFormat('DD')}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Job Time</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{DateTime.fromISO(job.jobDate).toFormat('h:mm a')}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Due Date</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{dueDate.toFormat('DD')}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Reporter Assigned</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{job.reporter?.firstName} {job.reporter?.lastName}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Location</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              CSR Court Reporting <br/>214 Reasor Hollow Rd <br/>Big Flats, NY 14814
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Attachments</dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <div className="flex w-0 flex-1 items-center">
                    <DownloadIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">transcript_original.pdf</span>
                      <span className="flex-shrink-0 text-gray-400">2.4mb</span>
                    </div>
                  </div>
                </li>
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <div className="flex w-0 flex-1 items-center">
                    <DownloadIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">transcript_approved.pdf</span>
                      <span className="flex-shrink-0 text-gray-400">4.5mb</span>
                    </div>
                  </div>
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    <Form
      method="POST"
      className="pb-3"
      >
        <div className="flex justify-around w-100">
        <Button name="intent" value="delete" variant="destructive" type="submit"><TrashIcon className="mr-2" /> DELETE</Button>
        {job.submitted === false ? 
          <Button name="intent" value="submit" variant="outline" type="submit"><PaperPlaneIcon className="mr-2" />Submit</Button>
          :
          <Button name="intent" value="return" variant="outline" type="submit"><SymbolIcon className="mr-2" />Return for Changes</Button>
        }
        {job.closed === false ?
          <Button name="intent" value="close" variant="secondary" type="submit"><CheckboxIcon className="mr-2" /> Close</Button>
          :
          <Button name="intent" value="reopen" variant="secondary" type="submit"><DoubleArrowUpIcon className="mr-2" /> Reopen</Button>
        }
      </div>
    </Form>
    </div>
      )
    }