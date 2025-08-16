/** @format */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function CreateMemory() {
  const { dayDate } = useParams();
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
    // 1. Presigned URL olish uchun backendga so'rov yuboramiz
    const res = await fetch("/.netlify/functions/getPresignedUrl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, contentType: file.type }),
    });

    if (!res.ok) throw new Error("Presigned URL olishda xatolik");

    const { uploadUrl } = await res.json();

    // 2. Faylni to'g'ridan-to'g'ri Cloudflare R2 ga yuklaymiz
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
        const filename = `${dayDate}/${Date.now()}-${file.name}`;
        const url = await uploadFileToR2(file, filename);
        uploadedUrls.push(url);
      }

      // Supabase jadvalga yozish
      const { error: insertError } = await supabase.from("memories").insert([
        {
          day_date: decodeURIComponent(dayDate),
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
      <h1
        style={{ textAlign: "center", marginBottom: "30px", color: "#1f2937" }}>
        Create Memory
      </h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#374151",
            }}>
            Story (O'zbek)
          </label>
          <textarea
            value={storyUz}
            onChange={(e) => setStoryUz(e.target.value)}
            style={{
              width: "100%",
              minHeight: 100,
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "inherit",
            }}
            placeholder="O'zbek tilida xotirangizni yozing..."
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#374151",
            }}>
            Story (English)
          </label>
          <textarea
            value={storyEn}
            onChange={(e) => setStoryEn(e.target.value)}
            style={{
              width: "100%",
              minHeight: 100,
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "inherit",
            }}
            placeholder="Write your memory in English..."
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#374151",
            }}>
            Story (Русский)
          </label>
          <textarea
            value={storyRu}
            onChange={(e) => setStoryRu(e.target.value)}
            style={{
              width: "100%",
              minHeight: 100,
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "inherit",
            }}
            placeholder="Напишите вашу память на русском..."
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#374151",
            }}>
            Upload Images/Videos
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*,video/*"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 20px",
            backgroundColor: loading ? "#9ca3af" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
          }}>
          {loading ? "Saving..." : "Save Memory"}
        </button>
      </form>
    </div>
  );
}
