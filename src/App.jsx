/** @format */

import { Routes, Route } from "react-router-dom";
import Schedule from "./pages/Schedules";
import Memories from "./pages/Memories";

export default function App() {
  return (
    <div className="p-5">
      <Routes>
        <Route path="/" element={<Schedule />} />
        <Route path="/memories" element={<Memories />} />
      </Routes>
    </div>
  );
}
