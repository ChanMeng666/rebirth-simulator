export type Gender = '男' | '女' | '其他';
export type SexualOrientation = '异性恋' | '同性恋' | '双性恋' | '无性恋' | '其他';
export type SocialClass = '上层' | '中上层' | '中层' | '中下层' | '下层';

export interface Character {
  biologicalSex: Gender;
  genderIdentity: Gender;
  sexualOrientation: SexualOrientation;
  birthPlace: {
    country: string;
    province?: string;
    city?: string;
  };
  currentResidence: {
    country: string;
    province?: string;
    city?: string;
  };
  familyBackground: {
    socialClass: SocialClass;
    economicStatus: number;
    parentalStatus: string;
    familyStructure: string;
    familyRelations: number;
    geneticConditions: string[];
  };
  attributes: {
    appearance: number;
    intelligence: number;
    strength: number;
    health: number;
    luck: number;
  };
  personality: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  talents: {
    linguistic: number;
    logical: number;
    spatial: number;
    musical: number;
    bodily: number;
    interpersonal: number;
    intrapersonal: number;
    naturalistic: number;
  };
  skills: {
    学术: number;
    艺术: number;
    体育: number;
    社交: number;
    实践: number;
  };
  status: {
    education: string;
    career: string;
    wealth: number;
    reputation: number;
    happiness: number;
    health: number;
    relationships: Relationship[];
    diseases: string[];
  };
}

export interface Relationship {
  person: string;
  type: string;
  intimacy: number;
  duration: number;
  status: 'ACTIVE' | 'ESTRANGED' | 'ENDED';
  events: string[];
}

export interface LifeEvent {
  age: number;
  type: EventCategory;
  event: string;
  impact?: {
    health?: number;
    wealth?: number;
    happiness?: number;
    reputation?: number;
    relationships?: Array<{
      person: string;
      intimacyChange: number;
    }>;
    skills?: Array<{
      skill: keyof Character['skills'];
      change: number;
    }>;
  };
  isSignificant?: boolean;
  isDeath?: boolean;
}

export type EventCategory = 
  | 'EDUCATION'
  | 'CAREER'
  | 'RELATIONSHIP'
  | 'HEALTH'
  | 'WEALTH'
  | 'ACCIDENT'
  | 'ACHIEVEMENT'
  | 'SOCIAL'
  | 'DISASTER'
  | 'HISTORICAL';

export interface GameState {
  character: Character | null;
  currentAge: number;
  lifeEvents: LifeEvent[];
  isGameOver: boolean;
}

export type RelationType = 'FAMILY' | 'FRIEND' | 'ROMANCE' | 'WORK';

export interface NPC {
  id: string;
  biologicalSex: string;
  genderIdentity: string;
  age: number;
  traits: string[];
  occupation: string;
  personality: Character['personality'];
  relationship: Relationship;
}

export interface Relationship {
  type: RelationType;
  intimacy: number;      // 0-100
  duration: number;      // 关系持续时间（年）
  events: string[];      // 重要关系事件历史
  status: 'ACTIVE' | 'ESTRANGED' | 'ENDED';
}

export function createDefaultCharacter(): Partial<Character> {
  return {
    status: {
      education: "未入学",
      career: "无",
      wealth: 50,
      reputation: 50,
      happiness: 50,
      health: 100,
      relationships: [],
      diseases: []
    },
    // 可以添加其他默认值
  };
} 