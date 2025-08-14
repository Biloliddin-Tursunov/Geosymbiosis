/** @format */

import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { LangContext } from "./context/LangContext";
import Schedule from "./components/Schedules";
import Memories from "./pages/Memories";
import CreateMemory from "./components/CreateMemory";
import Header from "./components/Header";
import "./styles/style.css";

export default function App() {
  const [lang, setLang] = useState("uz");

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="p-5">
        <Header lang={lang} setLang={setLang} />
        <Routes>
          <Route path="/" element={<Schedule />} />
          <Route
            path="/memories/:eventId/:dayDate/:timeRange"
            element={<Memories />}
          />
          <Route path="/create-memory/:eventId" element={<CreateMemory />} />
        </Routes>
      </div>
    </LangContext.Provider>
  );
}
