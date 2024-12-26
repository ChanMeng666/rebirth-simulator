import { Character, NPC, Relationship, RelationType } from '../types/game';
import { randomSelect, GENDER_TYPES } from './characterConfig';

// 生成NPC基础属性
function generateNPCBase(age: number): Partial<NPC> {
  return {
    id: Math.random().toString(36).substr(2, 9),
    biologicalSex: randomSelect(GENDER_TYPES),
    genderIdentity: randomSelect(GENDER_TYPES),
    age,
    traits: generateTraits(),
    occupation: generateOccupation(age),
    personality: generatePersonality()
  };
}

// 生成性格特征
function generatePersonality(): Character['personality'] {
  return {
    openness: Math.floor(Math.random() * 100) + 1,
    conscientiousness: Math.floor(Math.random() * 100) + 1,
    extraversion: Math.floor(Math.random() * 100) + 1,
    agreeableness: Math.floor(Math.random() * 100) + 1,
    neuroticism: Math.floor(Math.random() * 100) + 1
  };
}

// 生成特征列表
function generateTraits(): string[] {
  const allTraits = [
    '善良', '严厉', '开朗', '内向', '勤奋', '懒惰',
    '聪明', '固执', '热情', '冷淡', '大方', '吝啬'
  ];
  
  const traitCount = Math.floor(Math.random() * 3) + 2;
  const traits: string[] = [];
  
  while (traits.length < traitCount) {
    const trait = allTraits[Math.floor(Math.random() * allTraits.length)];
    if (!traits.includes(trait)) {
      traits.push(trait);
    }
  }
  
  return traits;
}

// 根据年龄生成职业
function generateOccupation(age: number): string {
  if (age < 18) return '学生';
  
  const occupations = [
    '教师', '医生', '工程师', '销售', '公务员',
    '企业职员', '自由职业者', '创业者', '艺术家'
  ];
  
  return occupations[Math.floor(Math.random() * occupations.length)];
}

// 生成关系
function generateRelationship(type: RelationType): Relationship {
  return {
    type,
    intimacy: Math.floor(Math.random() * 50) + 30, // 30-80的初始好感度
    duration: 0,
    events: [],
    status: 'ACTIVE'
  };
}

// 生成NPC
export function generateNPC(
  type: RelationType,
  characterAge: number,
  preferences: Partial<NPC> = {}
): NPC {
  let age: number;
  
  switch (type) {
    case 'FAMILY':
      age = characterAge + Math.floor(Math.random() * 40) - 20;
      break;
    case 'FRIEND':
      age = characterAge + Math.floor(Math.random() * 10) - 5;
      break;
    case 'ROMANCE':
      age = characterAge + Math.floor(Math.random() * 10) - 5;
      break;
    case 'WORK':
      age = characterAge + Math.floor(Math.random() * 20) - 10;
      break;
    default:
      age = characterAge;
  }
  
  age = Math.max(1, age); // 确保年龄不小于1岁
  
  const npc: NPC = {
    ...generateNPCBase(age),
    ...preferences,
    relationship: generateRelationship(type)
  } as NPC;
  
  return npc;
} 