const fs = require('fs');

let code = fs.readFileSync('app/SakuraHomeClient.tsx', 'utf-8');

// Wrap everything after OmamoriTitle inside a div that takes remaining flex space
code = code.replace(
  /(<OmamoriTitle[^>]*\/>)/g,
  '$1\n<div className="flex-1 w-full min-w-0 flex flex-col gap-6">'
);

// Close the div before the section ends
code = code.replace(
  /(<\/ScrollReveal>\s*<\/section>)/g,
  '</div>\n$1'
);

fs.writeFileSync('app/SakuraHomeClient.tsx', code);
console.log('Added flex wrappers!');
