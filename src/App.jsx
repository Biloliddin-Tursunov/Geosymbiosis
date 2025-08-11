/** @format */

import { Routes, Route } from "react-router-dom";
import Schedule from "./component/Schedules";

export default function App() {
  return (
    <div className="p-5">
      <Routes>
        <Route path="/" element={<Schedule />} />
      </Routes>
    </div>
  );
}
