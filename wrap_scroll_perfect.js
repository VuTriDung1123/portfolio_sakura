const fs = require('fs');
let code = fs.readFileSync('app/SakuraHomeClient.tsx', 'utf-8');

if (!code.includes('import JapaneseScroll')) {
  code = code.replace('import SakuraNav', 'import JapaneseScroll from "@/components/JapaneseScroll";\nimport SakuraNav');
}

function wrapSection(id) {
  const sectionRegex = new RegExp(`(<section[^>]*id="${id}"[^>]*>)([\\s\\S]*?)(<\\/section>)`, 'g');
  code = code.replace(sectionRegex, (match, before, content, after) => {
    if (content.includes('<JapaneseScroll>')) return match;

    // We want to replace the first <ScrollReveal> with <ScrollReveal><JapaneseScroll>
    // And the last </ScrollReveal> with </JapaneseScroll></ScrollReveal>
    
    // Find first <ScrollReveal>
    let newContent = content.replace(/<ScrollReveal([^>]*)>/, '<ScrollReveal$1>\n<JapaneseScroll>');
    
    // Find last </ScrollReveal>
    const lastIndex = newContent.lastIndexOf('</ScrollReveal>');
    if (lastIndex !== -1) {
      newContent = newContent.substring(0, lastIndex) + '</JapaneseScroll>\n</ScrollReveal>' + newContent.substring(lastIndex + '</ScrollReveal>'.length);
    }
    
    return before + newContent + after;
  });
}

['about', 'career', 'certificates', 'experience', 'profile', 'achievements', 'contact'].forEach(wrapSection);

fs.writeFileSync('app/SakuraHomeClient.tsx', code);
console.log('Wrapped sections perfectly!');
