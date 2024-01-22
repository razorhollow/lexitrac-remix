import { Link, Outlet } from "@remix-run/react";

import { Button } from "~/components/ui/Button";

export default function Dashboard() {
  return (
    <div>
      <h1>This is the Dashboard</h1>
      <Link to="new"><Button>Add +</Button></Link>
      <Outlet />
    </div>
  );
}