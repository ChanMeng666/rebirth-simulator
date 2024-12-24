import { type Character } from '../types/game';

interface ParsedResponse {
  talent: string[];
  personality: string;
  familyBackground: string;
}

export function parseCharacterResponse(text: string): ParsedResponse {
  // 从文本中提取字符串列表
  const getTalents = (text: string): string[] => {
    // 尝试多种可能的格式匹配
    const patterns = [
      /天赋[：:]\s*\[(.*?)\]/i,
      /天赋[：:]\s*(.+?)(?=\n|$)/i,
      /个人天赋[：:]\s*\[(.*?)\]/i,
      /个人天赋[：:]\s*(.+?)(?=\n|$)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const talents = match[1].split(/[,，、]/).map(t => t.trim());
        if (talents.filter(t => t.length > 0).length > 0) {
          return talents;
        }
      }
    }
    return ["普通"];
  };

  // 从文本中提取描述
  const getDescription = (text: string, field: string): string => {
    const patterns = [
      new RegExp(`${field}[：:]\\s*\\[(.*?)\\]`, 'i'),
      new RegExp(`${field}[：:]\\s*(.+?)(?=\\n|$)`, 'i')
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1] && match[1].trim()) {
        return match[1].trim();
      }
    }
    return "未知";
  };

  // 清理文本，移除可能的干扰字符
  const cleanText = text.replace(/\r/g, '\n').replace(/\n+/g, '\n');

  return {
    talent: getTalents(cleanText),
    personality: getDescription(cleanText, "性格"),
    familyBackground: getDescription(cleanText, "家庭背景")
  };
} 