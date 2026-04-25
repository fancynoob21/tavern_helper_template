const fs = require('fs');
const path = require('path');
const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';
const files = fs.readdirSync(dir);

for (const file of files) {
  if (file.startsWith('char:')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix `"name": "xxx", "yyy"`
    content = content.replace(/"name":\s*"([^"]+)",\s*"([^"]+)"(?:,\s*"([^"]+)")?(?:,\s*"([^"]+)")?/g, '"name": ["$1", "$2", "$3", "$4"]');
    content = content.replace(/,\s*undefined/g, '');
    content = content.replace(/,\s*""/g, '');
    content = content.replace(/\[([^\]]+)\]/g, (match, p1) => {
      return '[' + p1.replace(/,\s*$/, '') + ']';
    });

    // Fix ` \`}, `
    content = content.replace(/`\},/g, '},');
    content = content.replace(/`\s*}/g, ' }');
    
    // Fix unquoted keys in yaml that are partially json
    // Not easy to do blindly, but let's try the script again later
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Auto-fixed some syntax in ${file}`);
    }
  }
}
