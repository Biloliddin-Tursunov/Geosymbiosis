/** @format */

export default function Event({ event, lang }) {
  return (
    <div
      className="event-link"
      style={{
        display: "block",
        padding: "8px",
        border: "1px solid #ccc",
        marginBottom: "8px",
        borderRadius: "6px",
        textDecoration: "none",
        color: "#111",
        backgroundColor: "white",
      }}>
      <div>{event[`activity_${lang}`]}</div>
      <div style={{ fontSize: "0.9em", color: "#666" }}>{event.time_range}</div>
    </div>
  );
}
