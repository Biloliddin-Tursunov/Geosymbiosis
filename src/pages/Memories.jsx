/** @format */

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Memories() {
  const { eventId, dayDate, timeRange } = useParams();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMemories() {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .eq("event_id", eventId);

      if (error) {
        console.error(error);
      } else {
        setMemories(data);
      }
      setLoading(false);
    }

    fetchMemories();
  }, [eventId]);

  if (loading) return <p>Loading memories...</p>;

  return (
    <div>
      <h1>
        Event ID: {eventId} | Date: {decodeURIComponent(dayDate)} | Time:{" "}
        {decodeURIComponent(timeRange)}
      </h1>

      {memories.length === 0 && <p>No memories found for this event.</p>}

      <div className="memories-list">
        {memories.map((memory) =>
          memory.type === "video" ? (
            <video key={memory.id} controls width="320" src={memory.url} />
          ) : (
            <img
              key={memory.id}
              src={memory.url}
              alt={memory.description || "memory"}
              width="320"
            />
          )
        )}
      </div>
    </div>
  );
}
