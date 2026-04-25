import fs from 'fs';
import path from 'path';

// Try to load opencc-js, if not available use a manual mapping
let Converter;
try {
  const opencc = await import('opencc-js');
  Converter = opencc.Converter;
} catch (e) {
  console.log('⚠️  opencc-js not found, using built-in conversion table');
  Converter = null;
}

const dir = '/Users/ningqing/Documents/tavern_helper_template/世界书/ZZZ';
const zzzPath = '/Users/ningqing/Documents/tavern_helper_template/世界书/zzz.yaml';

// ===== Danbooru Tag Map =====
const danbooruTags = {
  '安比': 'anby_demara (zenless zone zero)',
  '比利': 'billy_kid (zenless zone zero)',
  '猫又': 'nekomiya_mana (zenless zone zero)',
  '妮可': 'nicole_demara (zenless zone zero)',
  '11号': 'soldier_11_(zenless_zone_zero)',
  '珂蕾妲': 'koleda_belobog (zenless zone zero)',
  '格莉丝': 'grace_howard (zenless zone zero)',
  '安东': 'anton_ivanov (zenless zone zero)',
  '本': 'ben_bigger (zenless zone zero)',
  '朱鸢': 'zhu_yuan (zenless zone zero)',
  '青衣': 'qingyi_(zenless_zone_zero)',
  '简': 'jane_doe_(zenless_zone_zero)',
  '赛斯': 'seth_lowell (zenless zone zero)',
  '星见雅': 'hoshimi_miyabi (zenless zone zero)',
  '月城柳': 'tsukishiro_yanagi (zenless zone zero)',
  '苍角': 'soukaku_(zenless_zone_zero)',
  '浅羽悠真': 'asaba_harumasa (zenless zone zero)',
  '照': 'zhao_(zenless_zone_zero)',
  '琉音': 'dialyn_(zenless_zone_zero)',
  '般岳': 'banyue_(zenless_zone_zero)',
  '雨果': 'hugo_vlad (zenless zone zero)',
  '薇薇安': 'vivian_banshee (zenless zone zero)',
  '席德': 'seed_(zenless_zone_zero)',
  '奥菲丝·马格努森 & 「鬼火」': 'orphie_magnusson (zenless zone zero)',
  '崔姬': 'trigger_(zenless_zone_zero)',
  '凯撒': 'caesar_king_(zenless_zone_zero)',
  '柏妮思': 'burnice_white (zenless zone zero)',
  '莱特': 'lighter_(zenless_zone_zero)',
  '卢西娅': 'luciana_de_montefio (zenless zone zero)',
  '露西': "lucy's_crew_(zenless_zone_zero)",
  '派派': 'piper_wheel (zenless zone zero)',
  '波可娜': 'pulchra_fellini (zenless zone zero)',
  '莱卡恩': 'von_lycaon (zenless zone zero)',
  '艾莲': 'ellen_joe (zenless zone zero)',
  '可琳': 'corin_wickes (zenless zone zero)',
  '丽娜': 'alexandrina_sebastiane (zenless zone zero)',
  '耀嘉音': 'astra_yao (zenless zone zero)',
  '伊芙琳': 'evelyn_chevalier (zenless zone zero)',
  '仪玄': 'yixuan_(zenless_zone_zero)',
  '橘福福': 'ju_fufu (zenless zone zero)',
  '潘引壶': 'pan_yinhu (zenless zone zero)',
  '叶瞬光': 'ye_shunguang (zenless zone zero)',
  '南宫羽': 'nangong_yu (zenless zone zero)',
  '爱芮': 'aria_(zenless_zone_zero)',
  '千夏': 'sunna_(zenless_zone_zero)',
  '狛野真斗': 'komano_manato (zenless zone zero)',
  '爱丽丝·泰姆菲尔德': 'alice_thymefield (zenless zone zero)',
  '浮波柚叶': 'ukinami_yuzuha (zenless zone zero)',
  '蒂娜': 'anastella_(zenless_zone_zero)',
  '维琳娜': 'drusilla_(zenless_zone_zero)',
  '诺姆': 'magus_(zenless_zone_zero)',
  '扳机': 'trigger_(zenless_zone_zero)',
  '芮恩': 'seed_sr. (zenless zone zero)',
  '塞西莉亚': 'cecilia_(zenless_zone_zero)',
  '希希芙': 'cissia_(zenless_zone_zero)',
  'fairy': 'fairy_(zenless_zone_zero)',
  '仪绛': 'yijiang_(zenless_zone_zero)',
  '伊德海莉': 'yidhari_murphy (zenless zone zero)',
  '伊瑟尔德': 'isolde_(zenless_zone_zero)',
  '莎拉': 'sarah_floren (zenless zone zero)',
  '哲': 'chalky_(zenless_zone_zero)',
  '卡洛丝·阿尔娜': 'carole_arna (zenless zone zero)',
  '苏茜': 'susie_(zenless_zone_zero)',
  '亚莎': 'asha_(zenless_zone_zero)',
  '普罗米娅': 'promeia_(zenless_zone_zero)',
  '赛维里安·洛威尔': 'severian_lowell (zenless zone zero)',
  '叶释渊': 'ye_shiyuan (zenless zone zero)',
  'Youkai': 'kamanosuke_(zenless_zone_zero)',
  '蕾': 'belle_(zenless_zone_zero)',
  '胡薇': 'hu_wei_(zenless_zone_zero)',
};

