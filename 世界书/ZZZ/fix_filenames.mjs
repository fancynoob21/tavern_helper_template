import fs from 'fs';
import path from 'path';
import { Converter } from 'opencc-js';

const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';
const converter = Converter({ from: 'tw', to: 'cn' });

// Get all non-char yaml/txt files
const allFiles = fs.readdirSync(dir).filter(f => 
  !f.startsWith('char:') && 
  !f.endsWith('.mjs') && !f.endsWith('.js') && !f.endsWith('.json') && !f.endsWith('.md') &&
  !fs.statSync(path.join(dir, f)).isDirectory()
);

let renamedCount = 0;

for (const file of allFiles) {
  const simplified = converter(file);
  if (simplified !== file) {
    const oldPath = path.join(dir, file);
    const newPath = path.join(dir, simplified);
    
    if (fs.existsSync(newPath)) {
      console.log(`⚠️  ${simplified} 已存在，跳过 ${file}`);
      continue;
    }
    
    fs.renameSync(oldPath, newPath);
    renamedCount++;
    console.log(`✅ ${file} → ${simplified}`);
  }
}

console.log(`\n完成！重命名了 ${renamedCount} 个文件。`);
