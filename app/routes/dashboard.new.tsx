import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { createJob } from "~/models/job.server";
import { User, getUserList } from "~/models/user.server";

export async function loader() {
  const reporterList = await getUserList()
  invariant(reporterList, "No reporters found")
  return json({ reporterList})
}

export const action = async ({ request }: ActionFunctionArgs) => {
  
    const formData = await request.formData();
    const caseName = formData.get("caseName");
    const jobDate = formData.get("jobDate");
    const dueDate = formData.get("dueDate");
    const client = formData.get("client")
    const reporterId = formData.get("reporterId")
  
    if (typeof caseName !== "string" || caseName.length === 0) {
      return json(
        { errors: { body: null, caseName: "Case Name is required" } },
        { status: 400 },
      );
    }
  
    if (typeof jobDate !== 'string' || jobDate === null) {
      return json(
        { errors: { jobDate: "Job Date is required", title: null } },
        { status: 400 },
      );
    }
  
    const job = await createJob({ jobDate, caseName, dueDate, client, reporterId});
  
    return redirect('/dashboard');
  };

export default function CreateJob() {
    const loaderData = useLoaderData<typeof loader>()
    const actionData = useActionData<typeof action>();
  return (
    <div className="w-4/5 flex flex-col justify-center items-center">
      <Form
      method="post"
      className="flex flex-col w-100"
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Case Name: </span>
          <input
            name="caseName"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.caseName ? true : undefined}
            aria-errormessage={
              actionData?.errors?.caseName ? "caseName-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.caseName ? (
          <div className="pt-1 text-red-700" id="caseName-error">
            {actionData.errors.caseName}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Job Date: </span>
          <input
            name="jobDate"
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            type="datetime-local"
            aria-label="date and time"
            aria-invalid={actionData?.errors?.jobDate? true : undefined}
            aria-errormessage={
              actionData?.errors?.jobDate? "jobDate-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.jobDate ? (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.jobDate}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Reporter:</span>
          <select 
            name="reporter" 
            id='reporter'
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2"
          >
            <option>Unassigned</option>
            {loaderData.reporterList.map((reporter) => (
              <option key={reporter.id} value={reporter.id} className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6">
                {reporter.firstName} {reporter.lastName[0].toUpperCase()}.
              </option>
            ))}
          </select>
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