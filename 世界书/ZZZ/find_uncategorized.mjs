import fs from 'fs';

const zzzPath = '/Users/ningqing/Documents/tavern_helper_template/世界书/zzz.yaml';
const content = fs.readFileSync(zzzPath, 'utf8');
const lines = content.split('\n');

const prefixes = ['char:', 'story:', 'fac:', 'loc:', 'npc:', 'lore:', 'mob:', 'item:', '[mvu_update]', '[InitVar]'];
const skipNames = ['世界观', '主要势力', '写作风格', '主要地点', '新艾利都', '空洞深潜系统'];

let uncategorized = [];

for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^\s+-\s+名称:\s*(.*)/);
  if (!m) continue;
  const name = m[1].replace(/^"|"$/g, '').trim();
  
  if (prefixes.some(p => name.startsWith(p))) continue;
  if (skipNames.some(s => name.startsWith(s))) continue;
  
  // Check if it has 内容: (inline) or 文件: 
  let hasInline = false;
  let hasFile = false;
  for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
    if (lines[j].trim().startsWith('内容:')) hasInline = true;
    if (lines[j].trim().startsWith('文件:')) hasFile = true;
    if (lines[j].match(/^\s+-\s+名称:/)) break;
  }
  
  uncategorized.push({ line: i + 1, name, type: hasInline ? '内联' : hasFile ? '文件' : '?' });
}

console.log(`未分类条目: ${uncategorized.length} 个\n`);
uncategorized.forEach(u => {
  console.log(`行${u.line}: "${u.name}" [${u.type}]`);
});