// ===== 繁→简 文件名映射 =====
const fileRenames = {
  'char:儀玄.yaml': 'char:仪玄.yaml',
  'char:伊瑟爾德.yaml': 'char:伊瑟尔德.yaml',
  'char:啟明星.yaml': 'char:启明星.yaml',
  'char:盧西婭.yaml': 'char:卢西娅.yaml',
  'char:紅豆.yaml': 'char:红豆.yaml',
  'char:浮波柚葉.yaml': 'char:浮波柚叶.yaml',
  'char:葉瞬光.yaml': 'char:叶瞬光.yaml',
  'char:葉釋淵.yaml': 'char:叶释渊.yaml',
  'char:鈴.yaml': 'char:铃.yaml',
};

// 重复文件处理：删除繁体版，保留简体版
const duplicateFiles = [
  'char:愛芮.yaml',       // 保留 char:爱芮.yaml
  'char:淺羽悠真.yaml',   // 保留 char:浅羽悠真.yaml
];

// ===== 繁→简 常用字对照表（核心子集，用于无opencc时） =====
const t2sMap = {
  '儀': '仪', '絳': '绛', '爾': '尔', '啟': '启', '盧': '卢', '婭': '娅',
  '紅': '红', '葉': '叶', '釋': '释', '淵': '渊', '鈴': '铃', '愛': '爱',
  '淺': '浅', '銀': '银', '隊': '队', '維': '维', '麗': '丽', '對': '对',
  '課': '课', '奧': '奥', '書': '书', '場': '场', '環': '环', '調': '调',
  '協': '协', '會': '会', '歷': '历', '體': '体', '適': '适', '綜': '综',
  '閃': '闪', '離': '离', '複': '复', '誤': '误', '認': '认', '種': '种',
  '與': '与', '戰': '战', '術': '术', '構': '构', '裝': '装', '記': '记',
  '園': '园', '遊': '游', '覺': '觉', '輝': '辉', '築': '筑', '機': '机',
  '聯': '联', '應': '应', '區': '区', '備': '备', '損': '损', '據': '据',
  '電': '电', '個': '个', '關': '关', '開': '开', '實': '实', '門': '门',
  '長': '长', '獸': '兽', '護': '护', '職': '职', '響': '响', '練': '练',
  '齡': '龄', '質': '质', '極': '极', '導': '导', '專': '专', '號': '号',
  '發': '发', '點': '点', '標': '标', '風': '风', '幾': '几', '師': '师',
  '傳': '传', '話': '话', '語': '语', '貓': '猫', '數': '数', '變': '变',
  '級': '级', '連': '连', '進': '进', '達': '达', '運': '运', '過': '过',
  '線': '线', '遠': '远', '選': '选', '車': '车', '輕': '轻', '轉': '转',
  '農': '农', '邊': '边', '還': '还', '這': '这', '網': '网', '結': '结',
  '經': '经', '給': '给', '統': '统', '節': '节', '歲': '岁', '從': '从',
  '強': '强', '當': '当', '後': '后', '復': '复', '態': '态', '總': '总',
  '慶': '庆', '廣': '广', '異': '异', '張': '张', '彈': '弹', '歡': '欢',
  '殺': '杀', '氣': '气', '決': '决', '無': '无', '燈': '灯', '營': '营',
  '獲': '获', '現': '现', '產': '产', '畫': '画', '確': '确', '禮': '礼',
  '競': '竞', '義': '义', '聲': '声', '聽': '听', '腦': '脑', '華': '华',
  '藝': '艺', '蘭': '兰', '處': '处', '號': '号', '術': '术', '規': '规',
  '計': '计', '設': '设', '證': '证', '評': '评', '試': '试', '說': '说',
  '請': '请', '讓': '让', '議': '议', '財': '财', '費': '费', '資': '资',
  '賽': '赛', '趙': '赵', '軍': '军', '輪': '轮', '農': '农', '近': '近',
  '遲': '迟', '邏': '逻', '醫': '医', '鏡': '镜', '間': '间', '際': '际',
  '陣': '阵', '陰': '阴', '陽': '阳', '雙': '双', '難': '难', '電': '电',
  '預': '预', '頭': '头', '題': '题', '願': '愿', '顯': '显', '飛': '飞',
  '餘': '余', '馬': '马', '驗': '验', '鬥': '斗', '齊': '齐', '龍': '龙',
  '傑': '杰', '衛': '卫', '復': '复', '壓': '压', '夠': '够', '奪': '夺',
  '條': '条', '準': '准', '減': '减', '滅': '灭', '漸': '渐', '為': '为',
  '煙': '烟', '獨': '独', '範': '范', '絲': '丝', '繼': '继', '習': '习',
  '蟲': '虫', '補': '补', '裡': '里', '親': '亲', '觀': '观', '訊': '讯',
  '許': '许', '詢': '询', '詳': '详', '誰': '谁', '論': '论', '賣': '卖',
  '輸': '输', '邊': '边', '錄': '录', '錯': '错', '鑰': '钥', '閱': '阅',
  '階': '阶', '隨': '随', '雜': '杂', '靈': '灵', '項': '项', '飾': '饰',
  '駕': '驾', '騎': '骑', '驅': '驱', '髮': '发', '鮮': '鲜',
  '傷': '伤', '側': '侧', '偵': '侦', '價': '价', '億': '亿', '優': '优',
  '傳': '传', '儲': '储', '冊': '册', '創': '创', '剛': '刚', '劃': '划',
  '動': '动', '勝': '胜', '勢': '势', '勵': '励', '匯': '汇', '協': '协',
  '參': '参', '雙': '双', '歸': '归', '歲': '岁',
  // ZZZ-specific
  '飄': '飘', '齒': '齿', '屍': '尸', '獄': '狱', '壞': '坏',
  '擊': '击', '擊': '击', '歲': '岁', '歸': '归', '殘': '残',
  '滿': '满', '漲': '涨', '獵': '猎', '禦': '御', '穩': '稳',
  '築': '筑', '範': '范', '約': '约', '緒': '绪', '緣': '缘',
  '縣': '县', '繞': '绕', '聰': '聪', '與': '与', '舉': '举',
  '蓋': '盖', '蠟': '蜡', '複': '复', '觸': '触', '許': '许',
  '譯': '译', '護': '护', '讀': '读', '貨': '货', '貫': '贯',
  '費': '费', '賬': '账', '購': '购', '輛': '辆', '遼': '辽',
  '鄰': '邻', '鏈': '链', '閃': '闪', '陳': '陈', '隱': '隐',
  '黃': '黄', '齡': '龄',
};

