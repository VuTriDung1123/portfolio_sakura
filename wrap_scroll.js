const fs = require('fs');
let code = fs.readFileSync('app/SakuraHomeClient.tsx', 'utf-8');

if (!code.includes('import JapaneseScroll')) {
  code = code.replace('import SakuraNav', 'import JapaneseScroll from "@/components/JapaneseScroll";\nimport SakuraNav');
}

function wrapSection(id) {
  const regex = new RegExp(`(<section[^>]*id="${id}"[^>]*>[\\s\\S]*?<ScrollReveal[^>]*>)([\\s\\S]*?)(<\\/ScrollReveal>[\\s\\S]*?<\\/section>)`);
  code = code.replace(regex, (match, before, content, after) => {
    // If it's already wrapped, skip
    if (content.includes('<JapaneseScroll>')) return match;

    // The content includes the <h2> and the wrapper div (if any).
    // We want to put <JapaneseScroll> wrapping everything. 
    // Wait, if <h2> is INSIDE <JapaneseScroll>, the Omamori horizontal title will be inside the paper scroll! 
    // That actually looks VERY good! A paper scroll with a title amulet on top of it.
    // So let's just wrap the entire `content` with <JapaneseScroll>!
    // But wait, `contact` section has a `<div style={{textAlign: "center"...}}>` wrapping everything.
    // That's fine, JapaneseScroll will just wrap that div!
    
    return `${before}\n<JapaneseScroll>\n${content}\n</JapaneseScroll>\n${after}`;
  });
}

['about', 'career', 'certificates', 'experience', 'profile', 'achievements', 'contact'].forEach(wrapSection);

fs.writeFileSync('app/SakuraHomeClient.tsx', code);
console.log('Wrapped sections successfully!');
