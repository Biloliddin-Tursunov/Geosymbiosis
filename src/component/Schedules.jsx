/** @format */

import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Header from "./Header";
import Week from "./Week";
import Loading from "./Loading";
import "../styles/style.css";

export default function Schedule() {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("uz");

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("schedule_view")
        .select("*")
        .order("week_number")
        .order("day_date")
        .order("event_order");

      if (error) {
        console.error(error);
      } else {
        setScheduleData(structureScheduleData(data));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  function structureScheduleData(data) {
    const weeks = {};
    data.forEach((row) => {
      if (!row.week_id) return;

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
    return <Loading />;
  }

  return (
    <div>
      <Header lang={lang} setLang={setLang} />
      {scheduleData.map((week) => (
        <Week key={week.id} week={week} lang={lang} />
      ))}
    </div>
  );
}
