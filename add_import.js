const fs = require('fs');
let code = fs.readFileSync('app/SakuraHomeClient.tsx', 'utf-8');
if(!code.includes('import OmamoriTitle')) {
  code = code.replace('import TypewriterText from "@/components/TypewriterText";', 'import TypewriterText from "@/components/TypewriterText";\nimport OmamoriTitle from "@/components/OmamoriTitle";');
  fs.writeFileSync('app/SakuraHomeClient.tsx', code);
}
