/** @format */

import Event from "./Event";

export default function Day({ day, lang }) {
  const formattedDate = new Date(day.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="day">
      <div className="day-title">{day[`name_${lang}`]}</div>
      <div className="day-date">{formattedDate}</div>
      <div className="events">
        {day.events
          .sort((a, b) => a.event_order - b.event_order)
          .map((event) => (
            <Event key={event.id} event={event} lang={lang} />
          ))}
      </div>
    </div>
  );
}
