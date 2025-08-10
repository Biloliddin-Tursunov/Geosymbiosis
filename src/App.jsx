/** @format */
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import dayjs from "dayjs";

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });

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
        dayjs(e.date).isAfter(dayjs(week.start).subtract(1, "day")) &&
        dayjs(e.date).isBefore(dayjs(week.end).add(1, "day"))
    );

    const days = {};
    weekEvents.forEach((event) => {
      const day = dayjs(event.date).format("DD MMMM");
      if (!days[day]) days[day] = [];
      days[day].push(event);
    });

    return { ...week, days };
  });

  const formatTime = (date, time) => {
    if (!date || !time) return "";
    const dt = dayjs(`${date}T${time}`);
    return dt.isValid() ? dt.format("HH:mm") : "";
  };

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Schedules for GWS 2025
        </h1>
        <p className="text-gray-700">PROGRAMME SCHEDULE</p>
        <p className="italic text-gray-500">GEOSIMBIOTIC WORKSHOP GWS 2025</p>
      </div>

      {weekData.map((week, wi) => (
        <div
          key={wi}
          className="mb-8 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 font-semibold text-gray-800">
            {week.name}
          </div>

          {Object.keys(week.days).map((day) => (
            <div key={day} className="border-t border-gray-200">
              <div className="w-full px-4 py-3 font-medium text-gray-900">
                {day}
              </div>

              {/* Desktop view - Table */}
              <div className="hidden md:block px-4 pb-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left font-medium text-gray-600">
                        Time
                      </th>
                      <th className="p-2 text-left font-medium text-gray-600">
                        Event
                      </th>
                      <th className="p-2 text-left font-medium text-gray-600">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {week.days[day].map((event) => (
                      <tr
                        key={event.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="p-2 text-gray-800">
                          {formatTime(event.date, event.start_time)}
                          {formatTime(event.date, event.start_time) &&
                          formatTime(event.date, event.end_time)
                            ? " – "
                            : ""}
                          {formatTime(event.date, event.end_time)}
                        </td>
                        <td className="p-2 text-gray-900 font-medium">
                          {event.title}
                        </td>
                        <td className="p-2 text-gray-600">
                          {event.location || ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile view - Cards */}
              <div className="block md:hidden px-4 pb-4 space-y-3">
                {week.days[day].map((event) => (
                  <div
                    key={event.id}
                    className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="font-semibold text-gray-900">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatTime(event.date, event.start_time)}
                      {formatTime(event.date, event.start_time) &&
                      formatTime(event.date, event.end_time)
                        ? " – "
                        : ""}
                      {formatTime(event.date, event.end_time)}
                    </p>
                    {event.location && (
                      <p className="text-sm text-gray-500 mt-1">
                        {event.location}
                      </p>
                    )}
                    {event.description && (
                      <p className="text-sm text-gray-700 mt-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
