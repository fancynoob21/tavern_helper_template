const fs = require('fs');
const zzzPath = '/Users/ningqing/Documents/tavern_helper_template/世界书/zzz.yaml';
let content = fs.readFileSync(zzzPath, 'utf8');

content = content.replace(/名称:\s*"角色:\s*(.*?)"/g, '名称: char:$1');
content = content.replace(/名称:\s*"角色_\s*(.*?)"/g, '名称: char:$1');
content = content.replace(/名称:\s*角色_\s*(.*)/g, '名称: char:$1');

fs.writeFileSync(zzzPath, content, 'utf8');
console.log("Fixed!");
