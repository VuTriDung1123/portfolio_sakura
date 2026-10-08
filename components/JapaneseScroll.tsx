"use client";
import React from "react";
import { motion } from "framer-motion";

export default function JapaneseScroll({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      whileInView={{ opacity: 1, scaleY: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: "easeInOut" }}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "1100px", // Made it bigger!
        margin: "40px auto",
        padding: "60px 40px",
        background: "#fdfbf7",
        // Japanese Washi paper noise effect via CSS radial gradients
        backgroundImage: "radial-gradient(#e0d6c8 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
        borderLeft: "2px solid #e0d6c8",
        borderRight: "2px solid #e0d6c8",
        transformOrigin: "top center",
      }}
    >
      {/* Top Lacquer/Fabric Roller (No Wood) */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "28px",
        backgroundColor: "#8e0000",
        backgroundImage: `
          linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.3) 50%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0.8) 100%),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.2'%3E%3Ccircle cx='20' cy='20' r='20'/%3E%3Ccircle cx='0' cy='0' r='20'/%3E%3Ccircle cx='40' cy='0' r='20'/%3E%3Ccircle cx='0' cy='40' r='20'/%3E%3Ccircle cx='40' cy='40' r='20'/%3E%3C/g%3E%3C/svg%3E")
        `,
        boxShadow: "0 10px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 5,
        borderRadius: "2px",
      }}>
        {/* Golden caps */}
        <div style={{ 
          width: "20px", height: "100%", 
          background: "linear-gradient(to bottom, #825a1f 0%, #d4af37 30%, #fff3b0 50%, #d4af37 70%, #825a1f 100%)", 
          boxShadow: "inset -2px 0 3px rgba(0,0,0,0.4), 2px 0 5px rgba(0,0,0,0.5)",
          borderRight: "1px solid rgba(255,255,255,0.4)",
          borderRadius: "3px 0 0 3px"
        }} />
        <div style={{ 
          width: "20px", height: "100%", 
          background: "linear-gradient(to bottom, #825a1f 0%, #d4af37 30%, #fff3b0 50%, #d4af37 70%, #825a1f 100%)", 
          boxShadow: "inset 2px 0 3px rgba(0,0,0,0.4), -2px 0 5px rgba(0,0,0,0.5)",
          borderLeft: "1px solid rgba(255,255,255,0.4)",
          borderRadius: "0 3px 3px 0"
        }} />
      </div>
      
      {/* Hanging Braided Silk Ribbon (Kumihimo style) */}
      <div style={{
        position: "absolute",
        top: "-40px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "16px",
        height: "40px",
        background: `
          linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.3) 50%, rgba(0,0,0,0.4) 100%),
          repeating-linear-gradient(45deg, #d4af37, #d4af37 3px, #b8860b 3px, #b8860b 6px)
        `,
        boxShadow: "3px 3px 8px rgba(0,0,0,0.4)",
        borderRadius: "2px",
        zIndex: -1
      }} />

      {/* Bottom Lacquer/Fabric Roller */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "35px",
        backgroundColor: "#8e0000",
        backgroundImage: `
          linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0.8) 100%),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.2'%3E%3Ccircle cx='20' cy='20' r='20'/%3E%3Ccircle cx='0' cy='0' r='20'/%3E%3Ccircle cx='40' cy='0' r='20'/%3E%3Ccircle cx='0' cy='40' r='20'/%3E%3Ccircle cx='40' cy='40' r='20'/%3E%3C/g%3E%3C/svg%3E")
        `,
        boxShadow: "0 -5px 15px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 5,
        borderRadius: "3px",
      }}>
        {/* Golden caps */}
        <div style={{ 
          width: "25px", height: "100%", 
          background: "linear-gradient(to bottom, #825a1f 0%, #d4af37 30%, #fff3b0 50%, #d4af37 70%, #825a1f 100%)", 
          boxShadow: "inset -3px 0 5px rgba(0,0,0,0.5), 2px 0 6px rgba(0,0,0,0.6)",
          borderRight: "1px solid rgba(255,255,255,0.5)",
          borderRadius: "4px 0 0 4px"
        }} />
        <div style={{ 
          width: "25px", height: "100%", 
          background: "linear-gradient(to bottom, #825a1f 0%, #d4af37 30%, #fff3b0 50%, #d4af37 70%, #825a1f 100%)", 
          boxShadow: "inset 3px 0 5px rgba(0,0,0,0.5), -2px 0 6px rgba(0,0,0,0.6)",
          borderLeft: "1px solid rgba(255,255,255,0.5)",
          borderRadius: "0 4px 4px 0"
        }} />
      </div>
      
      <div style={{
        fontFamily: "'Noto Serif', 'Times New Roman', serif",
        color: "#212121",
        lineHeight: "2",
        fontSize: "1.1rem",
        textAlign: "justify",
        position: "relative",
        zIndex: 1,
      }}>
        {children}
      </div>
    </motion.div>
  );
}
