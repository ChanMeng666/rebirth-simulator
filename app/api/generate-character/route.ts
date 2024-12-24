import { GoogleGenerativeAI } from '@google/generative-ai';
import { type Character } from '../../../types/game';
import { parseCharacterResponse } from '@/lib/parseAIResponse';
import { getAttributeProbabilities, randomSelect, GENDER_TYPES, SEXUAL_ORIENTATION, RELIGIONS, ETHNICITIES, NATIONALITIES, SOCIAL_CLASSES } from '@/lib/characterConfig';

// 确保类型定义
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GEMINI_API_KEY: string;
    }
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

function generateCharacterPrompt(character: Character): string {
  return `
请根据以下背景信息生成一个角色的详细描述，严格按照以下格式输出：

基本信息：
性别: ${character.gender}
性取向: ${character.sexualOrientation}
外貌: ${character.appearance}
智力: ${character.intelligence}
体力: ${character.strength}
民族: ${character.ethnicity}
国籍: ${character.nationality}
宗教信仰: ${character.religion}
社会阶层: ${character.socialClass}

请按照以下格式生成其他信息：

天赋: [请列出2-3个具体天赋，用顿号分隔]
性格: [请描述3-4个性格特征，用顿号分隔]
家庭背景: [请用一句话描述家庭情况]

注意事项：
1. 必须使用上述格式，包括冒号和方括号
2. 天赋和性格特征之间使用顿号（、）分隔
3. 所有描述必须符合角色的背景设定
4. 考虑人物的各项属性之间的关联性
5. 确保描述符合角色的文化和社会背景
`;
}

export async function POST() {
  try {
    // 随机生成出生年份
    const birthYear = Math.floor(Math.random() * (2024 - 1900 + 1)) + 1900;
    const probs = getAttributeProbabilities(birthYear);

    // 生成基础属性
    const isLGBT = Math.random() < probs.lgbtChance;
    const isReligious = Math.random() < probs.religiousChance;
    const isForeign = Math.random() < probs.foreignChance;

    // 生成角色属性
    const gender = randomSelect(GENDER_TYPES);
    const sexualOrientation = isLGBT ? randomSelect(SEXUAL_ORIENTATION) : "异性恋";
    const religion = isReligious ? randomSelect(RELIGIONS) : "无宗教信仰";
    const ethnicity = randomSelect(ETHNICITIES);
    const nationality = isForeign ? randomSelect(NATIONALITIES) : "中国";
    const socialClass = randomSelect(SOCIAL_CLASSES);

    // 生成基础数值
    const character: Character = {
      gender,
      sexualOrientation,
      appearance: Math.floor(Math.random() * 100) + 1,
      intelligence: Math.floor(Math.random() * 100) + 1,
      strength: Math.floor(Math.random() * 100) + 1,
      ethnicity,
      nationality,
      religion,
      socialClass,
      talent: [],
      personality: "",
      familyBackground: "",
    };

    // 使用AI生成详细描述
    const prompt = generateCharacterPrompt(character);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // 解析AI返回的文本
    const parsedCharacter = parseCharacterResponse(text);
    const finalCharacter: Character = {
      ...character,
      talent: parsedCharacter.talent,
      personality: parsedCharacter.personality,
      familyBackground: parsedCharacter.familyBackground
    };

    return Response.json({ character: finalCharacter });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: '生成角色失败' },
      { status: 500 }
    );
  }
} 