/** @format */

import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";
import { LangContext } from "../context/LangContext";
import { LoginModal } from "../components/LoginModal";
import Loading from "../components/Loading";
import Header from "../components/Header";

// Translation objects
const translations = {
  uz: {
    eventsOfDay: "Kun tadbirlari",
    dayMemories: "Kun xotiralari",
    addMemory: "Xotira qo'shish",
    back: "Orqaga",
    noMemories:
      "Ushbu kun uchun hali xotiralar yo'q. Birinchi bo'lib qo'shing!",
  },
  en: {
    eventsOfDay: "Events of the Day",
    dayMemories: "Day Memories",
    addMemory: "Add Memory",
    back: "Back",
    noMemories: "No memories yet for this day. Be the first to add one!",
  },
  ja: {
    eventsOfDay: "その日の出来事",
    dayMemories: "その日の思い出",
    addMemory: "思い出を追加する",
    back: "戻る",
    noMemories: "まだこの日の思い出がありません。最初に追加してみてください！",
  },
};

export default function Memories() {
  const { dayDate, weekName, dayName } = useParams();
  const { lang } = useContext(LangContext);
  const [dayEvents, setDayEvents] = useState([]);
  const [memories, setMemories] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [weekData, setWeekData] = useState(null);
  const [dayData, setDayData] = useState(null);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    const fetchDayEventsAndMemories = async () => {
      const decodedDate = decodeURIComponent(dayDate);

      try {
        // Fetch events for this day
        let { data: eventsData, error: eventsError } = await supabase
          .from("schedule_view")
          .select("*")
          .eq("day_date", decodedDate)
          .order("event_order");

        if (!eventsError && eventsData) {
          setDayEvents(eventsData);

          // Get week and day data from the first event record
          if (eventsData.length > 0) {
            const firstEvent = eventsData[0];
            setWeekData({
              name_uz: firstEvent.week_name_uz,
              name_en: firstEvent.week_name_en,
              name_ja: firstEvent.week_name_ja,
            });
            setDayData({
              name_uz: firstEvent.day_name_uz,
              name_en: firstEvent.day_name_en,
              name_ja: firstEvent.day_name_ja,
            });
          }
        }

        // Fetch memories for this day
        let { data: memoriesData, error: memoriesError } = await supabase
          .from("memories")
          .select("*")
          .eq("day_date", decodedDate)
          .order("created_at", { ascending: false });

        if (!memoriesError && memoriesData) {
          setMemories(memoriesData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDayEventsAndMemories();
  }, [dayDate]);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    window.location.href = `/create-memory/${dayDate}`;
  };

  if (loading) return <Loading />;

  // Format date based on language
  const dateObj = new Date(decodeURIComponent(dayDate));
  const dateStr = (() => {
    switch (lang) {
      case "uz":
        return dateObj.toLocaleDateString("uz-UZ", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      case "ru":
        return dateObj.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      case "en":
      default:
        return dateObj.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
    }
  })();

  // Get current language text for week and day names
  const getCurrentWeekName = () => {
    if (weekData) {
      return weekData[`name_${lang}`] || weekData.name_en;
    }
    try {
      return decodeURIComponent(weekName);
    } catch {
      return weekName;
    }
  };

  const getCurrentDayName = () => {
    if (dayData) {
      return dayData[`name_${lang}`] || dayData.name_en;
    }
    try {
      return decodeURIComponent(dayName);
    } catch {
      return dayName;
    }
  };

  return (
    <div className="memories-page">
      {/* Memory-specific header */}
      <header className="memories-header">
        <h1>{getCurrentWeekName()}</h1>
        <h2>{getCurrentDayName()}</h2>
        <p>{dateStr}</p>
      </header>

      {/* Navigation Bar */}
      <div className="navigation-bar">
        <Link to="/" className="back-button">
          <span>←</span>
          {t.back}
        </Link>
        <button
          onClick={() => setShowLoginModal(true)}
          className="add-memory-button">
          + {t.addMemory}
        </button>
      </div>

      {/* Events for this day */}
      {dayEvents.length > 0 && (
        <div className="day-events-card">
          <h3>{t.eventsOfDay}</h3>
          <div className="events-list">
            {dayEvents.map((event) => (
              <div key={event.event_id} className="event-item">
                <div className="event-activity">
                  {event[`activity_${lang}`]}
                </div>
                <div className="event-time">{event.time_range}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Memories section */}
      <div className="memories-section">
        <h3>{t.dayMemories}</h3>
        {memories.length > 0 ? (
          memories.map((memory) => (
            <div key={memory.id} className="memory-item">
              {/* Text story */}
              {memory[`story_text_${lang}`] && (
                <div className="memory-text">
                  {memory[`story_text_${lang}`]}
                </div>
              )}

              {/* Media gallery */}
              {memory.media_urls && memory.media_urls.length > 0 && (
                <div className="media-gallery">
                  {memory.media_urls.map((url, index) => {
                    const isVideo = url.match(/\.(mp4|webm|ogg)$/i);

                    return isVideo ? (
                      <video
                        key={index}
                        src={url}
                        controls
                        className="media-item"
                      />
                    ) : (
                      <img
                        key={index}
                        src={url}
                        alt={`Memory ${index + 1}`}
                        className="media-item"
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-memories">
            <p>{t.noMemories}</p>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setShowLoginModal(false)}
              className="modal-close">
              ×
            </button>
            <LoginModal onSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}
