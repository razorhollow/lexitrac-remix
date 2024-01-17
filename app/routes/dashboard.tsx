import { Link, Outlet } from "@remix-run/react";

export default function Dashboard() {
  return (
    <div>
      <h1>This is the Dashboard</h1>
      <Link to="new"><button className="rounded bg-slate-600 p-3 mb-4 w-24">Add +</button></Link>
      <Outlet />
    </div>
  );
}