const fs = require('fs');
const path = require('path');

const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';
const statusPath = path.join(dir, '时间剧情状态表.yaml');
const zzzPath = '/Users/ningqing/Documents/tavern_helper_template/世界书/zzz.yaml';

const statusContent = fs.readFileSync(statusPath, 'utf8');
let zzzContent = fs.readFileSync(zzzPath, 'utf8');

// Parse the story list
const lines = statusContent.split('\n');
let inList = false;
const stories = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed === '<剧情列表>') {
    inList = true;
    continue;
  }
  if (trimmed === '</剧情列表>') {
    inList = false;
    break;
  }
  if (inList && trimmed.length > 0) {
    stories.push(trimmed);
  }
}

const files = fs.readdirSync(dir);
const renamedLog = [];

for (const story of stories) {
  // Find the file that matches the story name
  let targetFile = null;
  for (const file of files) {
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    if (baseName === story || baseName === `story: ${story}` || baseName === `story:${story}`) {
      targetFile = file;
      break;
    }
  }
  
  if (!targetFile) {
    console.warn(`未找到剧情文件: ${story}`);
    continue;
  }
  
  const ext = path.extname(targetFile);
  const baseName = path.basename(targetFile, ext);
  
  if (baseName === `story: ${story}`) {
    continue; // already renamed
  }
  
  const newFileName = `story: ${story}${ext}`;
  fs.renameSync(path.join(dir, targetFile), path.join(dir, newFileName));
  renamedLog.push(`${targetFile} -> ${newFileName}`);
  
  // Replace in zzz.yaml
  const safeStory = story.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regexName1 = new RegExp(`名称: (?:story:\\s*)?${safeStory}\\s*$`, 'gm');
  const regexFile1 = new RegExp(`文件: ZZZ\/(?:story:\\s*)?${safeStory}\\s*$`, 'gm');
  
  zzzContent = zzzContent.replace(regexName1, `名称: story: ${story}`);
  zzzContent = zzzContent.replace(regexFile1, `文件: ZZZ/story: ${story}`);
}

fs.writeFileSync(zzzPath, zzzContent, 'utf8');
console.log(`成功重命名 ${renamedLog.length} 个剧情条目。`);
if (renamedLog.length > 0) {
  console.log(renamedLog.join('\n'));
}
