"use client";

import { useState } from "react";
import { addGuestbookEntry } from "@/lib/actions";
import { Lang } from "@/lib/data";

interface Entry {
  id: string;
  name: string;
  message: string;
  icon: string;
  createdAt: string | Date;
}

export default function EmaBoard({
  entries,
  currentLang,
  onNewEntry,
}: {
  entries: Entry[];
  currentLang: Lang;
  onNewEntry: () => void;
}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("🌸");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ICONS = ["🌸", "🍡", "🦊", "⛩️", "🍵", "🎐", "🎋", "🎎", "🎏", "🍣"];

  const titles = {
    vi: "Sổ Lưu Bút Gỗ (Ema Board)",
    en: "Ema Guestbook",
    jp: "絵馬掛け (Guestbook)",
  };

  const desc = {
    vi: "Hãy để lại một lời nhắn dễ thương lên bảng gỗ nhé! 🎋",
    en: "Leave a cute message on the wooden board! 🎋",
    jp: "木の板に可愛いメッセージを残してね！ 🎋",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("message", message.trim());
    formData.append("icon", icon);

    await addGuestbookEntry(formData);
    setName("");
    setMessage("");
    setIsSubmitting(false);
    onNewEntry();
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 className="section-title">
        <span>✿ {titles[currentLang]} ✿</span>
      </h2>
      <p style={{ textAlign: "center", marginBottom: "30px", color: "#6d4c41", fontWeight: "bold" }}>
        {desc[currentLang]}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "center" }}>
        {/* FORM */}
        <div className="glass-box" style={{ width: "350px", padding: "30px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
              type="text"
              placeholder={currentLang === "vi" ? "Tên của bạn..." : "Your name..."}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ padding: "10px", borderRadius: "10px", border: "1px solid #ffc1e3", outline: "none", fontFamily: "inherit" }}
              maxLength={25}
            />
            <textarea
              placeholder={currentLang === "vi" ? "Lời nhắn..." : "Message..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              style={{ padding: "10px", borderRadius: "10px", border: "1px solid #ffc1e3", outline: "none", resize: "none", fontFamily: "inherit" }}
              maxLength={150}
            />
            <div>
              <p style={{ fontSize: "0.85rem", color: "#8d6e63", marginBottom: "5px" }}>
                {currentLang === "vi" ? "Chọn biểu tượng:" : "Select icon:"}
              </p>
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                {ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    style={{
                      background: icon === ic ? "#ffb7c5" : "white",
                      border: "1px solid #ffc1e3",
                      borderRadius: "5px",
                      padding: "5px",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                      transition: "0.2s",
                    }}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-pink"
              style={{ padding: "10px", borderRadius: "20px", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}
            >
              {isSubmitting ? "..." : (currentLang === "vi" ? "Treo thẻ gỗ 🎐" : "Hang Plaque 🎐")}
            </button>
          </form>
        </div>

        {/* EMA BOARD */}
        <div style={{
          flex: 1,
          minWidth: "300px",
          background: "rgba(255, 255, 255, 0.4)",
          border: "4px solid #8d6e63",
          borderRadius: "15px",
          padding: "40px 20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          justifyContent: "center",
          alignItems: "flex-start",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.05)",
          maxHeight: "500px",
          overflowY: "auto"
        }}>
          {entries.length === 0 ? (
             <p style={{ color: "#8d6e63", fontStyle: "italic", alignSelf: "center" }}>
               {currentLang === "vi" ? "Chưa có lời nhắn nào. Hãy là người đầu tiên!" : "No messages yet. Be the first!"}
             </p>
          ) : (
            entries.map((entry, idx) => (
              <div key={entry.id} className="ema-card" style={{ animationDelay: `${(idx % 5) * 0.2}s` }}>
                <div className="ema-string"></div>
                <div className="ema-hole"></div>
                <div style={{ fontSize: "2rem", marginBottom: "5px" }}>{entry.icon}</div>
                <div style={{ flex: 1, fontSize: "0.95rem", lineHeight: "1.4", overflow: "hidden", textOverflow: "ellipsis", wordWrap: "break-word" }}>
                  {entry.message}
                </div>
                <div style={{ fontWeight: "bold", fontSize: "0.85rem", borderTop: "1px dashed rgba(0,0,0,0.2)", paddingTop: "5px", marginTop: "10px" }}>
                  - {entry.name}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
