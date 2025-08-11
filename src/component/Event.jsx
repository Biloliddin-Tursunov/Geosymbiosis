/** @format */

export default function Event({ event, lang }) {
  return (
    <div className="event">
      <div className="event-activity">{event[`activity_${lang}`]}</div>
      <div className="event-time">{event.time_range}</div>
    </div>
  );
}
