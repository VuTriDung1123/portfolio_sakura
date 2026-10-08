const fs = require('fs');

let code = fs.readFileSync('app/SakuraHomeClient.tsx', 'utf-8');

// The structure is currently:
// <ScrollReveal className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full">
//   <OmamoriTitle title={`...`} />
//   ... multiple elements ...
// </ScrollReveal>
// We want to wrap the multiple elements in a div.

// Using a slightly more robust regex or just manual replace
// Let's replace the opening and closing of OmamoriTitle
code = code.replace(
  /(<OmamoriTitle[^>]*\/>)([\s\S]*?)(<\/ScrollReveal>)/g,
  (match, p1, p2, p3) => {
    // p1 is OmamoriTitle
    // p2 is the content we want to wrap
    // p3 is </ScrollReveal>
    // However, wait! If there are nested ScrollReveals, this regex will stop at the FIRST </ScrollReveal>, 
    // which might be inside the content!
    // Example: Experience section has multiple ScrollReveals inside!
    return match; // We shouldn't do it blindly if there are nested tags.
  }
);
fs.writeFileSync('refactor_test.js', code);
console.log('Test done');
