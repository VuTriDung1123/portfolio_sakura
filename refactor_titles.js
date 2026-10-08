const fs = require('fs');

let code = fs.readFileSync('app/SakuraHomeClient.tsx', 'utf-8');

if (!code.includes('OmamoriTitle')) {
  code = code.replace('import React', 'import OmamoriTitle from "@/components/OmamoriTitle";\nimport React');
}

// 1. Standard titles like ✿ {t.sec_about} ✿
code = code.replace(
  /<h2 className="section-title">\s*<span>(.*?)<\/span>\s*<\/h2>/g,
  (match, p1) => {
    return `<OmamoriTitle title={\`${p1}\`} />`;
  }
);

// 2. Special titles like Contact
code = code.replace(
  /<h2\s*className="section-title"\s*style={{ marginBottom: "20px" }}\s*>\s*<span>\s*✿ 11\. \{" "\}\s*\{\s*currentLang === "vi"\s*\?\s*"LIÊN HỆ"\s*:\s*currentLang === "jp"\s*\?\s*"お問い合わせ"\s*:\s*"CONTACT"\}\{" "\}\s*✿\s*<\/span>\s*<\/h2>/g,
  '<OmamoriTitle title={`✿ 11. ${currentLang === "vi" ? "LIÊN HỆ" : currentLang === "jp" ? "お問い合わせ" : "CONTACT"} ✿`} />'
);

fs.writeFileSync('app/SakuraHomeClient.tsx', code);
console.log('Replaced h2 with OmamoriTitle!');
