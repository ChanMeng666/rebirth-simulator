import { GoogleGenerativeAI } from '@google/generative-ai';
import { type Character, type LifeEvent } from '../../../types/game';
import { getAgeStage, getDeathProbability } from '@/lib/ageUtils';
import { getHistoricalEvent } from '@/lib/historicalEvents';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

function generateEventPrompt(
  character: Character,
  age: number,
  currentYear: number,
  historicalEvent: { event: string; era: string } | null,
  history: LifeEvent[]
): string {
  return `
基于以下角色信息和历史事件，生成该角色在特定年龄发生的事件：

角色信息：
性别认同: ${character.gender}
性取向: ${character.sexualOrientation}
外貌: ${character.appearance}
智力: ${character.intelligence}
体力: ${character.strength}
民族: ${character.ethnicity}
国籍: ${character.nationality}
宗教信仰: ${character.religion}
社会阶层: ${character.socialClass}
天赋: ${character.talent.join('、')}
性格: ${character.personality}
家庭背景: ${character.familyBackground}

当前年龄：${age}岁
当前年份：${currentYear}年
历史背景：${historicalEvent ? `正值${historicalEvent.era}，${historicalEvent.event}` : '普通年代'}

历史事件：
${history.map(event => `${event.age}岁：${event.event}`).join('\n')}

请生成一个符合以下条件的事件：
1. 考虑角色的全部背景特征
2. 符合角色的年龄特征
3. 与历史事件和时代背景相呼应
4. 可能涉及身份认同、文化冲突或社会变迁
5. 体现角色在面对困境时的选择

请用一段简短的文字描述这个事件，确保故事合理且富有深度。
`;
}

export async function POST(req: Request) {
  try {
    const { character, age, history, birthYear } = await req.json();
    
    const currentYear = birthYear + age;
    const historicalEvent = getHistoricalEvent(currentYear, character);
    
    // 获取当前年龄段
    const ageStage = getAgeStage(age);
    
    // 计算死亡概率
    const deathProb = getDeathProbability(age, character.strength);
    const shouldDie = Math.random() < deathProb;

    // 构建完整的提示词
    const prompt = generateEventPrompt(character, age, currentYear, historicalEvent, history);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const eventText = response.text();

    // 检查是否包含死亡相关词语
    const deathKeywords = ['死亡', '去世', '永远离开', '不幸逝世', '死了'];
    const isDeath = shouldDie || deathKeywords.some(keyword => eventText.includes(keyword));

    // 判断是否为重要事件
    const significantKeywords = ['获得', '成功', '实现', '达到', '突破', '改变'];
    const isSignificant = significantKeywords.some(keyword => eventText.includes(keyword));

    const event: LifeEvent = {
      age,
      event: eventText.trim(),
      isDeath,
      isSignificant
    };

    return Response.json({ event });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: '生成事件失败' },
      { status: 500 }
    );
  }
} 