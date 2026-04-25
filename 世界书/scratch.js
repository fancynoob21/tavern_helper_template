const fs = require('fs');
const path = require('path');
const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';
const files = fs.readdirSync(dir);
const charFiles = [];
for (const file of files) {
  if (fs.statSync(path.join(dir, file)).isDirectory()) continue;
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  let isChar = false;
  if (file.startsWith('角色：') || file.startsWith('角色_') || file.startsWith('char:')) {
    isChar = true;
  } else if (content.includes('"基本信息"') || content.includes('基本信息:') || content.includes('姓名:') || content.includes('"姓名"')) {
    isChar = true;
  }
  
  // false positives check
  if (file.includes('模板') || file.includes('规则')) isChar = false;
  
  if (isChar) {
    charFiles.push(file);
  }
}
console.log(JSON.stringify(charFiles, null, 2));
