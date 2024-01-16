import { Outlet } from "@remix-run/react";

export default function Dashboard() {
  return (
    <div>
      <h1>This is the Dashboard</h1>
      <Outlet />
    </div>
  );
}