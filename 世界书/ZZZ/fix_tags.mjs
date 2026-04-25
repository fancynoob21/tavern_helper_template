import fs from 'fs';
import path from 'path';

const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';
const charFiles = fs.readdirSync(dir).filter(f => f.startsWith('char:') && f.endsWith('.yaml'));
let fixedCount = 0;

for (const file of charFiles) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 找到 danbooru tag 行并替换下划线为空格
  const tagMatch = content.match(/^danbooru tag: (.+)$/m);
  if (tagMatch && tagMatch[1] !== '无') {
    const oldTag = tagMatch[1];
    const newTag = oldTag.replace(/_/g, ' ');
    if (oldTag !== newTag) {
      content = content.replace(`danbooru tag: ${oldTag}`, `danbooru tag: ${newTag}`);
      fs.writeFileSync(filePath, content, 'utf8');
      fixedCount++;
      console.log(`✅ ${file}: ${oldTag} → ${newTag}`);
    }
  }
}
console.log(`\n完成！修复了 ${fixedCount} 个 danbooru tag。`);
