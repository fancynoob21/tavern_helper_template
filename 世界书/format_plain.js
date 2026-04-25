const fs = require('fs');
const path = require('path');

const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';
const files = fs.readdirSync(dir);
let count = 0;

for (const file of files) {
  if (file.startsWith('char:')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Check if the file contains our converted dense format
    if (content.includes('【基本信息】') || content.includes('【外貌特征】') || content.includes('【alias】') || content.includes('【')) {
      // Add a newline after the category headers like 【基本信息】
      content = content.replace(/【(.*?)】/g, '【$1】\n');
      
      // Replace the semicolon + space separator with a newline
      content = content.replace(/; /g, '\n');
      
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        count++;
      }
    }
  }
}

console.log(`Successfully formatted ${count} character files with line breaks.`);
