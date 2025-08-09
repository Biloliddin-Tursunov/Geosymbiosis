/** @format */
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDay, setOpenDay] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });

      if (!error) setEvents(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
      </div>
    );
  }

  const weeks = splitByWeeks(events);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Summer School Schedule
      </h1>

      {weeks.map((weekEvents, weekIndex) => (
        <div key={weekIndex} className="mb-6">
          <h2 className="bg-gradient-to-r from-blue-100 to-blue-50 text-gray-700 px-4 py-2 rounded-md shadow-sm font-semibold">
            {weekIndex + 1}-hafta
          </h2>

          {Object.entries(groupByDate(weekEvents)).map(([day, dayEvents]) => (
            <div
              key={day}
              className="border border-gray-200 rounded-lg mt-3 overflow-hidden shadow-sm">
              <button
                className="w-full text-left px-4 py-3 bg-white hover:bg-blue-50 font-medium text-gray-800 transition-colors"
                onClick={() => setOpenDay(openDay === day ? null : day)}>
                {day}
              </button>

              {openDay === day && (
                <div className="bg-gray-50 px-4 py-3">
                  {/* Desktop view */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-blue-100">
                          <th className={thStyle}>Boshlanish</th>
                          <th className={thStyle}>Tugash</th>
                          <th className={thStyle}>Tadbir nomi</th>
                          <th className={thStyle}>Tavsif</th>
                          <th className={thStyle}>Joylashuv</th>
                          <th className={thStyle}>Kategoriya</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayEvents.map((event) => (
                          <tr key={event.id} className="hover:bg-blue-50">
                            <td className={tdStyle}>{event.start_time}</td>
                            <td className={tdStyle}>{event.end_time}</td>
                            <td className={tdStyle}>{event.title}</td>
                            <td className={tdStyle}>{event.description}</td>
                            <td className={tdStyle}>{event.location}</td>
                            <td className={tdStyle}>{event.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile view */}
                  <div className="md:hidden space-y-3">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white rounded-lg shadow p-4 border border-gray-200">
                        <p className="text-sm text-gray-500">
                          {event.start_time} - {event.end_time}
                        </p>
                        <h3 className="font-semibold text-gray-800">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {event.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          📍 {event.location} | {event.category}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function splitByWeeks(events) {
  const perWeek = Math.ceil(events.length / 3);
  return [
    events.slice(0, perWeek),
    events.slice(perWeek, perWeek * 2),
    events.slice(perWeek * 2),
  ];
}

function groupByDate(events) {
  return events.reduce((acc, ev) => {
    if (!acc[ev.date]) acc[ev.date] = [];
    acc[ev.date].push(ev);
    return acc;
  }, {});
}

const thStyle =
  "border border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700";
const tdStyle = "border border-gray-200 px-3 py-2 text-sm text-gray-600";