function t2s(text) {
  if (Converter) {
    const converter = Converter({ from: 'tw', to: 'cn' });
    return converter(text);
  }
  // Manual fallback
  let result = '';
  for (const char of text) {
    result += t2sMap[char] || char;
  }
  return result;
}

// ===== Main Execution =====
let zzz = fs.readFileSync(zzzPath, 'utf8');
let renamedCount = 0;
let taggedCount = 0;
let convertedCount = 0;
let deletedCount = 0;

// 1. Delete duplicates
for (const dup of duplicateFiles) {
  const dupPath = path.join(dir, dup);
  if (fs.existsSync(dupPath)) {
    fs.unlinkSync(dupPath);
    deletedCount++;
    const baseName = dup.replace('.yaml', '');
    // Remove zzz.yaml entry reference for the duplicate
    console.log(`🗑️  删除重复: ${dup}`);
  }
}

// 2. Rename Traditional → Simplified filenames
for (const [oldName, newName] of Object.entries(fileRenames)) {
  const oldPath = path.join(dir, oldName);
  const newPath = path.join(dir, newName);
  
  if (!fs.existsSync(oldPath)) {
    console.log(`⏭️  跳过(不存在): ${oldName}`);
    continue;
  }
  
  // If target already exists, merge (keep simplified)
  if (fs.existsSync(newPath)) {
    console.log(`⚠️  ${newName} 已存在，删除繁体版 ${oldName}`);
    fs.unlinkSync(oldPath);
  } else {
    fs.renameSync(oldPath, newPath);
  }
  
  // Update zzz.yaml references
  const oldRef = 'ZZZ/' + oldName.replace('.yaml', '');
  const newRef = 'ZZZ/' + newName.replace('.yaml', '');
  zzz = zzz.split(oldRef).join(newRef);
  
  // Update entry names
  const oldEntryName = oldName.replace('.yaml', '');
  const newEntryName = newName.replace('.yaml', '');
  zzz = zzz.split(`名称: ${oldEntryName}`).join(`名称: ${newEntryName}`);
  
  renamedCount++;
  console.log(`✅ ${oldName} → ${newName}`);
}

