import fs from 'fs';
import path from 'path';

const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';
const zzzPath = '/Users/ningqing/Documents/tavern_helper_template/世界书/zzz.yaml';
let zzz = fs.readFileSync(zzzPath, 'utf8');

// === 1. 分类修正 (条目名+文件引用) ===
const reclassify = [
  { from: 'npc:饮茶仙', to: 'loc:饮茶仙' },
  { from: 'npc:钢牙', to: 'item:钢牙' },
  { from: 'npc:萝卜', to: 'lore:萝卜' },
  { from: 'npc:月亮', to: 'lore:月亮' },
  { from: 'npc:咚咚', to: 'lore:咚咚' },
  { from: 'npc:五月花', to: 'fac:五月花' },
];

for (const { from, to } of reclassify) {
  // Update entry name
  zzz = zzz.split(`名称: ${from}`).join(`名称: ${to}`);
  // Update file reference
  zzz = zzz.split(`文件: ZZZ/${from}`).join(`文件: ZZZ/${to}`);
  console.log(`✅ ${from} → ${to}`);
  
  // Rename file if exists
  const oldFile = path.join(dir, from + '.yaml');
  const newFile = path.join(dir, to + '.yaml');
  if (fs.existsSync(oldFile)) {
    fs.renameSync(oldFile, newFile);
    console.log(`  📁 文件已重命名`);
  }
}

// === 2. 删除 item:BBQ ===
const bbqPattern = /\n  - 名称: item:BBQ\n[\s\S]*?(?=\n  - 名称:|\n条目:|\Z)/;
const bbqMatch = zzz.match(bbqPattern);
if (bbqMatch) {
  zzz = zzz.replace(bbqMatch[0], '\n');
  console.log('🗑️  删除 item:BBQ');
}

fs.writeFileSync(zzzPath, zzz, 'utf8');
console.log('\n完成！');
