const fs = require('fs');
const path = require('path');
const YAML = require('yaml'); 

const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';
const files = fs.readdirSync(dir);

function compact(obj) {
  if (Array.isArray(obj)) return obj.join('、');
  if (typeof obj !== 'object' || obj === null) return String(obj);
  
  const parts = [];
  for (const k in obj) {
    if (typeof obj[k] === 'object' && obj[k] !== null) {
       parts.push(`${k}:{${compact(obj[k])}}`);
    } else {
       parts.push(`${k}:${obj[k]}`);
    }
  }
  return parts.join(', ');
}

function convertToPlainText(obj) {
  let result = [];
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) continue;
    if (typeof obj[key] === 'object') {
      if (Array.isArray(obj[key])) {
        result.push(`【${key}】${obj[key].join(', ')}`);
      } else {
        const subItems = [];
        for (const subKey in obj[key]) {
          const val = obj[key][subKey];
          if (Array.isArray(val)) {
            subItems.push(`${subKey}:${val.join('、')}`);
          } else if (typeof val === 'object' && val !== null) {
            subItems.push(`${subKey}:${compact(val)}`);
          } else {
            subItems.push(`${subKey}:${val}`);
          }
        }
        result.push(`【${key}】${subItems.join('; ')}`);
      }
    } else {
      result.push(`${key}: ${obj[key]}`);
    }
  }
  return result.join('\n');
}

let count = 0;
for (const file of files) {
  if (file.startsWith('char:')) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    try {
      const parsed = YAML.parse(content);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const plainText = convertToPlainText(parsed);
        if (plainText.length > 0 && plainText !== content) {
          fs.writeFileSync(filePath, plainText, 'utf8');
          count++;
        }
      }
    } catch (e) {
      console.log(`Failed to parse ${file}: ${e.message}`);
    }
  }
}
console.log(`Converted ${count} char files to plain text.`);
