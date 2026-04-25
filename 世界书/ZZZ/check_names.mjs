import fs from 'fs';

const zzzPath = '/Users/ningqing/Documents/tavern_helper_template/世界书/zzz.yaml';
let content = fs.readFileSync(zzzPath, 'utf8');
let lines = content.split('\n');

let mismatches = [];
let currentName = '';
let currentNameLine = -1;

for (let i = 0; i < lines.length; i++) {
  let nameMatch = lines[i].match(/^\s+-\s+名称:\s*(.*)/);
  if (nameMatch) {
    currentName = nameMatch[1].replace(/^"|"$/g, '').trim();
    currentNameLine = i;
    continue;
  }
  
  let line = lines[i].trim();
  // Check both 文件: and 内容: entries
  if (line.startsWith('文件: ZZZ/')) {
    let fileRef = line.replace('文件: ZZZ/', '');
    if (currentName !== fileRef) {
      mismatches.push({
        line: currentNameLine + 1,
        name: currentName,
        file: fileRef
      });
    }
  }
}

console.log(`=== 不匹配项 (${mismatches.length} 个) ===\n`);
mismatches.forEach(m => {
  console.log(`行${m.line}: "${m.name}" ≠ "${m.file}"`);
});
