import fs from 'fs';
import path from 'path';

const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';

// Build character name list from char: files
const charFiles = fs.readdirSync(dir).filter(f => f.startsWith('char:') && f.endsWith('.yaml'));
const charNames = charFiles.map(f => f.replace('char:', '').replace('.yaml', ''));

// Also build NPC name list
const npcFiles = fs.readdirSync(dir).filter(f => f.startsWith('npc:') && f.endsWith('.yaml'));
const npcNames = npcFiles.map(f => f.replace('npc:', '').replace('.yaml', '').replace(/_/g, '/'));

// All searchable names (chars first, then NPCs)
const allNames = [...charNames, ...npcNames];

// Get all story files
const storyFiles = fs.readdirSync(dir).filter(f => f.startsWith('story:') && f.endsWith('.yaml')).sort();

const results = {};

for (const file of storyFiles) {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const storyName = file.replace('story: ', '').replace('.yaml', '');
  
  const found = [];
  for (const name of allNames) {
    // Skip very short names that would cause false positives
    if (name.length < 2) continue;
    // Handle multi-part names (e.g. 露比_琳_梦奈)
    const searchName = name.replace(/_/g, '|');
    const parts = searchName.split('|');
    
    // For single names, just check if contained
    if (parts.length === 1) {
      if (content.includes(name)) {
        const isChar = charNames.includes(name);
        found.push({ name, type: isChar ? 'char' : 'npc' });
      }
    } else {
      // Multi-part: check if any part matches
      for (const part of parts) {
        if (part.length >= 2 && content.includes(part)) {
          const isChar = charNames.includes(name);
          found.push({ name, type: isChar ? 'char' : 'npc' });
          break;
        }
      }
    }
  }
  
  results[storyName] = found;
}

// Output as markdown-style for easy reading
for (const [story, chars] of Object.entries(results)) {
  const charList = chars.filter(c => c.type === 'char').map(c => c.name);
  const npcList = chars.filter(c => c.type === 'npc').map(c => c.name);
  const allList = [...charList, ...npcList.map(n => `(${n})`)];
  console.log(`| ${story} | ${allList.join(', ') || '无特定角色'} |`);
}
