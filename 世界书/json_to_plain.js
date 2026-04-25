const fs = require('fs');
const path = require('path');

const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';

function convertToPlainText(obj, prefix = '') {
  let result = [];
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      result.push(`${prefix}${key}: ${obj[key].join(', ')}`);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      // For top-level categories, maybe we can use brackets or just bold
      if (prefix === '') {
        const subResult = convertToPlainText(obj[key], '');
        // Join properties with comma to save space
        const joined = subResult.map(s => s.trim()).filter(s => s).join('; ');
        result.push(`【${key}】 ${joined}`);
      } else {
        const subResult = convertToPlainText(obj[key], '');
        const joined = subResult.map(s => s.trim()).filter(s => s).join(', ');
        result.push(`${prefix}${key}: ${joined}`);
      }
    } else {
      result.push(`${prefix}${key}: ${obj[key]}`);
    }
  }
  return result;
}

const fileToTest = 'char:佐伊.yaml';
const filePath = path.join(dir, fileToTest);
const content = fs.readFileSync(filePath, 'utf8');

try {
  const json = JSON.parse(content);
  const plainText = convertToPlainText(json).join('\n');
  console.log(plainText);
} catch (e) {
  console.log("Not a valid JSON:", e.message);
}
