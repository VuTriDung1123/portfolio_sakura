const fs = require('fs');
const path = require('path');

const filePath = 'd:/Personal_Coding/Personal_Portfolio_VuTriDung_V2/sakura-portfolio/app/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const sections = [
  {
    var: "dbLangCerts",
    id: "lang-certs",
    emptyMsg: "Chưa có chứng chỉ 🍃"
  },
  {
    var: "dbTechCerts",
    id: "tech-certs",
    emptyMsg: "Chưa có chứng chỉ 🍃"
  },
  {
    var: "dbOtherCerts",
    id: "other-certs",
    emptyMsg: "Chưa có chứng chỉ 🍃"
  },
  {
    var: "dbAchievements",
    id: "achievements",
    emptyMsg: ""
  },
  {
    var: "filteredData",
    id: "cat.id", // dynamic
    emptyMsg: ""
  },
  {
    var: "latestPosts",
    id: "blog-posts",
    emptyMsg: ""
  },
  {
    var: "dbItEvents",
    id: "it-events",
    emptyMsg: "Chưa có sự kiện 🍃"
  },
  {
    var: "dbOtherEvents",
    id: "other-events",
    emptyMsg: "Chưa có sự kiện 🍃"
  }
];

sections.forEach(sec => {
  // 1. Replace opening
  // Find the exact <div with style={{ display: "grid" ... }} just before or around {var.length > 0 ? (
  // Since formatting varies slightly, we can use a regex to match the wrapper `<div>` and the `{var.length > 0 ? (`
  
  // For `dbAchievements`, `latestPosts`, `dbItEvents`, `dbOtherEvents`, `filteredData`: the ternary is OUTSIDE the div.
  // For `dbLangCerts`, `dbTechCerts`, `dbOtherCerts`: the ternary is INSIDE the div.

  // Let's just find `display: "grid"` and replace it with `display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", gap: "30px", padding: "15px 10px", width: "100%", scrollbarWidth: "none"`
  // BUT we want arrows. So we MUST wrap the grid in a carousel-wrapper.
  
});
