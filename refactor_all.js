const fs = require('fs');
let code = fs.readFileSync('app/SakuraHomeClient.tsx', 'utf-8');

// Ensure OmamoriTitle is imported
if (!code.includes('import OmamoriTitle')) {
  code = code.replace('import BlogCarousel from "@/components/BlogCarousel";', 'import BlogCarousel from "@/components/BlogCarousel";\nimport OmamoriTitle from "@/components/OmamoriTitle";');
}

// 1. Process each section individually to avoid cross-section nesting issues.
code = code.replace(
  /<section[\s\S]*?id="([^"]+)"[\s\S]*?>([\s\S]*?)<\/section>/g,
  (match, id, content) => {
    if (id === 'home') return match; // skip home

    // Find the h2 title and extract its text
    let titleText = "";
    // Match h2 containing section-title
    const h2Regex = /<h2[^>]*className="section-title"[^>]*>([\s\S]*?)<\/h2>/;
    const h2Match = content.match(h2Regex);
    
    if (h2Match) {
      let spanContent = h2Match[1];
      // extract text from span
      const spanRegex = /<span[^>]*>([\s\S]*?)<\/span>/;
      const spanMatch = spanContent.match(spanRegex);
      if (spanMatch) {
         titleText = spanMatch[1].trim();
      } else {
         titleText = spanContent.trim();
      }
      
      // Fix string interpolation for titleText
      titleText = titleText.replace(/\$\{/g, '{');
      
      // Remove the h2 from the content
      let newContent = content.replace(h2Regex, "");
      
      // Now we want to wrap the remaining content inside <ScrollReveal> with a div,
      // and put OmamoriTitle as the first child of <ScrollReveal>
      // The ScrollReveal might already have className if we modified it earlier, but we restored it, so it's just <ScrollReveal>
      // Wait, let's find <ScrollReveal> and </ScrollReveal> in newContent
      
      newContent = newContent.replace(
        /<ScrollReveal([^>]*)>([\s\S]*?)<\/ScrollReveal>/,
        (srMatch, srAttrs, srContent) => {
          return `<ScrollReveal className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full"${srAttrs}>\n  <OmamoriTitle title={<>${titleText}</>} />\n  <div className="flex-1 w-full min-w-0 flex flex-col gap-6">\n${srContent}\n  </div>\n</ScrollReveal>`;
        }
      );
      
      return match.replace(content, newContent);
    }
    
    return match;
  }
);

fs.writeFileSync('app/SakuraHomeClient.tsx', code);
console.log('Refactored successfully!');
