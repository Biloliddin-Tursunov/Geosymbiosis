/** @format */

import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Memories from "./pages/Memories";

export default function App() {
  return (
    <div className="p-5">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/memories" element={<Memories />} />
      </Routes>
    </div>
  );
}
