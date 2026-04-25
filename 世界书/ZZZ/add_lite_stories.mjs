import fs from 'fs';
import path from 'path';

const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';
const zzzPath = '/Users/ningqing/Documents/tavern_helper_template/世界书/zzz.yaml';

// Build character name list from char: files
const charFiles = fs.readdirSync(dir).filter(f => f.startsWith('char:') && f.endsWith('.yaml'));
const charNames = charFiles.map(f => f.replace('char:', '').replace('.yaml', ''));
const npcFiles = fs.readdirSync(dir).filter(f => f.startsWith('npc:') && f.endsWith('.yaml'));
const npcNames = npcFiles.map(f => f.replace('npc:', '').replace('.yaml', '').replace(/_/g, '/'));
const allNames = [...charNames, ...npcNames];

// Get all lite story files
const liteFiles = fs.readdirSync(dir)
  .filter(f => f.startsWith('lite story: ') && f.endsWith('.yaml'))
  .sort();

// Check which lite stories already exist in zzz.yaml
let zzz = fs.readFileSync(zzzPath, 'utf8');

let entries = [];
let addedCount = 0;
let skippedCount = 0;

for (const file of liteFiles) {
  const storyName = file.replace('lite story: ', '').replace('.yaml', '');
  const entryName = `lite story: ${storyName}`;
  
  // Skip if already in zzz.yaml
  if (zzz.includes(`名称: "${entryName}"`) || zzz.includes(`名称: ${entryName}`)) {
    skippedCount++;
    continue;
  }
  
  // Read corresponding full story to extract characters
  const fullStoryPath = path.join(dir, `story: ${storyName}.yaml`);
  let charKeywords = [];
  if (fs.existsSync(fullStoryPath)) {
    const fullContent = fs.readFileSync(fullStoryPath, 'utf8');
    for (const name of allNames) {
      if (name.length < 2) continue;
      if (name.includes('_')) {
        const parts = name.split('_');
        if (parts.some(p => p.length >= 2 && fullContent.includes(p))) {
          charKeywords.push(name.replace(/_/g, ','));
        }
      } else {
        if (fullContent.includes(name)) {
          charKeywords.push(name);
        }
      }
    }
  }
  
  // Build keywords: story name + character names
  const keywords = [storyName, ...charKeywords];
  // Deduplicate
  const uniqueKeywords = [...new Set(keywords)];
  
  // Build entry YAML
  let entry = `\n  - 名称: "lite story: ${storyName}"\n`;
  entry += `    启用: false\n`;
  entry += `    激活策略:\n`;
  entry += `      类型: 绿灯\n`;
  entry += `      关键字:\n`;
  for (const kw of uniqueKeywords) {
    entry += `        - ${kw}\n`;
  }
  entry += `    插入位置:\n`;
  entry += `      类型: 角色定义之后\n`;
  entry += `      顺序: 100\n`;
  entry += `    激活概率: 100\n`;
  entry += `    递归:\n`;
  entry += `      不可被其他条目激活: true\n`;
  entry += `      不可激活其他条目: true\n`;
  entry += `    文件: "ZZZ/lite story: ${storyName}"\n`;
  
  entries.push(entry);
  addedCount++;
}

if (entries.length > 0) {
  // Find the last entry before the final system entries ([InitVar], [mvu_update])
  // Insert before [InitVar]
  const insertPoint = zzz.lastIndexOf('  - 名称: "[InitVar]"');
  if (insertPoint !== -1) {
    zzz = zzz.substring(0, insertPoint) + entries.join('') + '\n' + zzz.substring(insertPoint);
  } else {
    // Fallback: append before last line
    zzz += entries.join('');
  }
  
  fs.writeFileSync(zzzPath, zzz, 'utf8');
}

console.log(`完成！添加了 ${addedCount} 个 lite story 条目到 zzz.yaml。`);
if (skippedCount > 0) console.log(`跳过 ${skippedCount} 个已存在条目。`);
