/** @format */

import Day from "./Day";

export default function Week({ week, lang }) {
  return (
    <section className="week">
      <h2>{week[`name_${lang}`]}</h2>
      <div className="days">
        {Object.values(week.days)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((day) => (
            <Day key={day.id} day={day} lang={lang} />
          ))}
      </div>
    </section>
  );
}
