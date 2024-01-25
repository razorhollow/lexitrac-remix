import { Link, Outlet } from "@remix-run/react";

import { Button } from "~/components/ui/Button";
import SideBarComponent from "~/components/ui/SideBar";

export default function Dashboard() {
  return (
    <div>
      <SideBarComponent />
      <Link to="new"><Button>Add +</Button></Link>
      <Outlet />
    </div>
  );
}