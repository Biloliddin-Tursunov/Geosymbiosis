/** @format */

import { Link } from "react-router-dom";
import Event from "./Event";

// Translation objects for button text
const translations = {
  uz: {
    viewMemories: "Xotiralarni ko'rish",
  },
  en: {
    viewMemories: "View Day Memories",
  },
  ru: {
    viewMemories: "Смотреть воспоминания",
  },
  ja: {
    viewMemories: "思い出を見る",
  },
};

export default function Day({ day, week, lang }) {
  const formattedDate = new Date(day.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const dayDate = encodeURIComponent(day.date);
  // URL parametrlarida hozirgi tildagi nomlarni yuboramiz
  const weekName = encodeURIComponent(week[`name_${lang}`]);
  const dayName = encodeURIComponent(day[`name_${lang}`]);

  const t = translations[lang] || translations.en;

  return (
    <article className="day">
      <h3>{day[`name_${lang}`]}</h3>
      <p>{formattedDate}</p>

      <div className="events">
        {day.events
          .sort((a, b) => a.event_order - b.event_order)
          .map((event) => (
            <Event key={event.id} event={event} lang={lang} />
          ))}
      </div>

      <Link
        to={`/memories/${dayDate}/${weekName}/${dayName}`}
        className="day-memories-button">
        {t.viewMemories}
      </Link>
    </article>
  );
}
