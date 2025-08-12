/** @format */

import { Routes, Route } from "react-router-dom";
import Schedule from "./component/Schedules";
import Memories from "./pages/Memories";
import "./styles/style.css";

export default function App() {
  return (
    <div className="p-5">
      <Routes>
        <Route path="/" element={<Schedule />} />
        <Route
          path="/memories/:eventId/:dayDate/:timeRange"
          element={<Memories />}
        />
      </Routes>
    </div>
  );
}
