import fs from 'fs';

const zzzPath = '/Users/ningqing/Documents/tavern_helper_template/世界书/zzz.yaml';
let content = fs.readFileSync(zzzPath, 'utf8');

// === 分类映射 ===
const catMap = {
  // lore: 概念/种族/机制
  'lore:': [
    '代理人', '邦布', '邦布网络', '以骸', '法厄同', '绳网', '音擎', '希人',
    '空洞零号', '空洞猎人', '腐蚀', '空洞骑士', '密钥', '充能', '离子化',
    '牲鬼', '精灵', '安比的双子', '芭蕾双子', '旧文明', '蚀驭',
    '认知腐蚀综合症,CCS', '伴生空洞', '禁果测试', '罗塞塔数据',
    '猫形希人', '虎形希人', '犬形希人', '狼形希人', '鲨形希人', '鼠形希人',
    '恶魔', '辉瓷', '都市小姐', '驱动盘', '吸血鬼', '莱特过往',
    '闪电充能', '强攻', '集结徽章',
  ],
  // npc: 角色
  'npc:': [
    '卢克罗', '4412号', '丁尼', '妙妙警官', '米格尔·西尔弗', '瑞恩',
    '霍尔斯·贝洛伯格', '牧羊人', '邦布商人', '剑圣', '亚契', '法金汉佣兵团长',
    '研究员/蒙面学者', '投机者', '汉娜', '海蒂', '夏尔', '特拉维斯', '珊迪',
    '克拉拉', '百万', '管家', '安全', '塔利', '山狮', '莱莎奶奶', '欢欣',
    '卡斯帕', '妮雅', '罗兰', '奥菲莉亚', '卢修斯', '五月花',
    '约兰·德·温特', '雨果之母', '卡萝尔·阿娜', '六道·萨莉尔', '月亮',
    '阿朔', '叶士元', '不掩', '牛上尉', '阿釜', '泰瑞丝', '欢乐珍妮',
    '李宝荣', '草仔,木仔,砖仔', '咚咚', '铃塔与莉拉',
    '橙苏鲁', '锐笑', '柠檬侠', '亮先生', '埃斯梅小姐',
    '卡尔斯一家', '钢牙',
  ],
  // loc: 地点/商铺
  'loc:': [
    '咖啡馆：COFF CAFE', '面馆：瀑布汤', '报刊亭：嚎叫', '音像店：巴笛针',
    '街机厅：神指', '杂货铺：盒子银河', '便利店：141', '改装店：涡轮',
    '露珠园艺店', '笃逸理疗工作室', '比弗森美容沙龙', '墨提斯综合学校',
    '布兰特街工地', '空洞调查协会俱乐部', '克里特空洞', '利曼尼亚空洞',
    '白波医院', '帆布街', '鲁斯理工学院', '十四街', '余烬竞技场', '裂谷',
    '芝士极乐园,卡莎', '释诡斋', '平心堂', '德丰大押', 'BooBox', '好物铺',
    '金刚钻', '茸毛宠物店', '泅珑围', '幻海水族馆', '澄辉坪总览',
    '白星院/空洞', '理查德奶茶',
  ],
  // fac: 势力/组织
  'fac:': [
    '红牙帮', '玛瑟尔集团', '白星院', '渡鸦锁', '赫利俄斯机关',
    '辉瓷梅克斯', '强纳森联合', '新闻报', '利都通讯',
  ],
  // item: 物品/武器/道具
  'item:': [
    '邦布券', '星辉', '硝基燃料', '日燧石', '火花石', '邦布雕像',
    '抑制器K22', '特制三课警棍', '调焰器与摇焰器', '双刃复合弓：伏潮',
    '三拍律', '月辉绞索', '双子星', '仪羽伞', '青溟', '弗莱格桑',
    '虚影薙刀：宇漏月', '迷你货运卡车', '桶中鬼火', '波之冠',
    '胶片放映机', '自由游戏球', '列岛射击', '黑锚',
    '浮世·柚叶', '终末通告', '习作完美', 'BBQ',
  ],
  // mob: 怪物/敌人
  'mob:': [
    '冥宁芙．双子', '红摩库斯',
  ],
};

// 小活动/小游戏 → lore
const gameActivities = ['噢～甜心', '咖啡伴侣', '炽浪疾驰'];
catMap['lore:'].push(...gameActivities);

// Build reverse map
const nameToPrefix = {};
for (const [prefix, names] of Object.entries(catMap)) {
  for (const name of names) {
    nameToPrefix[name] = prefix;
  }
}

// Apply changes
let fixedCount = 0;
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^(\s+-\s+名称:\s*)(["']?)(.*?)\2\s*$/);
  if (!m) continue;
  
  const indent = m[1];
  const quote = m[2];
  const name = m[3];
  
  const prefix = nameToPrefix[name];
  if (prefix) {
    const newName = prefix + name;
    lines[i] = `${indent}${newName}`;
    fixedCount++;
    console.log(`✅ "${name}" → "${newName}"`);
  }
}

// Handle the weird "|" entry - just skip it
// Handle 卡萝尔·阿娜 → already in npc

fs.writeFileSync(zzzPath, lines.join('\n'), 'utf8');
console.log(`\n完成！分类了 ${fixedCount} 个内联条目。`);
