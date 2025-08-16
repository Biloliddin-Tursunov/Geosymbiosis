/** @format */

import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { LangContext } from "../context/LangContext";

// Translation objects
const translations = {
  uz: {
    createMemory: "Xotira yaratish",
    storyUz: "Hikoya (O'zbek)",
    storyEn: "Hikoya (English)",
    storyJa: "Hikoya (日本語)",
    placeholderUz: "O'zbek tilida xotirangizni yozing...",
    placeholderEn: "Write your memory in English...",
    placeholderJa: "日本語で思い出を書いてください...",
    uploadMedia: "Rasm/Video yuklash",
    saveMemory: "Xotirani saqlash",
    saving: "Saqlanmoqda...",
    success: "Xotira muvaffaqiyatli yaratildi!",
    error: "Xatolik yuz berdi",
    back: "Orqaga",
  },
  en: {
    createMemory: "Create Memory",
    storyUz: "Story (Uzbek)",
    storyEn: "Story (English)",
    storyJa: "Story (Japanese)",
    placeholderUz: "Write your memory in Uzbek...",
    placeholderEn: "Write your memory in English...",
    placeholderJa: "Write your memory in Japanese...",
    uploadMedia: "Upload Images/Videos",
    saveMemory: "Save Memory",
    saving: "Saving...",
    success: "Memory created successfully!",
    error: "An error occurred",
    back: "Back",
  },
  ja: {
    createMemory: "思い出を作る",
    storyUz: "ストーリー (ウズベク語)",
    storyEn: "ストーリー (英語)",
    storyJa: "ストーリー (日本語)",
    placeholderUz: "ウズベク語で思い出を書いてください...",
    placeholderEn: "英語で思い出を書いてください...",
    placeholderJa: "日本語で思い出を書いてください...",
    uploadMedia: "画像/動画をアップロード",
    saveMemory: "思い出を保存",
    saving: "保存中...",
    success: "思い出が正常に作成されました！",
    error: "エラーが発生しました",
    back: "戻る",
  },
};

export default function CreateMemory() {
  const { dayDate } = useParams();
  const navigate = useNavigate();
  const { lang } = useContext(LangContext);

  const [storyUz, setStoryUz] = useState("");
  const [storyEn, setStoryEn] = useState("");
  const [storyJa, setStoryJa] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const t = translations[lang] || translations.en;

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if at least one story field is filled
      if (!storyUz && !storyEn && !storyJa) {
        alert("Kamida bitta matn kiriting!");
        setLoading(false);
        return;
      }

      // Log files for future implementation
      if (files.length > 0) {
        console.log(
          "Files will be uploaded when backend is configured:",
          files.map((f) => f.name)
        );
      }

      // Insert into Supabase
      const { error: insertError } = await supabase.from("memories").insert([
        {
          day_date: decodeURIComponent(dayDate),
          story_text_uz: storyUz.trim() || null,
          story_text_en: storyEn.trim() || null,
          story_text_ja: storyJa.trim() || null,
          media_urls: null, // Temporarily disabled until R2 is configured
        },
      ]);

      if (insertError) {
        console.error("Supabase error:", insertError);
        throw new Error(insertError.message);
      }

      alert(t.success);
      navigate(-1);
    } catch (err) {
      console.error("Error creating memory:", err);
      alert(`${t.error}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = () => {
    try {
      const dateObj = new Date(decodeURIComponent(dayDate));
      switch (lang) {
        case "uz":
          return dateObj.toLocaleDateString("uz-UZ", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        case "ja":
          return dateObj.toLocaleDateString("ja-JP", {
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
    } catch {
      return dayDate;
    }
  };

  return (
    <div className="create-memory-page">
      {/* Header */}
      <div className="create-memory-header">
        <h1>{t.createMemory}</h1>
        <p>{formatDate()}</p>
      </div>

      {/* Navigation */}
      <div className="navigation-bar">
        <button onClick={() => navigate(-1)} className="back-button">
          <span>←</span>
          {t.back}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="create-memory-form">
        {/* Uzbek Story */}
        <div className="form-group">
          <label>{t.storyUz}</label>
          <textarea
            value={storyUz}
            onChange={(e) => setStoryUz(e.target.value)}
            placeholder={t.placeholderUz}
            rows={4}
          />
        </div>

        {/* English Story */}
        <div className="form-group">
          <label>{t.storyEn}</label>
          <textarea
            value={storyEn}
            onChange={(e) => setStoryEn(e.target.value)}
            placeholder={t.placeholderEn}
            rows={4}
          />
        </div>

        {/* Japanese Story */}
        <div className="form-group">
          <label>{t.storyJa}</label>
          <textarea
            value={storyJa}
            onChange={(e) => setStoryJa(e.target.value)}
            placeholder={t.placeholderJa}
            rows={4}
          />
        </div>

        {/* File Upload - Temporarily disabled */}
        <div className="form-group">
          <label>{t.uploadMedia}</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*,video/*"
            disabled={true}
          />
          <div className="file-upload-note">
            File upload temporarily disabled - text only for now
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="create-memory-submit">
          {loading ? t.saving : t.saveMemory}
        </button>
      </form>
    </div>
  );
}
