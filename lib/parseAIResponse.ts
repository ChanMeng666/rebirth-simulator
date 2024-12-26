import { Character } from '../types/game';

export function parseCharacterResponse(text: string): Partial<Character> {
  try {
    // 提取性格特征
    const personality = {
      openness: extractNumber(text, '开放性'),
      conscientiousness: extractNumber(text, '尽责性'),
      extraversion: extractNumber(text, '外向性'),
      agreeableness: extractNumber(text, '宜人性'),
      neuroticism: extractNumber(text, '神经质')
    };

    // 提取天赋
    const talents = {
      linguistic: extractNumber(text, '语言天赋'),
      logical: extractNumber(text, '逻辑思维'),
      spatial: extractNumber(text, '空间感知'),
      musical: extractNumber(text, '音乐天赋'),
      bodily: extractNumber(text, '身体运动'),
      interpersonal: extractNumber(text, '人际交往'),
      intrapersonal: extractNumber(text, '自我认知'),
      naturalistic: extractNumber(text, '自然观察')
    };

    // 提取家庭背景信息
    const familyBackgroundText = text.split('家庭背景详细描述：')[1] || '';
    const geneticConditions = extractGeneticConditions(familyBackgroundText);

    return {
      personality,
      talents,
      familyBackground: {
        geneticConditions
      }
    };
  } catch (error) {
    console.error('解析AI响应时出错:', error);
    return {};
  }
}

function extractNumber(text: string, label: string): number {
  try {
    const regex = new RegExp(`${label}[：:]*\\s*(\\d+)`);
    const match = text.match(regex);
    if (match && match[1]) {
      const value = parseInt(match[1]);
      return Math.min(100, Math.max(1, value));
    }
    return 50; // 默认值
  } catch {
    return 50;
  }
}

function extractGeneticConditions(text: string): string[] {
  try {
    const conditions = text.match(/遗传病史[：:]\s*(.+)/);
    if (conditions && conditions[1] && conditions[1].trim() !== '无') {
      return conditions[1].split(/[,，、]/);
    }
    return [];
  } catch {
    return [];
  }
} 