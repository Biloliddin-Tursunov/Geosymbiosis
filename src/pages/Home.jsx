/** @format */

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <h1 className="text-7xl">
      <Link to={"/schedules"}>Schedule</Link>
    </h1>
  );
}
