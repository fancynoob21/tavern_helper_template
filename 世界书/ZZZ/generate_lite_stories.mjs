import fs from 'fs';
import path from 'path';

const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';

// Get all story files
const storyFiles = fs.readdirSync(dir)
  .filter(f => f.startsWith('story: ') && f.endsWith('.yaml'))
  .sort();

let createdCount = 0;
let skippedCount = 0;

for (const file of storyFiles) {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const storyName = file.replace('story: ', '').replace('.yaml', '');
  const liteFile = `lite story: ${storyName}.yaml`;
  const litePath = path.join(dir, liteFile);
  
  // Skip if lite already exists
  if (fs.existsSync(litePath)) {
    skippedCount++;
    continue;
  }
  
  // Extract 详细剧情
  let summary = '';
  const summaryMatch = content.match(/详细剧情:\s*"([^"]+)"/s);
  if (summaryMatch) {
    summary = summaryMatch[1].trim();
  } else {
    // Try without quotes
    const altMatch = content.match(/详细剧情:\s*(.+?)(?:\n[^\s]|\n章节)/s);
    if (altMatch) {
      summary = altMatch[1].trim().replace(/^"|"$/g, '');
    }
  }
  
  // Extract 章节标题
  let title = storyName;
  const titleMatch = content.match(/章节标题:\s*"?([^"\n]+)"?/);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }
  
  // Extract event list
  const events = [];
  const eventListMatch = content.match(/章节事件列表:\s*\n((?:\s*-\s*"[^"]+"\s*\n?)+)/);
  if (eventListMatch) {
    const eventLines = eventListMatch[1].matchAll(/-\s*"([^"]+)"/g);
    for (const m of eventLines) {
      // Extract just the event name, remove "事件X: " prefix
      const evtName = m[1].replace(/^事件[一二三四五六七八九十\d]+:\s*/, '');
      events.push(evtName);
    }
  }
  
  // Extract 章节终止条件
  let endCondition = '';
  const endMatch = content.match(/章节终止条件:\s*"([^"]+)"/);
  if (endMatch) {
    endCondition = endMatch[1].trim();
  }
  
  // Build lite version
  let lite = `<章节剧情概要>\n`;
  lite += `章节标题: "${title}"\n`;
  lite += `剧情概要: "${summary}"\n`;
  
  if (events.length > 0) {
    lite += `关键事件:\n`;
    for (const evt of events) {
      lite += `- "${evt}"\n`;
    }
  }
  
  if (endCondition) {
    lite += `章节终止条件: "${endCondition}"\n`;
  }
  
  lite += `</章节剧情概要>\n`;
  
  fs.writeFileSync(litePath, lite, 'utf8');
  createdCount++;
  console.log(`✅ ${liteFile}`);
}

console.log(`\n完成！创建了 ${createdCount} 个 lite story 文件。`);
if (skippedCount > 0) {
  console.log(`跳过 ${skippedCount} 个已存在文件。`);
}
