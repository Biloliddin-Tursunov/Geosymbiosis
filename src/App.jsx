/** @format */

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Memories from "./pages/Memories";
import Schedule from "./pages/Schedules";

export default function App() {
  return (
    <div className="p-5">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedules" element={<Schedule />} />
        <Route path="/memories" element={<Memories />} />
      </Routes>
    </div>
  );
}
