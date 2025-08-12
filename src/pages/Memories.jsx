/** @format */

import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";
import { LangContext } from "../context/LangContext";
import { LoginModal } from "../component/LoginModal";
import Loading from "../component/Loading";

export default function Memories() {
  const { eventId, dayDate, timeRange } = useParams();
  const { lang } = useContext(LangContext);
  const [event, setEvent] = useState(null);
  const [memories, setMemories] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      let { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();
      if (!error) setEvent(data);
      setLoading(false);
    };

    const fetchMemories = async () => {
      let { data, error } = await supabase
        .from("memories")
        .select("*")
        .eq("event_id", eventId);
      if (!error) setMemories(data || []);
    };

    fetchEvent();
    fetchMemories();
  }, [eventId]);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Navigate to create memory page
    window.location.href = `/create-memory/${eventId}`;
  };

  if (loading) return <Loading />;
  if (!event) return <div>Event not found</div>;

  // Sana formatlash
  const dateObj = new Date(decodeURIComponent(dayDate));
  const dateStr =
    lang === "uz"
      ? dateObj.toLocaleDateString("uz-UZ", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : lang === "ru"
      ? dateObj.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : dateObj.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

  return (
    <div className="memories-page">
      {/* Login tugmasi burchakda */}
      <button
        onClick={() => setShowLoginModal(true)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "10px 15px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000,
        }}>
        + Add Memory
      </button>

      <header>
        <h1>{event[`title_${lang}`] || event[`activity_${lang}`]}</h1>
        <p>
          {dateStr} | {decodeURIComponent(timeRange)}
        </p>
      </header>

      {/* Memories ko'rsatish */}
      <div className="memories-container">
        {memories.length > 0 ? (
          memories.map((memory) => (
            <div
              key={memory.id}
              className="memory-item"
              style={{
                margin: "20px 0",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}>
              {memory[`story_text_${lang}`] && (
                <p style={{ marginBottom: "15px" }}>
                  {memory[`story_text_${lang}`]}
                </p>
              )}
              {memory.media_urls && memory.media_urls.length > 0 && (
                <div className="media-gallery">
                  {memory.media_urls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Memory ${index + 1}`}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        margin: "5px",
                        borderRadius: "4px",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No memories yet. Be the first to add one!</p>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1001,
          }}>
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              position: "relative",
            }}>
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}>
              ×
            </button>
            <LoginModal onSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}
