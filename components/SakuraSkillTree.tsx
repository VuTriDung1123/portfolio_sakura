"use client";

import React from "react";
import { motion } from "framer-motion";

type SkillItem = { label: string; value: string };
export type SectionBox = { id: string; title: string; items: SkillItem[] };

const parseProficiency = (val: string): number => {
  const v = val.toLowerCase();
  if (v.includes("%")) {
    const num = parseInt(v.replace(/\D/g, ""));
    if (!isNaN(num)) return Math.min(100, Math.max(30, num));
  }
  if (v.match(/expert|advanced|master|native|fluent/)) return 95;
  if (v.match(/intermediate|professional|good/)) return 75;
  if (v.match(/basic|beginner|familiar/)) return 50;
  return 60;
};

const EmaPlaque = ({
  item,
  delay,
}: {
  item: SkillItem;
  delay: number;
}) => {
  const proficiency = parseProficiency(item.value);
  
  // Dây treo: Kỹ năng càng cao dây càng dài (Dao động từ 20px -> 60px)
  const stringLength = 20 + (proficiency / 100) * 40; 
  
  // Hình dạng của Ema (Mái nhà cao 30px)
  const clipShape = "polygon(50% 0%, 100% 25px, 100% 100%, 0% 100%, 0% 25px)";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", width: "240px" }}>
      {/* Sợi dây thừng đỏ (Red Rope) */}
      <motion.div
        initial={{ height: 0 }}
        whileInView={{ height: stringLength }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        style={{
          width: "4px",
          background: "repeating-linear-gradient(45deg, #b71c1c, #b71c1c 4px, #d32f2f 4px, #d32f2f 8px)",
          boxShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          transformOrigin: "top center",
          zIndex: 1,
        }}
      />
      
      {/* Bảng gỗ Ema Wrapper (dùng để drop shadow vì clip-path cắt shadow) */}
      <motion.div
        initial={{ opacity: 0, rotateX: -90, y: -20 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", bounce: 0.5, delay: delay + 0.2 }}
        whileHover={{ scale: 1.05, rotateZ: (Math.random() - 0.5) * 4 }}
        style={{
          width: "100%",
          filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.25))",
          transformOrigin: "top center",
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        {/* Lớp Viền Gỗ Đậm (Outer Border) */}
        <div style={{
          width: "100%",
          background: "linear-gradient(135deg, #5d4037 0%, #3e2723 100%)",
          padding: "4px", // Độ dày viền
          clipPath: clipShape,
        }}>
          
          {/* Lớp Gỗ Sáng Bên Trong (Inner Plaque) */}
          <div style={{
            background: "#f4deaf",
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(139, 69, 19, 0.03) 15px, rgba(139, 69, 19, 0.03) 30px)",
            clipPath: clipShape,
            padding: "40px 15px 20px 15px", // Top padding để nhường chỗ cho lỗ xỏ dây
            minHeight: "140px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            position: "relative",
          }}>
            
            {/* Lỗ xỏ dây (Hole) */}
            <div style={{
              position: "absolute",
              top: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "10px",
              height: "10px",
              background: "#2d1a11",
              borderRadius: "50%",
              boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.4)"
            }} />
            
            {/* Nút thắt dây thừng (Knot) */}
            <div style={{
              position: "absolute",
              top: "8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "14px",
              height: "10px",
              border: "2px solid #b71c1c",
              borderRadius: "4px",
              borderTop: "none",
            }} />

            {/* Nội dung Kỹ Năng */}
            <h3 style={{
              margin: "0 0 12px 0",
              color: "#3e2723",
              fontSize: "17px",
              fontWeight: "900",
              fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              borderBottom: "1px dashed rgba(139, 69, 19, 0.3)",
              paddingBottom: "8px",
              width: "100%",
            }}>
              {item.label}
            </h3>
            <p style={{
              margin: 0,
              color: "#b71c1c",
              fontSize: "13px",
              fontWeight: "600",
              lineHeight: "1.5",
              fontFamily: "'Segoe UI', Roboto, sans-serif",
            }}>
              {item.value}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function SakuraSkillTree({ data }: { data: SectionBox[] }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1100px",
        margin: "0 auto",
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(8px)",
        borderRadius: "24px",
        padding: "60px 30px",
        boxShadow: "0 15px 50px rgba(216, 27, 96, 0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "90px", // Khoảng cách rộng rãi giữa các Rack
      }}
    >
      {data.map((category, catIdx) => (
        <div key={category.id} style={{ position: "relative" }}>
          
          {/* Thanh Gỗ Ngang (Wooden Beam) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: catIdx * 0.2, ease: "easeOut" }}
            style={{
              width: "100%",
              height: "28px",
              background: "linear-gradient(to bottom, #5d4037 0%, #4e342e 30%, #3e2723 70%, #2d1a11 100%)",
              borderRadius: "14px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.4), inset 0 2px 5px rgba(255,255,255,0.15)",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            {/* Biển Khắc Tên Gắn Trên Thanh Gỗ */}
            <div
              style={{
                position: "absolute",
                top: "-18px",
                background: "linear-gradient(to bottom, #d81b60, #ad1457)", // Sakura Dark Pink
                color: "#fff0f5",
                padding: "8px 24px",
                borderRadius: "8px",
                fontWeight: "900",
                fontSize: "16px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                boxShadow: "0 6px 15px rgba(173, 20, 87, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)",
                border: "2px solid #880e4f",
              }}
            >
              {category.title}
            </div>
            
            {/* Vòng thép 2 đầu thanh gỗ (Metal Caps) */}
            <div style={{ position: "absolute", left: "10px", width: "16px", height: "32px", background: "linear-gradient(to right, #757575, #bdbdbd, #757575)", borderRadius: "4px", border: "1px solid #424242" }} />
            <div style={{ position: "absolute", right: "10px", width: "16px", height: "32px", background: "linear-gradient(to right, #757575, #bdbdbd, #757575)", borderRadius: "4px", border: "1px solid #424242" }} />
          </motion.div>

          {/* Khu vực treo Bảng Ema */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "flex-start", // Quan trọng để các thẻ có chiều cao khác nhau không bị kéo giãn
              gap: "25px",
              paddingTop: "0",
              marginTop: "-14px", // Kéo lên để đè dưới thanh gỗ
              zIndex: 1,
              position: "relative",
            }}
          >
            {category.items.map((item, itemIdx) => (
              <EmaPlaque
                key={itemIdx}
                item={item}
                delay={0.5 + catIdx * 0.2 + itemIdx * 0.15}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
