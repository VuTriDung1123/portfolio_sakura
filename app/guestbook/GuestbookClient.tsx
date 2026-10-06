"use client";

import { useState, useMemo } from "react";
import { addGuestbookEntry, getGuestbookEntries } from "@/lib/actions";
import Link from "next/link";
import SakuraFalling from "@/components/SakuraFalling";

interface Entry {
  id: string;
  name: string;
  message: string;
  icon: string;
  row?: number; // Optional cho dữ liệu cũ
  col?: number; // Optional cho dữ liệu cũ
  createdAt: string | Date;
}

const ROWS = 7;
const COLS = 10;
const ICONS = ["🌸", "🍡", "🦊", "⛩️", "🍵", "🎐", "🎋", "🎎", "🎏", "🍣"];

export default function GuestbookClient({ initialEntries }: { initialEntries: Entry[] }) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  
  // States cho Modals
  const [selectedSlot, setSelectedSlot] = useState<{ r: number; c: number } | null>(null);
  const [showWriteModal, setShowWriteModal] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("🌸");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nhóm các Ema theo vị trí [row-col]
  const groupedEntries = useMemo(() => {
    const map = new Map<string, Entry[]>();
    entries.forEach(e => {
      // Mặc định các thẻ cũ không có row/col sẽ dồn về 0-0 hoặc rải rác ngẫu nhiên.
      // Để tránh lỗi, ta lấy giá trị 0 nếu không có.
      const r = e.row ?? 0;
      const c = e.col ?? 0;
      const key = `${r}-${c}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return map;
  }, [entries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !selectedSlot) return;
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("message", message.trim());
    formData.append("icon", icon);
    formData.append("row", selectedSlot.r.toString());
    formData.append("col", selectedSlot.c.toString());

    await addGuestbookEntry(formData);
    
    const newEntries = await getGuestbookEntries();
    setEntries(newEntries as unknown as Entry[]);
    
    setName("");
    setMessage("");
    setShowWriteModal(false);
    setIsSubmitting(false);
  };

  const handleSlotClick = (r: number, c: number) => {
    setSelectedSlot({ r, c });
  };

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      position: "relative",
      fontFamily: "var(--font-noto)",
      backgroundColor: "#e8f1f2", // Nền trời sáng dịu
      overflowX: "hidden",
      paddingBottom: "50px"
    }}>
      <SakuraFalling />

      {/* Header */}
      <div style={{ position: "relative", zIndex: 100, padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" className="btn-pink" style={{ 
          padding: "10px 20px", 
          borderRadius: "20px", 
          textDecoration: "none", 
          fontWeight: "bold",
          background: "white",
          border: "2px solid #a1887f",
          color: "#5d4037",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
          &#8592; Quay lại
        </Link>
      </div>

      <div style={{ textAlign: "center", position: "relative", zIndex: 10, padding: "0 20px 30px" }}>
        <h1 style={{ color: "#3e2723", fontSize: "2rem", fontWeight: "900", margin: 0, textShadow: "1px 1px 3px rgba(255,255,255,0.8)" }}>
          Nơi Lưu Giữ Ước Nguyện
        </h1>
        <p style={{ color: "#5d4037", fontWeight: "600", marginTop: "10px" }}>
          Nhấp vào bất kỳ móc treo nào để xem hoặc treo thẻ Ema của riêng bạn.
        </p>
      </div>

      {/* RACK GỖ MÀU TỰ NHIÊN - CHI TIẾT TỪ ẢNH THỰC TẾ */}
      <div style={{
        width: "100%",
        overflowX: "auto", // Cho phép lướt ngang trên điện thoại
        padding: "0 20px"
      }}>
        <div style={{
          position: "relative",
          width: "1200px", // Cố định chiều rộng để đủ nhét 10 cột
          margin: "0 auto",
          paddingTop: "60px",
          paddingBottom: "40px"
        }}>
          {/* Mái che (Màu ngói xám đen) */}
          <div style={{
            position: "absolute",
            top: 0, left: "-3%", width: "106%", height: "40px",
            background: "linear-gradient(to bottom, #424242, #212121)",
            borderRadius: "5px 5px 0 0",
            boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
            zIndex: 4
          }} />
          
          {/* Xà ngang chính dưới mái */}
          <div style={{
            position: "absolute",
            top: "40px", left: "-1%", width: "102%", height: "40px",
            background: "linear-gradient(to right, #d7ccc8, #bcaaa4, #d7ccc8)", // Vân gỗ sáng
            boxShadow: "inset 0 -5px 10px rgba(0,0,0,0.2), 0 5px 10px rgba(0,0,0,0.3)",
            zIndex: 3
          }} />

          {/* Biển hiệu chữ Hán (絵馬掛け所) */}
          <div style={{
            position: "absolute",
            top: "50px", left: "50%", transform: "translateX(-50%)",
            background: "#ffe0b2", // Gỗ mịn sáng
            border: "2px solid #8d6e63",
            padding: "10px 40px",
            borderRadius: "4px",
            boxShadow: "2px 5px 10px rgba(0,0,0,0.4)",
            zIndex: 5,
            color: "#3e2723",
            fontSize: "2.5rem",
            fontWeight: "bold",
            letterSpacing: "5px",
            fontFamily: "serif"
          }}>
            絵馬掛け所
          </div>

          {/* Cột trái */}
          <div style={{
            position: "absolute",
            top: "40px", left: "30px", width: "50px", height: "100%",
            background: "linear-gradient(to right, #bcaaa4, #8d6e63)",
            boxShadow: "inset -5px 0 10px rgba(0,0,0,0.2), 5px 0 15px rgba(0,0,0,0.3)",
            zIndex: 0,
            borderRadius: "4px"
          }} />

          {/* Cột phải */}
          <div style={{
            position: "absolute",
            top: "40px", right: "30px", width: "50px", height: "100%",
            background: "linear-gradient(to right, #bcaaa4, #8d6e63)",
            boxShadow: "inset 5px 0 10px rgba(0,0,0,0.2), -5px 0 15px rgba(0,0,0,0.3)",
            zIndex: 0,
            borderRadius: "4px"
          }} />

          {/* Lưới treo thẻ (7 hàng x 10 cột) */}
          <div style={{
            position: "relative",
            zIndex: 2,
            padding: "120px 80px 20px", // Chừa chỗ cho biển hiệu
            display: "flex",
            flexDirection: "column",
            gap: "50px" // Khoảng cách giữa các hàng ngang
          }}>
            {Array.from({ length: ROWS }).map((_, r) => (
              <div key={r} style={{ position: "relative", width: "100%", display: "flex", justifyContent: "space-between" }}>
                
                {/* Thanh gỗ nhỏ nằm ngang đằng sau */}
                <div style={{
                  position: "absolute",
                  top: "10px", left: "-20px", right: "-20px", height: "15px",
                  background: "#795548", // Màu gỗ đậm làm nền
                  boxShadow: "inset 0 3px 5px rgba(0,0,0,0.4)",
                  zIndex: 1
                }} />

                {Array.from({ length: COLS }).map((_, c) => {
                  const key = `${r}-${c}`;
                  const slotEntries = groupedEntries.get(key) || [];
                  const count = slotEntries.length;
                  const topEntry = count > 0 ? slotEntries[count - 1] : null; // Lấy thẻ mới nhất hiển thị

                  return (
                    <div 
                      key={c}
                      className="slot-hook"
                      onClick={() => handleSlotClick(r, c)}
                      style={{
                        position: "relative",
                        width: "80px",
                        height: "80px",
                        zIndex: 5,
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {/* Đinh ốc treo */}
                      <div style={{
                        position: "absolute",
                        top: "10px", left: "50%", transform: "translateX(-50%)",
                        width: "8px", height: "8px",
                        background: "#212121", borderRadius: "50%",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                        zIndex: 10
                      }} />

                      {topEntry ? (
                        <div style={{ position: "relative", top: "15px", zIndex: 6, transform: "scale(0.8)", transformOrigin: "top center", animation: `emaSway ${3 + (c % 3)}s ease-in-out infinite alternate` }}>
                          
                          {/* Sợi dây nhỏ */}
                          <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", width: "2px", height: "15px", background: "#d32f2f" }}/>

                          <div style={{
                            width: "90px", height: "70px",
                            background: "repeating-linear-gradient(to bottom, #fcf0da, #fcf0da 5px, #f5e4c6 5px, #f5e4c6 7px)",
                            clipPath: "polygon(0 20px, 50% 0, 100% 20px, 100% 100%, 0 100%)",
                            padding: "20px 5px 5px",
                            textAlign: "center",
                            boxShadow: "2px 5px 10px rgba(0,0,0,0.3)",
                            border: "1px solid #d7ccc8",
                            position: "relative"
                          }}>
                            {/* Chấm bi hoa đào góc */}
                            <div style={{ position: "absolute", top: "20px", left: "5px", color: "#ff80ab", fontSize: "0.5rem" }}>🌸</div>
                            <div style={{ position: "absolute", bottom: "5px", right: "5px", color: "#ff80ab", fontSize: "0.5rem" }}>🌸</div>

                            <div style={{ fontSize: "1.2rem", marginBottom: "2px" }}>{topEntry.icon}</div>
                            <div style={{ fontSize: "0.5rem", fontWeight: "bold", color: "#3e2723", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                              {topEntry.name}
                            </div>
                            
                            {/* Hiển thị số thẻ đang chèn nếu có nhiều hơn 1 */}
                            {count > 1 && (
                              <div style={{ position: "absolute", bottom: "-10px", right: "-10px", background: "#d32f2f", color: "white", fontSize: "0.7rem", fontWeight: "bold", padding: "2px 6px", borderRadius: "10px", border: "2px solid white", boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                                +{count - 1}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="empty-indicator" style={{
                          position: "relative",
                          top: "25px",
                          width: "30px", height: "30px",
                          border: "2px dashed #a1887f",
                          borderRadius: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "#a1887f",
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          opacity: 0.5,
                          background: "rgba(255,255,255,0.3)",
                          transition: "0.2s"
                        }}>
                          +
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes emaSway {
          0% { transform: scale(0.85) rotate(-3deg); }
          100% { transform: scale(0.85) rotate(3deg); }
        }
        .slot-hook:hover .empty-indicator {
          opacity: 1 !important;
          background: rgba(255,255,255,0.8) !important;
          border-color: #d81b60 !important;
          color: #d81b60 !important;
          transform: scale(1.1);
        }
        .modal-overlay { animation: fadeIn 0.3s ease; }
        .modal-box { animation: slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes fadeIn { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(5px); } }
        @keyframes slideDown { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      {/* MODAL KHI CLICK VÀO SLOT */}
      {selectedSlot && !showWriteModal && (
        <div className="modal-overlay" style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)", zIndex: 1000,
          display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"
        }}>
          <div className="modal-box" style={{ 
            width: "100%", maxWidth: "500px", background: "#fff", borderRadius: "16px", padding: "30px", position: "relative",
            maxHeight: "80vh", display: "flex", flexDirection: "column"
          }}>
            <button onClick={() => setSelectedSlot(null)} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#8d6e63" }}>&times;</button>
            <h3 style={{ color: "#d81b60", textAlign: "center", marginBottom: "5px" }}>Vị trí hàng {selectedSlot.r + 1}, cột {selectedSlot.c + 1}</h3>
            
            {/* Hiển thị các thẻ đang có */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 0", display: "flex", flexDirection: "column", gap: "15px" }}>
              {(() => {
                const slotEntries = groupedEntries.get(`${selectedSlot.r}-${selectedSlot.c}`) || [];
                if (slotEntries.length === 0) {
                  return <div style={{ textAlign: "center", color: "#9e9e9e", padding: "40px 0" }}>Chưa có lời nguyện cầu nào ở vị trí này. Bạn hãy là người đầu tiên!</div>;
                }
                return slotEntries.map(entry => (
                  <div key={entry.id} style={{
                    background: "#fdf8ec", border: "1px solid #d7ccc8", borderRadius: "8px", padding: "15px",
                    display: "flex", gap: "15px", alignItems: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                  }}>
                    <div style={{ fontSize: "2rem" }}>{entry.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", color: "#5d4037" }}>{entry.name}</div>
                      <div style={{ fontSize: "0.9rem", color: "#795548", marginTop: "4px" }}>{entry.message}</div>
                    </div>
                  </div>
                ));
              })()}
            </div>

            <button
              onClick={() => setShowWriteModal(true)}
              style={{ width: "100%", padding: "12px", background: "#d81b60", color: "white", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer", marginTop: "10px", boxShadow: "0 4px 10px rgba(216, 27, 96, 0.3)" }}
            >
              + Treo thẻ Ema của bạn vào đây
            </button>
          </div>
        </div>
      )}

      {/* MODAL FORM VIẾT LỜI CẦU NGUYỆN */}
      {showWriteModal && selectedSlot && (
        <div className="modal-overlay" style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)", zIndex: 1100,
          display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"
        }}>
          <div className="modal-box" style={{ 
            width: "100%", maxWidth: "400px", background: "white", border: "3px solid #ffb7c5", borderRadius: "20px", padding: "30px", position: "relative"
          }}>
            <button onClick={() => setShowWriteModal(false)} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#8d6e63" }}>&times;</button>
            <h3 style={{ color: "#d81b60", textAlign: "center", marginBottom: "20px" }}>Viết Lời Nguyện Cầu</h3>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input type="text" placeholder="Tên của bạn" value={name} onChange={(e) => setName(e.target.value)} required maxLength={25}
                style={{ padding: "12px", borderRadius: "8px", border: "2px solid #ffc1e3", outline: "none" }} />
              <textarea placeholder="Lời nhắn chân thành..." value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} maxLength={150}
                style={{ padding: "12px", borderRadius: "8px", border: "2px solid #ffc1e3", outline: "none", resize: "none" }} />
              
              <div>
                <div style={{ textAlign: "center", marginBottom: "8px", color: "#8d6e63", fontSize: "0.9rem", fontWeight: "bold" }}>Chọn Icon</div>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center" }}>
                  {ICONS.map((ic) => (
                    <button key={ic} type="button" onClick={() => setIcon(ic)}
                      style={{ background: icon === ic ? "#ffb7c5" : "transparent", border: icon === ic ? "2px solid #d81b60" : "1px solid #ccc", borderRadius: "8px", padding: "8px", fontSize: "1.2rem", cursor: "pointer" }}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isSubmitting}
                style={{ padding: "15px", borderRadius: "10px", background: "linear-gradient(135deg, #ffb7c5, #d81b60)", color: "white", border: "none", fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer", marginTop: "10px" }}>
                {isSubmitting ? "Đang gửi..." : "Hoàn Tất Treo Thẻ"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
