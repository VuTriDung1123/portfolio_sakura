"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BlogCarousel({ items, getCover, getTitle, getSubtitle }: any) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: direction * 350, behavior: "smooth" });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div style={{
      position: "relative",
      padding: "40px 20px",
      margin: "0 auto 40px auto",
      maxWidth: "1200px",
      background: "rgba(255, 255, 255, 0.4)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.6)",
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
    }}>
      {/* Background Decor */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "url('/textures/washi.png')", // Thêm một chút texture
        opacity: 0.2,
        borderRadius: "20px",
        zIndex: -1,
        pointerEvents: "none"
      }} />

      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <button 
          onClick={() => scroll(-1)}
          style={{
            position: "absolute",
            left: "-15px",
            zIndex: 10,
            width: "40px",
            height: "40px",
            background: "white",
            border: "none",
            borderRadius: "50%",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ff69b4",
            fontSize: "1.2rem",
            transition: "0.2s"
          }}
          className="hover:bg-pink-50"
        >
          &#10094;
        </button>

        <div 
          ref={scrollContainerRef}
          style={{ 
            display: "flex", 
            gap: "30px", 
            overflowX: "auto", 
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            padding: "20px 10px",
            scrollbarWidth: "none" // Ẩn scrollbar mặc định (Firefox)
          }}
          className="no-scrollbar" // Dùng class để ẩn ở Webkit (nếu có định nghĩa)
        >
          <style dangerouslySetInnerHTML={{__html: `
            .no-scrollbar::-webkit-scrollbar { display: none; }
          `}} />

          {items.map((p: any, i: number) => (
            <motion.div
              key={p.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              style={{
                minWidth: "300px",
                maxWidth: "300px",
                scrollSnapAlign: "start",
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                overflow: "hidden",
                border: "8px solid transparent",
                borderImage: "linear-gradient(to right, #5d4037, #3e2723) 1",
                backgroundClip: "padding-box",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Link href={`/blog/${p.id}`} draggable={false} style={{ display: "block", textDecoration: "none" }}>
                <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                  <img
                    src={getCover(p.images)}
                    alt={getTitle(p)}
                    draggable={false}
                    style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                  />
                </div>
                <div style={{ 
                  padding: "20px", 
                  background: "#f4eedd", 
                  borderTop: "6px solid #2d1a11",
                  minHeight: "130px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <h3 style={{ 
                    margin: 0, 
                    color: "#3e2723", 
                    fontWeight: "bold", 
                    fontSize: "1.1rem", 
                    fontFamily: "'Noto Serif', serif",
                    lineHeight: "1.4",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {getTitle(p)}
                  </h3>
                  {getSubtitle && (
                    <p style={{ 
                      margin: "10px 0 0", 
                      color: "#b71c1c", 
                      fontSize: "0.9rem",
                      fontWeight: "600" 
                    }}>
                      {getSubtitle(p)}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <button 
          onClick={() => scroll(1)}
          style={{
            position: "absolute",
            right: "-15px",
            zIndex: 10,
            width: "40px",
            height: "40px",
            background: "white",
            border: "none",
            borderRadius: "50%",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ff69b4",
            fontSize: "1.2rem",
            transition: "0.2s"
          }}
          className="hover:bg-pink-50"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}
