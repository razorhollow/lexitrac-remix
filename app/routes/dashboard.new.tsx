import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { createJob } from "~/models/job.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const userId = await requireUserId(request);
  
    const formData = await request.formData();
    const caseName = formData.get("caseName");
    const jobDate = formData.get("jobDate");
  
    if (typeof caseName !== "string" || caseName.length === 0) {
      return json(
        { errors: { body: null, caseName: "Case Name is required" } },
        { status: 400 },
      );
    }
  
    if (typeof jobDate !== "string" || jobDate.length === 0) {
      return json(
        { errors: { jobDate: "Job Date is required", title: null } },
        { status: 400 },
      );
    }
  
    const job = await createJob({ jobDate, caseName, userId });
  
    return redirect('/dashboard');
  };

export default function CreateJob() {
    const actionData = useActionData<typeof action>();
  return (
    <div>
      <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Case Name: </span>
          <input
            name="caseName"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.caseName ? (
          <div className="pt-1 text-red-700" id="title-error">
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

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
    </div>
  );
}