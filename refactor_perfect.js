const fs = require('fs');
let code = fs.readFileSync('app/SakuraHomeClient.tsx', 'utf-8');

if (!code.includes('import OmamoriTitle')) {
  code = code.replace('import BlogCarousel from "@/components/BlogCarousel";', 'import BlogCarousel from "@/components/BlogCarousel";\nimport OmamoriTitle from "@/components/OmamoriTitle";');
}

code = code.replace(
  /<section[\s\S]*?id="([^"]+)"[\s\S]*?>([\s\S]*?)<\/section>/g,
  (match, id, content) => {
    if (id === 'home') return match;

    let titleText = "";
    const h2Regex = /<h2[^>]*className="section-title"[^>]*>([\s\S]*?)<\/h2>/;
    const h2Match = content.match(h2Regex);
    
    if (h2Match) {
      let spanContent = h2Match[1];
      const spanRegex = /<span[^>]*>([\s\S]*?)<\/span>/;
      const spanMatch = spanContent.match(spanRegex);
      if (spanMatch) {
         titleText = spanMatch[1].trim();
      } else {
         titleText = spanContent.trim();
      }
      
      titleText = titleText.replace(/\$\{/g, '{');
      
      // 1. Remove the h2 from the content
      let newContent = content.replace(h2Regex, "");
      
      // 2. Replace the first <ScrollReveal>
      // We use a regex that just replaces the first occurrence of <ScrollReveal>
      newContent = newContent.replace(
        /<ScrollReveal([^>]*)>/,
        (srMatch, srAttrs) => {
          return `<ScrollReveal className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full"${srAttrs}>\n  <OmamoriTitle title={<>${titleText}</>} />\n  <div className="flex-1 w-full min-w-0 flex flex-col gap-6">`;
        }
      );
      
      // 3. Replace the last </ScrollReveal>
      // We can find the last index of </ScrollReveal> and replace it.
      const lastIndex = newContent.lastIndexOf('</ScrollReveal>');
      if (lastIndex !== -1) {
        newContent = newContent.substring(0, lastIndex) + '</div>\n</ScrollReveal>' + newContent.substring(lastIndex + '</ScrollReveal>'.length);
      }
      
      return match.replace(content, newContent);
    }
    
    return match;
  }
);

fs.writeFileSync('app/SakuraHomeClient.tsx', code);
console.log('Refactored successfully and perfectly!');
