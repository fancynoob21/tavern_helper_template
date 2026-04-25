import fs from 'fs';
import path from 'path';

const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';
const liteFiles = fs.readdirSync(dir).filter(f => f.startsWith('lite story: ') && f.endsWith('.yaml'));

let fixedCount = 0;

for (const file of liteFiles) {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract title and summary only
  const titleMatch = content.match(/章节标题:\s*"([^"]+)"/);
  const summaryMatch = content.match(/剧情概要:\s*"([^"]+)"/s);
  
  const title = titleMatch ? titleMatch[1] : file.replace('lite story: ', '').replace('.yaml', '');
  const summary = summaryMatch ? summaryMatch[1] : '';
  
  const lite = `章节标题: "${title}"\n剧情概要: "${summary}"\n`;
  
  fs.writeFileSync(filePath, lite, 'utf8');
  fixedCount++;
}

console.log(`完成！精简了 ${fixedCount} 个 lite story 文件。`);
