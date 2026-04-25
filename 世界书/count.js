const fs = require('fs');
const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';
const files = fs.readdirSync(dir);
let count = 0;
for (const file of files) {
  if (file.startsWith('char:')) {
    const content = fs.readFileSync(dir + '/' + file, 'utf8');
    if (content.includes('【基本信息】') || content.includes('【外貌特征】') || content.includes('【alias】')) {
      count++;
    }
  }
}
console.log(count);
