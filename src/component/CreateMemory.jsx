/** @format */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function CreateMemory() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [storyUz, setStoryUz] = useState("");
  const [storyEn, setStoryEn] = useState("");
  const [storyRu, setStoryRu] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const uploadFileToR2 = async (file, filename) => {
    // 1. Presigned URL olish uchun backendga so‘rov yuboramiz
    const res = await fetch("/.netlify/functions/getPresignedUrl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, contentType: file.type }),
    });

    if (!res.ok) throw new Error("Presigned URL olishda xatolik");

    const { uploadUrl } = await res.json();

    // 2. Faylni to‘g‘ridan-to‘g‘ri Cloudflare R2 ga yuklaymiz
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) throw new Error("Fayl yuklashda xatolik");

    // 3. Public URL ni qaytaramiz (Cloudflare qoidalariga qarab sozlash kerak)
    const accountId = import.meta.env.REACT_APP_CF_ACCOUNT_ID;
    const bucketName = import.meta.env.VITE_R2_BUCKET;

    return `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${filename}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const filename = `${eventId}/${Date.now()}-${file.name}`;
        const url = await uploadFileToR2(file, filename);
        uploadedUrls.push(url);
      }

      // Supabase jadvalga yozish
      const { error: insertError } = await supabase.from("memories").insert([
        {
          event_id: parseInt(eventId, 10),
          story_text_uz: storyUz || null,
          story_text_en: storyEn || null,
          story_text_ru: storyRu || null,
          media_urls: uploadedUrls.length > 0 ? uploadedUrls : null,
        },
      ]);

      if (insertError) throw insertError;

      alert("Xotira muvaffaqiyatli yaratildi!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(`Xatolik yuz berdi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Create Memory</h1>
      <form onSubmit={handleSubmit}>
        <label>Story (Uzbek)</label>
        <textarea
          value={storyUz}
          onChange={(e) => setStoryUz(e.target.value)}
          style={{ width: "100%", minHeight: 100, marginBottom: 15 }}
        />
        <label>Story (English)</label>
        <textarea
          value={storyEn}
          onChange={(e) => setStoryEn(e.target.value)}
          style={{ width: "100%", minHeight: 100, marginBottom: 15 }}
        />
        <label>Story (Russian)</label>
        <textarea
          value={storyRu}
          onChange={(e) => setStoryRu(e.target.value)}
          style={{ width: "100%", minHeight: 100, marginBottom: 15 }}
        />
        <label>Upload images/videos</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          accept="image/*,video/*"
          style={{ width: "100%", marginBottom: 20 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Memory"}
        </button>
      </form>
    </div>
  );
}
