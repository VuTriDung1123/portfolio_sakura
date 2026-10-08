const fs = require('fs');
const code = fs.readFileSync('app/SakuraHomeClient.tsx', 'utf-8');

const matches = code.matchAll(/<section[\s\S]*?id="([^"]+)"[\s\S]*?>([\s\S]*?)<\/section>/g);
for (const match of matches) {
  const id = match[1];
  const content = match[2];
  
  // Extract the first few tags to see structure
  const tags = content.match(/<[A-Za-z0-9]+[^>]*>/g) || [];
  console.log(`Section: ${id}`);
  console.log(`Structure: ${tags.slice(0, 4).join(' ')}`);
}
