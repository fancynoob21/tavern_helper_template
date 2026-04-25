import fs from 'fs';
import path from 'path';

const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';
const zzzPath = '/Users/ningqing/Documents/tavern_helper_template/世界书/zzz.yaml';

// === 1. 修正文件内容 ===

// fac:TOPS企业联盟 → fac:典范财团联合会
const topsContent = `典范财团联合会（The Outstanding Paragons，简称TOPS）是新艾利都最具财力和影响力的企业财团联盟，在城市运作的各个领域拥有极高的话语权。
已知成员企业：
玛瑟尔集团——发明邦布的企业，"挽昼"女士曾为其前CEO
高志集团（高志金融集团）——金融巨头，旗下拥有帝高音乐公司与星环电视塔
圣霖集团——主营食品和日用品
乔氏集团——掌握核心以太业务，有城建背景，与官方合作密切
三门集团——工业集团，旗下有三门建设、三门军工科技
锈崖公司
内部机构：
坎卜斯黑枝——TOPS内部规章管理与合规监管组织，负责清算违规成员
管理架构：
圆桌议事会治理，包含一位沉睡中的"头领"，以及由高志集团、锈崖公司和另一家未知企业组成的"三契"
前成员：
赋格
视像公司
`;
fs.writeFileSync(path.join(dir, 'fac:典范财团联合会.yaml'), topsContent, 'utf8');
if (fs.existsSync(path.join(dir, 'fac:TOPS企业联盟.yaml'))) {
  fs.unlinkSync(path.join(dir, 'fac:TOPS企业联盟.yaml'));
}
console.log('✅ fac:TOPS企业联盟 → fac:典范财团联合会');

// fac:三闸 → fac:三门集团
const sanmenContent = `三门集团是典范财团联合会（TOPS）成员，白祇重工的竞争对手。
注重以太技术研究的工业集团。
子公司：
三门建设——擅长紧急施工
三门军工科技——防卫军装备主要提供商
`;
fs.writeFileSync(path.join(dir, 'fac:三门集团.yaml'), sanmenContent, 'utf8');
if (fs.existsSync(path.join(dir, 'fac:三闸.yaml'))) {
  fs.unlinkSync(path.join(dir, 'fac:三闸.yaml'));
}
console.log('✅ fac:三闸 → fac:三门集团');

// fac:高瞻集团 → fac:高志集团
const gaozhiContent = `高志集团（高志金融集团）是典范财团联合会（TOPS）成员，金融巨头。
子公司：
高志金融
高志保险
帝高音乐公司——旗下娱乐/音乐厂牌
  -莫妮卡
  -欧典HAE
    -雅·星
    -约兰·德·温特（已故）——原属赋格，后转入欧典
`;
fs.writeFileSync(path.join(dir, 'fac:高志集团.yaml'), gaozhiContent, 'utf8');
if (fs.existsSync(path.join(dir, 'fac:高瞻集团.yaml'))) {
  fs.unlinkSync(path.join(dir, 'fac:高瞻集团.yaml'));
}
console.log('✅ fac:高瞻集团 → fac:高志集团');

// === 2. 更新 zzz.yaml 引用 ===
let zzz = fs.readFileSync(zzzPath, 'utf8');

// 文件引用替换
const refReplacements = [
  ['ZZZ/fac:TOPS企业联盟', 'ZZZ/fac:典范财团联合会'],
  ['ZZZ/fac:三闸', 'ZZZ/fac:三门集团'],
  ['ZZZ/fac:高瞻集团', 'ZZZ/fac:高志集团'],
];

for (const [old, newRef] of refReplacements) {
  if (zzz.includes(old)) {
    zzz = zzz.split(old).join(newRef);
    console.log(`🔗 引用: ${old} → ${newRef}`);
  }
}

// 条目名替换
const nameReplacements = [
  ['名称: fac:TOPS企业联盟', '名称: fac:典范财团联合会'],
  ['名称: fac:三闸', '名称: fac:三门集团'],
  ['名称: fac:高瞻集团', '名称: fac:高志集团'],
];

for (const [old, newName] of nameReplacements) {
  if (zzz.includes(old)) {
    zzz = zzz.split(old).join(newName);
    console.log(`📛 条目名: ${old} → ${newName}`);
  }
}

// 关键字中的旧名也要加上新名
// 三闸→三门
zzz = zzz.replace(/(\s+- 三闸\n)/g, '$1        - 三门集团\n        - 三门\n');

fs.writeFileSync(zzzPath, zzz, 'utf8');

// === 3. 全局搜索替换所有yaml文件中的旧翻译 ===
const allFiles = fs.readdirSync(dir).filter(f => f.endsWith('.yaml'));
let globalFixed = 0;

const globalReplacements = [
  ['TOPS企业联盟', '典范财团联合会（TOPS）'],
  ['卓越典范企业联盟', '典范财团联合会'],
  ['三闸公司', '三门集团'],
  ['三闸工业', '三门建设'],  
  ['三闸军工科技', '三门军工科技'],
  ['三闸建设', '三门建设'],
  ['高瞻集团', '高志集团'],
  ['高瞻金融', '高志金融'],
  ['高瞻保险', '高志保险'],
  ['高瞻娱乐', '帝高音乐公司'],
  ['圣·琳', '圣霖集团'],
  ['乔纳森财团', '乔氏集团'],
  ['铁锈峭壁', '锈崖公司'],
  ['欧迪姆HAE', '欧典HAE'],
];

for (const file of allFiles) {
  // 跳过刚创建的新文件
  if (file === 'fac:典范财团联合会.yaml' || file === 'fac:三门集团.yaml' || file === 'fac:高志集团.yaml') continue;
  
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  for (const [old, newText] of globalReplacements) {
    content = content.split(old).join(newText);
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    globalFixed++;
    console.log(`📝 ${file}: 翻译已修正`);
  }
}

console.log(`\n===== 完成 =====`);
console.log(`全局翻译修正: ${globalFixed} 个文件`);
