const fs = require('fs');
let content = fs.readFileSync('src/components/Features.tsx', 'utf8');
content = content.replace('const cardVariants = {', 'const cardVariants: any = {');
content = content.replace('const lineVariants = {', 'const lineVariants: any = {');
fs.writeFileSync('src/components/Features.tsx', content);
