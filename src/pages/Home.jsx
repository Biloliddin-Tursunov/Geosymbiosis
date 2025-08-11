/** @format */
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import dayjs from "dayjs";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("uz"); // til tanlash

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("schedule")
        .select("*")
        .order("event_date", { ascending: true })
        .order("time_range", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setEvents(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-800"></div>
      </div>
    );
  }

  const weeks = [
    { name: "Week 1", start: "2025-08-13", end: "2025-08-17" },
    { name: "Week 2", start: "2025-08-18", end: "2025-08-24" },
    { name: "Week 3", start: "2025-08-25", end: "2025-08-31" },
  ];

  const weekData = weeks.map((week) => {
    const weekEvents = events.filter(
      (e) =>
        dayjs(e.event_date).isAfter(dayjs(week.start).subtract(1, "day")) &&
        dayjs(e.event_date).isBefore(dayjs(week.end).add(1, "day"))
    );

    const days = {};
    weekEvents.forEach((event) => {
      const day = dayjs(event.event_date).format("DD MMMM");
      if (!days[day]) days[day] = [];
      days[day].push(event);
    });

    return { ...week, days };
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          GWS 2025 Schedule
        </h1>
        <p className="text-gray-700">PROGRAMME SCHEDULE</p>
        <p className="italic text-gray-500">GEOSYMBIOSIS SUMMER SCHOOL 2025</p>

        {/* Language Switch */}
        <div className="mt-4 space-x-2">
          <button
            onClick={() => setLang("uz")}
            className={`px-3 py-1 rounded-lg border ${
              lang === "uz" ? "bg-gray-800 text-white" : "bg-white"
            }`}>
            🇺🇿 Uzbek
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded-lg border ${
              lang === "en" ? "bg-gray-800 text-white" : "bg-white"
            }`}>
            🇬🇧 English
          </button>
          <button
            onClick={() => setLang("ja")}
            className={`px-3 py-1 rounded-lg border ${
              lang === "ja" ? "bg-gray-800 text-white" : "bg-white"
            }`}>
            🇯🇵 日本語
          </button>
        </div>
      </div>

      {weekData.map((week, wi) => (
        <div
          key={wi}
          className="mb-8 bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          {/* Week title */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {week.name}
          </h2>

          {/* Days grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Object.keys(week.days).map((day) => (
              <div
                key={day}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-lg transition">
                {/* Day title */}
                <div className="text-gray-900 font-medium mb-2">
                  {week.days[day][0][`day_name_${lang}`]}
                </div>

                {/* Events list */}
                <div className="space-y-2">
                  {week.days[day].map((event) => (
                    <div
                      key={event.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-sm text-gray-800 font-medium">
                        {event[`activity_${lang}`]}
                      </div>
                      <div className="text-xs text-gray-500">
                        {event.time_range}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
