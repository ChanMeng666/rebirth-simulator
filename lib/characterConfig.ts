export const GENDER_TYPES = ['男', '女', '其他'] as const;

export const SEXUAL_ORIENTATION = [
  '异性恋',
  '同性恋',
  '双性恋',
  '无性恋',
  '其他'
] as const;

export const RELIGIONS = {
  NONE: "无宗教信仰",
  BUDDHISM: "佛教",
  TAOISM: "道教",
  CHRISTIANITY: "基督教",
  CATHOLICISM: "天主教",
  ISLAM: "伊斯兰教",
  FOLK_BELIEF: "民间信仰",
} as const;

export const ETHNICITIES = {
  HAN: "汉族",
  ZHUANG: "壮族",
  HUI: "回族",
  MANCHU: "满族",
  UYGHUR: "维吾尔族",
  MIAO: "苗族",
  YI: "彝族",
  TUJIA: "土家族",
  TIBETAN: "藏族",
  MONGOL: "蒙古族",
} as const;

export const SOCIAL_CLASSES = [
  '上层',
  '中上层',
  '中层',
  '中下层',
  '下层'
] as const;

export const NATIONALITIES = [
  '中国',
  '美国',
  '日本',
  '韩国',
  '英国',
  '法国',
  '德国',
  '俄罗斯',
  '加拿大',
  '澳大利亚'
] as const;

// 根据时代调整属性生成概率
export function getAttributeProbabilities(birthYear: number) {
  // 基础概率
  const baseProbs = {
    lgbtChance: 0.1,        // LGBT+群体基础概率
    religiousChance: 0.2,   // 宗教信仰基础概率
    foreignChance: 0.05,    // 外国籍基础概率
  };

  // 根据时代调整概率
  if (birthYear < 1950) {
    return {
      ...baseProbs,
      lgbtChance: 0.05,     // 更早期LGBT+不易表达
      religiousChance: 0.4,  // 更多宗教信仰
      foreignChance: 0.02,   // 较少外国人
    };
  } else if (birthYear > 2020) {
    return {
      ...baseProbs,
      lgbtChance: 0.15,     // 更开放的社会
      religiousChance: 0.15, // 世俗化趋势
      foreignChance: 0.1,    // 更国际化
    };
  }

  return baseProbs;
}

// 随机选择一个属性
export function randomSelect<T extends Record<string, string>>(options: T): string {
  const keys = Object.keys(options);
  return options[keys[Math.floor(Math.random() * keys.length)]];
} 