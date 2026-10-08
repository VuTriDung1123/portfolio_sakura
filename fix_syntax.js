const fs = require('fs');

// Fix SakuraHomeClient.tsx
let code = fs.readFileSync('app/SakuraHomeClient.tsx', 'utf-8');

// 1. Add import OmamoriTitle
if (!code.includes('import OmamoriTitle')) {
  code = code.replace('import BlogCarousel from "@/components/BlogCarousel";', 'import BlogCarousel from "@/components/BlogCarousel";\nimport OmamoriTitle from "@/components/OmamoriTitle";');
}

// 2. Fix the title attribute string interpolation
// E.g. <OmamoriTitle title={`✿ {t.sec_about} ✿`} /> -> <OmamoriTitle title={<>✿ {t.sec_about} ✿</>} />
code = code.replace(
  /<OmamoriTitle title={`(.*?)`} \/>/g,
  (match, p1) => {
    // If it contains a literal ${...}, we should remove the $ so it becomes a valid React expression inside <>
    // e.g. ${currentLang === "vi" ? ...} -> {currentLang === "vi" ? ...}
    let inner = p1.replace(/\$\{/g, '{');
    return `<OmamoriTitle title={<>${inner}</>} />`;
  }
);

fs.writeFileSync('app/SakuraHomeClient.tsx', code);

// Fix OmamoriTitle.tsx signature
let omamoriCode = fs.readFileSync('components/OmamoriTitle.tsx', 'utf-8');
omamoriCode = omamoriCode.replace(
  /export default function OmamoriTitle\({ title }: \{ title: string \}\)/,
  'export default function OmamoriTitle({ title }: { title: React.ReactNode })'
);
fs.writeFileSync('components/OmamoriTitle.tsx', omamoriCode);

console.log('Fixed syntax!');
