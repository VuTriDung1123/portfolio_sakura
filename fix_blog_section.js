const fs = require('fs');

let code = fs.readFileSync('app/SakuraHomeClient.tsx', 'utf-8');

// The blog section has:
/*
                    <h2
                      className="section-title"
                      style={{ marginBottom: 0, width: "auto" }}
                    >
                      <span>
                        ✿ 09.{" "}
                        {currentLang === "vi"
                          ? "BLOG & CÂU CHUYỆN"
                          : currentLang === "jp"
                            ? "ブログ・物語"
                            : "BLOG & STORIES"}{" "}
                        ✿
                      </span>
                    </h2>
*/

// Let's replace the specific blog section h2 with OmamoriTitle and also add the missing <div> opening tag.
// Because refactor_wrap.js already added </div> before </ScrollReveal>, we just need to replace the h2 and add the opening div.

code = code.replace(
  /<h2[\s\S]*?className="section-title"[\s\S]*?style={{ marginBottom: 0, width: "auto" }}[\s\S]*?>\s*<span>([\s\S]*?)<\/span>\s*<\/h2>/,
  (match, p1) => {
    let inner = p1.replace(/\$\{/g, '{');
    return `<OmamoriTitle title={<>${inner}</>} />\n<div className="flex-1 w-full min-w-0 flex flex-col gap-6">`;
  }
);

// Are there any other stray `</div>`?
// Let's check if the number of <OmamoriTitle matches the number of </div>\n</ScrollReveal>
const omamoriCount = (code.match(/<OmamoriTitle/g) || []).length;
const divCount = (code.match(/<\/div>\n<\/ScrollReveal>/g) || []).length;
console.log(`OmamoriTitle count: ${omamoriCount}`);
console.log(`Stray div count: ${divCount}`);

fs.writeFileSync('app/SakuraHomeClient.tsx', code);