// Also handle duplicate references in zzz.yaml
// Remove entry for char:愛芮 (keep char:爱芮)
const dupPatterns = [
  { name: 'char:愛芮', ref: 'ZZZ/char:愛芮' },
  { name: 'char:淺羽悠真', ref: 'ZZZ/char:淺羽悠真' },
];

// 3. Process all char: files - convert content & add tags
const charFiles = fs.readdirSync(dir)
  .filter(f => f.startsWith('char:') && f.endsWith('.yaml'))
  .sort();

for (const file of charFiles) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // 3a. Convert Traditional → Simplified
  const converted = t2s(content);
  if (converted !== content) {
    content = converted;
    modified = true;
    convertedCount++;
  }
  
  // 3b. Add danbooru tag if not present
  if (!content.includes('danbooru tag:')) {
    const charName = file.replace('char:', '').replace('.yaml', '');
    const tag = danbooruTags[charName] || '无';
    
    // Insert after first line (or after the header block)
    const lines = content.split('\n');
    // Find insertion point - after 【基本信息】 block's first few lines, or line 1
    let insertIdx = 0;
    for (let i = 0; i < Math.min(lines.length, 3); i++) {
      if (lines[i].includes('【基本信息】') || lines[i].includes('name:') || lines[i].match(/^---$/)) {
        insertIdx = i + 1;
        break;
      }
    }
    if (insertIdx === 0) insertIdx = 1; // default after first line
    
    lines.splice(insertIdx, 0, `danbooru tag: ${tag}`);
    content = lines.join('\n');
    modified = true;
    taggedCount++;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

// 4. Convert zzz.yaml Traditional → Simplified (for keywords etc)
zzz = t2s(zzz);

// 5. Deduplicate keywords in zzz.yaml
const zzzLines = zzz.split('\n');
let inKeywords = false;
let keywordSet = new Set();
let dedupCount = 0;
let cleanedLines = [];

for (let i = 0; i < zzzLines.length; i++) {
  const line = zzzLines[i];
  const trimmed = line.trim();
  
  if (trimmed === '关键字:') {
    inKeywords = true;
    keywordSet = new Set();
    cleanedLines.push(line);
    continue;
  }
  
  if (inKeywords) {
    const kwMatch = trimmed.match(/^- (.+)$/);
    if (kwMatch) {
      const keyword = kwMatch[1].trim();
      if (keywordSet.has(keyword)) {
        dedupCount++;
        // Skip duplicate keyword line
        continue;
      }
      keywordSet.add(keyword);
      cleanedLines.push(line);
      continue;
    } else {
      // End of keyword block
      inKeywords = false;
    }
  }
  
  cleanedLines.push(line);
}

zzz = cleanedLines.join('\n');

// 6. Remove duplicate entries from zzz.yaml for 愛芮/淺羽悠真
// These need to remove the entire entry block for the Traditional variant
for (const dup of dupPatterns) {
  // Find and remove the entry block
  const entryStart = zzz.indexOf(`名称: ${dup.name}`);
  if (entryStart !== -1) {
    // Find the start of this entry (the "  - 名称:" line)
    const lineStart = zzz.lastIndexOf('\n  - 名称:', entryStart);
    if (lineStart !== -1) {
      // Find the next entry
      const nextEntry = zzz.indexOf('\n  - 名称:', lineStart + 1);
      if (nextEntry !== -1) {
        zzz = zzz.substring(0, lineStart) + zzz.substring(nextEntry);
        console.log(`🗑️  zzz.yaml: 移除重复条目 ${dup.name}`);
      }
    }
  }
}

// Write back zzz.yaml
fs.writeFileSync(zzzPath, zzz, 'utf8');

console.log(`\n===== 完成 =====`);
console.log(`繁→简文件名: ${renamedCount} 个`);
console.log(`内容繁→简: ${convertedCount} 个文件`);
console.log(`danbooru tag: ${taggedCount} 个文件`);
console.log(`删除重复: ${deletedCount} 个`);
console.log(`关键字去重: ${dedupCount} 个`);
