import { GoogleGenerativeAI } from '@google/generative-ai';
import { type Character } from '../../../types/game';
import { parseCharacterResponse } from '@/lib/parseAIResponse';
import { 
  getAttributeProbabilities, 
  randomSelect, 
  GENDER_TYPES, 
  SEXUAL_ORIENTATION, 
  RELIGIONS, 
  ETHNICITIES, 
  NATIONALITIES, 
  SOCIAL_CLASSES 
} from '@/lib/characterConfig';

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

export async function POST(req: Request) {
  try {
    const birthYear = 1900 + Math.floor(Math.random() * 123); // 1900-2023
    
    // 首先创建基础角色属性
    const baseCharacter: Partial<Character> = {
      biologicalSex: randomSelect(GENDER_TYPES),
      genderIdentity: randomSelect(GENDER_TYPES),
      sexualOrientation: randomSelect(SEXUAL_ORIENTATION),
      birthYear,
      birthPlace: {
        country: randomSelect(NATIONALITIES),
      },
      currentResidence: {
        country: randomSelect(NATIONALITIES),
      },
      familyBackground: {
        socialClass: randomSelect(['上层', '中上层', '中层', '中下层', '下层']),
        economicStatus: Math.floor(Math.random() * 100),
        parentalStatus: randomSelect([
          '双亲健在',
          '父亲健在',
          '母亲健在',
          '父母离异',
          '父母均故'
        ]),
        familyStructure: randomSelect([
          '独生子女',
          '有一个兄弟姐妹',
          '有多个兄弟姐妹',
          '大家庭'
        ]),
        familyRelations: Math.floor(Math.random() * 100),
        geneticConditions: []
      },
      attributes: {
        appearance: Math.floor(Math.random() * 100),
        intelligence: Math.floor(Math.random() * 100),
        strength: Math.floor(Math.random() * 100),
        health: Math.floor(Math.random() * 100),
        luck: Math.floor(Math.random() * 100)
      },
      skills: {
        学术: 10,
        艺术: 10,
        体育: 10,
        社交: 10,
        实践: 10
      },
      status: {
        education: "未入学",
        career: "无",
        wealth: 0, // 将在后面设置
        reputation: 50,
        happiness: 50,
        health: 0, // 将在后面设置
        relationships: [],
        diseases: []
      }
    };

    // 使用AI生成角色的详细信息
    const prompt = generateCharacterPrompt(baseCharacter as Character);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // 解析AI返回的文本
    const parsedCharacter = parseCharacterResponse(text);
    
    // 更新状态中依赖于其他属性的值
    const finalCharacter: Character = {
      ...baseCharacter,
      ...parsedCharacter,
      status: {
        ...baseCharacter.status,
        wealth: baseCharacter.familyBackground?.economicStatus || 50,
        health: baseCharacter.attributes?.health || 100
      }
    } as Character;

    return Response.json({ character: finalCharacter });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: '生成角色失败' },
      { status: 500 }
    );
  }
}

function generateCharacterPrompt(character: Character): string {
  return `
请根据以下背景信息生成一个角色的详细描述，严格按照以下格式输出：

基本信息：
- 性别：${character.biologicalSex}
- 性取向：${character.sexualOrientation}
- 出生地：${character.birthPlace.country}
- 家庭背景：${character.familyBackground.socialClass}

请生成：
1. 性格特征（1-100）：
- 开放性
- 尽责性
- 外向性
- 宜人性
- 神经质

2. 天赋（1-100）：
- 语言天赋
- 逻辑思维
- 空间感知
- 音乐天赋
- 身体运动
- 人际交往
- 自我认知
- 自然观察

3. 家庭背景详细描述：
- 家庭经济状况
- 父母状况
- 家庭结构
- 家庭关系
- 遗传病史（如有）

请按照以上格式输出，确保每个数值在1-100之间。`;
} 