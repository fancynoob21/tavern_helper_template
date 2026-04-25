const fs = require('fs');
const path = require('path');
const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';
const files = fs.readdirSync(dir);
let successCount = 0;
let failCount = 0;
for (const file of files) {
  if (file.startsWith('char:')) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    try {
      JSON.parse(content);
      successCount++;
    } catch (e) {
      console.log(`Failed to parse ${file}: ${e.message}`);
      failCount++;
    }
  }
}
console.log(`Success: ${successCount}, Fail: ${failCount}`);
