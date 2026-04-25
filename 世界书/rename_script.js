const fs = require('fs');
const path = require('path');

const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';
const files = fs.readdirSync(dir);
const zzzPath = '/Users/ningqing/Documents/tavern_helper_template/世界书/zzz.yaml';
let zzzContent = fs.readFileSync(zzzPath, 'utf8');

const renamedLog = [];

for (const file of files) {
  if (fs.statSync(path.join(dir, file)).isDirectory()) continue;
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  let isChar = false;
  if (file.startsWith('角色：') || file.startsWith('角色_') || file.startsWith('char:')) {
    isChar = true;
  } else if (
    content.includes('"基本信息"') || 
    content.includes('基本信息:') || 
    content.includes('姓名:') || 
    content.includes('"姓名"') ||
    (content.includes('"name"') && content.includes('"gender"')) ||
    (content.includes('"name"') && content.includes('"race"')) ||
    content.includes('"性别"')
  ) {
    isChar = true;
  }
  
  if (file.includes('模板') || file.includes('规则') || file.includes('Format Explanation')) isChar = false;
  
  if (isChar) {
    let baseName = file.replace(/\.(yaml|txt|json)$/, '');
    if (baseName.startsWith('角色：')) baseName = baseName.replace('角色：', '');
    if (baseName.startsWith('角色_')) baseName = baseName.replace(/角色_\s*/, '');
    if (baseName.startsWith('char:')) continue;
    
    const ext = path.extname(file);
    const newFileName = `char:${baseName}${ext}`;
    
    fs.renameSync(path.join(dir, file), path.join(dir, newFileName));
    renamedLog.push(`${file} -> ${newFileName}`);
    
    const oldBaseName = file.replace(/\.(yaml|txt|json)$/, '');
    // Escape regex characters
    const safeOldName = oldBaseName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    const regexName1 = new RegExp(`名称: ${safeOldName}\\s*$`, 'gm');
    const regexFile1 = new RegExp(`文件: ZZZ\/${safeOldName}\\s*$`, 'gm');
    
    zzzContent = zzzContent.replace(regexName1, `名称: char:${baseName}`);
    zzzContent = zzzContent.replace(regexFile1, `文件: ZZZ/char:${baseName}`);
  }
}

fs.writeFileSync(zzzPath, zzzContent, 'utf8');
console.log(`Renamed ${renamedLog.length} characters.`);
console.log(renamedLog.join('\n'));
