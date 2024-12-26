import { GoogleGenerativeAI } from '@google/generative-ai';
import { type Character, type LifeEvent } from '../../../types/game';
import { EventGenerator } from '@/lib/eventGenerator';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export async function POST(req: Request) {
  try {
    const { character, age, birthYear } = await req.json();
    
    const eventGenerator = new EventGenerator(character);
    const event = await eventGenerator.generateEvent(age, birthYear);

    // 使用AI增强事件描述
    const eventPrompt = `
生成一个简短的${age}岁人生事件。

角色信息：
- 性别：${character.biologicalSex}
- 出生年：${birthYear}
- 家庭背景：${character.familyBackground.socialClass}

要求：
1. 使用一句话描述（不超过30字）
2. 符合年龄特征和历史背景
3. 语言要简洁自然
4. 不要使用任何特殊符号

示例：
"蹒跚学步，说出了人生的第一个词。"
"上幼儿园第一天，和小朋友愉快地玩耍。"

请生成：`;
    const result = await model.generateContent(eventPrompt);
    const response = await result.response;
    event.event = parseEventResponse(response.text().trim());

    return Response.json({ event });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: '生成事件失败' },
      { status: 500 }
    );
  }
}

// 解析响应
function parseEventResponse(response: string): string {
  // 移除所有特殊符号和标记
  let cleanText = response.replace(/[*_#]/g, '');
  // 提取第一句完整的话
  const firstSentence = cleanText.split(/[。！？.!?]/)[0];
  return firstSentence + '。';
} 