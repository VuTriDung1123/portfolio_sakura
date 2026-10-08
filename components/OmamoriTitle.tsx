"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function OmamoriTitle({ title }: { title: React.ReactNode }) {
  return (
    <motion.div
      className="mx-auto lg:mx-0"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "120px",
        minHeight: "350px",
        // Using border-image to stretch the middle without distorting the top knot
        borderImageSource: "url('/omamori.png')",
        borderImageSlice: "35% 10% 10% 10% fill", // Approximate percentages for knot and borders
        borderImageWidth: "120px 20px 20px 20px",
        borderImageOutset: "0px",
        borderImageRepeat: "round",
        borderStyle: "solid",
        borderColor: "transparent",
        color: "#5d4037", // Dark brown for contrast, assuming omamori is pink/light
        writingMode: "vertical-rl",
        textOrientation: "upright", 
        padding: "10px",
        paddingTop: "40px", // Push text below the knot
        fontSize: "1.4rem",
        fontWeight: "bold",
        fontFamily: "'Noto Serif', 'Times New Roman', serif",
        textShadow: "1px 1px 0px rgba(255,255,255,0.8)",
        marginBottom: "20px",
        flexShrink: 0, // Prevent shrinking in flex layout
      }}
    >
      <span style={{ letterSpacing: "8px", color: "#b71c1c", paddingTop: "20px" }}>{title}</span>
    </motion.div>
  );
}
