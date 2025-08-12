/** @format */

import { Link } from "react-router-dom";

export default function Event({ event, day, lang }) {
  const dayDate = encodeURIComponent(day.date);
  const timeRange = encodeURIComponent(event.time_range);

  return (
    <Link
      to={`/memories/${event.id}/${dayDate}/${timeRange}`}
      className="event-link"
      style={{
        display: "block",
        padding: "8px",
        border: "1px solid #ccc",
        marginBottom: "8px",
        borderRadius: "6px",
        textDecoration: "none",
        color: "#111",
      }}>
      <div>{event[`activity_${lang}`]}</div>
      <div style={{ fontSize: "0.9em", color: "#666" }}>{event.time_range}</div>
    </Link>
  );
}
