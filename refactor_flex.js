const fs = require('fs');

let code = fs.readFileSync('app/SakuraHomeClient.tsx', 'utf-8');

// Replace all <ScrollReveal> inside <section> to have flex classes
// We can just replace <ScrollReveal> with <ScrollReveal className="flex flex-col lg:flex-row gap-10 items-start">
// But wait, there are other <ScrollReveal> elements inside the lists (like experience items or contact grid items)!
// We only want to replace the first <ScrollReveal> child of <section>.
// The safest way is to use a regex that matches <section...> \s* <ScrollReveal>
code = code.replace(
  /(<section[^>]*>\s*)<ScrollReveal>/g,
  '$1<ScrollReveal className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full">'
);

fs.writeFileSync('app/SakuraHomeClient.tsx', code);
console.log('Flex classes added to top-level ScrollReveal elements!');
