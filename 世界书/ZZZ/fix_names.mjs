import fs from 'fs';

const zzzPath = '/Users/ningqing/Documents/tavern_helper_template/世界书/zzz.yaml';
let content = fs.readFileSync(zzzPath, 'utf8');
let lines = content.split('\n');

let fixedCount = 0;
let currentName = '';
let currentNameLine = -1;
let currentNameIndent = '';

for (let i = 0; i < lines.length; i++) {
  let nameMatch = lines[i].match(/^(\s+-\s+名称:\s*)(.*)/);
  if (nameMatch) {
    currentNameIndent = nameMatch[1];
    currentName = nameMatch[2].replace(/^"|"$/g, '').trim();
    currentNameLine = i;
    continue;
  }
  
  let line = lines[i].trim();
  if (line.startsWith('文件: ZZZ/')) {
    let fileRef = line.replace('文件: ZZZ/', '');
    
    // Skip system files
    if (fileRef.startsWith('[')) continue;
    
    if (currentName !== fileRef && currentNameLine >= 0) {
      lines[currentNameLine] = `${currentNameIndent}${fileRef}`;
      fixedCount++;
      console.log(`✅ "${currentName}" → "${fileRef}"`);
    }
  }
}

fs.writeFileSync(zzzPath, lines.join('\n'), 'utf8');
console.log(`\n完成！修复了 ${fixedCount} 个条目名称。`);
