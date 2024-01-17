import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import moment from "moment";

import { getJobListItems } from "~/models/job.server";

interface JobItem {
  id: string;
  caseName: string;
  dueDate: Date;
  client: string;
  reporter?: string;
}


export const loader = async () => {
  const jobListItems = await getJobListItems()
  return json({ jobListItems })
}

export default function DashboardIndex() {
  const data = useLoaderData<{ jobListItems: JobItem[] }>()
  return (
    <main className="flex h-full bg-gray-800">
      {data.jobListItems.length === 0 ? (
        <p>No Open Jobs</p>
      ) : (
        <div className="w-full h-full">
          {data.jobListItems.map((job) => (
            <Link key={job.id} to={job.id}>
              <div  className="max-w-sm rounded overflow-hidden shadow-lg p-4 m-4">
                <div className="font-bold text-xl mb-2">
                  {job.caseName}
                </div>
                <p className="text-gray-700 text-base">
                  Due Date: {moment(job.dueDate).format('MM/DD/YYYY')}
                </p>
                <p className="text-gray-700 text-base">
                  Reporter: {job.reporter || 'unassigned'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}