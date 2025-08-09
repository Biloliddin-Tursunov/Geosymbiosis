/** @format */
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import dayjs from "dayjs";
import LoadingSpinner from "./component/loading";

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
        console.error("Supabase error:", error);
      } else {
        setEvents(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  // 3 haftaga ajratish
  const week1 = events.filter(
    (e) =>
      dayjs(e.date).isAfter("2025-08-12") &&
      dayjs(e.date).isBefore("2025-08-18")
  );
  const week2 = events.filter(
    (e) =>
      dayjs(e.date).isAfter("2025-08-17") &&
      dayjs(e.date).isBefore("2025-08-25")
  );
  const week3 = events.filter(
    (e) =>
      dayjs(e.date).isAfter("2025-08-24") &&
      dayjs(e.date).isBefore("2025-09-01")
  );

  const renderTable = (weekData, title) => (
    <div style={{ marginBottom: "40px" }}>
      <h2 style={{ marginBottom: "10px", color: "#2c3e50" }}>{title}</h2>
      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#3498db", color: "#fff" }}>
            <th style={thStyle}>Sana</th>
            <th style={thStyle}>Boshlanish</th>
            <th style={thStyle}>Tugash</th>
            <th style={thStyle}>Tadbir nomi</th>
            <th style={thStyle}>Tavsif</th>
            <th style={thStyle}>Joylashuv</th>
            <th style={thStyle}>Kategoriya</th>
          </tr>
        </thead>
        <tbody>
          {weekData.map((event, idx) => (
            <tr
              key={event.id}
              style={{
                background: idx % 2 === 0 ? "#f9f9f9" : "#ffffff",
              }}>
              <td style={tdStyle}>{event.date}</td>
              <td style={tdStyle}>{event.start_time}</td>
              <td style={tdStyle}>{event.end_time}</td>
              <td style={tdStyle}>{event.title}</td>
              <td style={tdStyle}>{event.description}</td>
              <td style={tdStyle}>{event.location}</td>
              <td style={tdStyle}>{event.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>📅 Summer School Schedule</h1>
      {renderTable(week1, "1st Week – INTRODUCTION")}
      {renderTable(week2, "2nd Week – DEEP WORK")}
      {renderTable(week3, "3rd Week – FINALIZATION")}
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};
