const fs = require('fs');
let content = fs.readFileSync('src/components/Features.tsx', 'utf8');
content = content.replace('variants={cardVariants}', 'variants={cardVariants as any}');
content = content.replace('variants={lineVariants}', 'variants={lineVariants as any}');
fs.writeFileSync('src/components/Features.tsx', content);
