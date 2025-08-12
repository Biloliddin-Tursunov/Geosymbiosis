/** @format */

import Event from "./Event";

export default function Day({ day, lang }) {
  const formattedDate = new Date(day.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="day">
      <h3>{day[`name_${lang}`]}</h3>
      <p>{formattedDate}</p>
      <div className="events">
        {day.events
          .sort((a, b) => a.event_order - b.event_order)
          .map((event) => (
            <Event key={event.id} event={event} day={day} lang={lang} />
          ))}
      </div>
    </article>
  );
}
