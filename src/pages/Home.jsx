/** @format */
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Home() {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("uz"); // til tanlash

  useEffect(() => {
    async function fetchData() {
      // VIEW dan ma'lumotlarni olish
      const { data, error } = await supabase
        .from("schedule_view")
        .select("*")
        .order("week_number")
        .order("day_date")
        .order("event_order");

      if (error) {
        console.error(error);
      } else {
        // Ma'lumotlarni strukturalashtirish
        const structuredData = structureScheduleData(data);
        setScheduleData(structuredData);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Ma'lumotlarni hafta -> kun -> eventlar bo'yicha guruhlash
  function structureScheduleData(data) {
    const weeks = {};

    data.forEach((row) => {
      if (!row.week_id) return; // Bo'sh qatorlarni o'tkazib yuborish

      // Hafta ma'lumotini yaratish
      if (!weeks[row.week_id]) {
        weeks[row.week_id] = {
          id: row.week_id,
          number: row.week_number,
          name_uz: row.week_name_uz,
          name_en: row.week_name_en,
          name_ja: row.week_name_ja,
          days: {},
        };
      }

      // Kun ma'lumotini yaratish
      if (row.day_id && !weeks[row.week_id].days[row.day_id]) {
        weeks[row.week_id].days[row.day_id] = {
          id: row.day_id,
          date: row.day_date,
          name_uz: row.day_name_uz,
          name_en: row.day_name_en,
          name_ja: row.day_name_ja,
          day_of_week: row.day_of_week,
          events: [],
        };
      }

      // Event ma'lumotini qo'shish
      if (row.event_id && row.day_id) {
        weeks[row.week_id].days[row.day_id].events.push({
          id: row.event_id,
          time_range: row.time_range,
          activity_uz: row.activity_uz,
          activity_en: row.activity_en,
          activity_ja: row.activity_ja,
          event_order: row.event_order,
        });
      }
    });

    return Object.values(weeks).sort((a, b) => a.number - b.number);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="p-0 lg:p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="text-center mb-4 lg:mb-10 px-4 lg:px-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
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

      {/* Haftalarni ko'rsatish */}
      {scheduleData.map((week) => (
        <div
          key={week.id}
          className="mb-4 lg:mb-8 bg-white border-0 lg:border border-gray-200 rounded-none lg:rounded-2xl shadow-none lg:shadow-sm p-4 lg:p-5 mx-0">
          {/* Week title */}
          <h2 className="text-base lg:text-lg font-semibold text-gray-800 mb-3 lg:mb-4">
            {week[`name_${lang}`]}
          </h2>

          {/* Days grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-5">
            {Object.values(week.days)
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((day) => (
                <div
                  key={day.id}
                  className="bg-gray-50 lg:bg-white border-0 lg:border border-gray-200 rounded-lg lg:rounded-xl shadow-none lg:shadow-sm p-3 lg:p-4 hover:shadow-lg transition">
                  {/* Day title */}
                  <div className="text-gray-900 font-medium mb-1 lg:mb-2 text-sm lg:text-base">
                    {day[`name_${lang}`]}
                  </div>
                  <div className="text-xs text-gray-500 mb-2 lg:mb-3">
                    {new Date(day.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  {/* Events list */}
                  <div className="space-y-1 lg:space-y-2">
                    {day.events
                      .sort((a, b) => a.event_order - b.event_order)
                      .map((event) => (
                        <div
                          key={event.id}
                          className="p-2 lg:p-3 bg-white lg:bg-gray-50 rounded-md lg:rounded-lg border border-gray-100">
                          <div className="text-xs lg:text-sm text-gray-800 font-medium leading-tight lg:leading-normal">
                            {event[`activity_${lang}`]}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
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
