const fs = require('fs');
const zzzPath = '/Users/ningqing/Documents/tavern_helper_template/世界书/zzz.yaml';
let zzzContent = fs.readFileSync(zzzPath, 'utf8');

// Replace unquoted `名称: story: ...` with `名称: "story: ..."`
zzzContent = zzzContent.replace(/^(\s*-\s*名称:\s*)(story:\s*.*)$/gm, '$1"$2"');

// Replace unquoted `文件: ZZZ/story: ...` with `文件: "ZZZ/story: ..."`
zzzContent = zzzContent.replace(/^(\s*文件:\s*)(ZZZ\/story:\s*.*)$/gm, '$1"$2"');

fs.writeFileSync(zzzPath, zzzContent, 'utf8');
console.log('Fixed YAML syntax errors in zzz.yaml');
