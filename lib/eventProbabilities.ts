import { Character, LifeEventType } from '../types/game';

// 年龄段定义
export const AGE_STAGES = {
  INFANT: { min: 0, max: 3 },
  TODDLER: { min: 4, max: 6 },
  CHILD: { min: 7, max: 12 },
  TEENAGER: { min: 13, max: 18 },
  YOUNG_ADULT: { min: 19, max: 30 },
  ADULT: { min: 31, max: 50 },
  MIDDLE_AGE: { min: 51, max: 65 },
  ELDERLY: { min: 66, max: 120 }
};

// 基础事件概率（总和为1）
export const BASE_EVENT_PROBABILITIES: Record<string, Record<LifeEventType, number>> = {
  INFANT: {
    HEALTH: 0.35,      // 婴儿期健康问题较多
    EDUCATION: 0.20,    // 早期教育
    RELATIONSHIP: 0.25, // 与家人互动
    ACCIDENT: 0.10,     // 意外事件
    ACHIEVEMENT: 0.05,  // 发展里程碑
    CAREER: 0,         // 婴儿无职业事件
    SOCIAL: 0.05,      // 社交活动很少
    DISASTER: 0,       // 灾难影响较小
    HISTORICAL: 0       // 历史事件影响较小
  },

  TODDLER: {
    HEALTH: 0.25,
    EDUCATION: 0.30,
    RELATIONSHIP: 0.25,
    ACCIDENT: 0.10,
    ACHIEVEMENT: 0.05,
    CAREER: 0,
    SOCIAL: 0.05,
    DISASTER: 0,
    HISTORICAL: 0
  },

  CHILD: {
    HEALTH: 0.15,
    EDUCATION: 0.35,
    RELATIONSHIP: 0.20,
    ACCIDENT: 0.10,
    ACHIEVEMENT: 0.10,
    CAREER: 0,
    SOCIAL: 0.10,
    DISASTER: 0,
    HISTORICAL: 0
  },

  TEENAGER: {
    HEALTH: 0.10,
    EDUCATION: 0.30,
    RELATIONSHIP: 0.25,
    ACCIDENT: 0.10,
    ACHIEVEMENT: 0.10,
    CAREER: 0.05,
    SOCIAL: 0.10,
    DISASTER: 0,
    HISTORICAL: 0
  },

  YOUNG_ADULT: {
    HEALTH: 0.10,
    EDUCATION: 0.15,
    RELATIONSHIP: 0.25,
    ACCIDENT: 0.05,
    ACHIEVEMENT: 0.15,
    CAREER: 0.20,
    SOCIAL: 0.05,
    DISASTER: 0.025,
    HISTORICAL: 0.025
  },

  ADULT: {
    HEALTH: 0.15,
    EDUCATION: 0.05,
    RELATIONSHIP: 0.20,
    ACCIDENT: 0.10,
    ACHIEVEMENT: 0.15,
    CAREER: 0.25,
    SOCIAL: 0.05,
    DISASTER: 0.025,
    HISTORICAL: 0.025
  },

  MIDDLE_AGE: {
    HEALTH: 0.25,
    EDUCATION: 0.05,
    RELATIONSHIP: 0.20,
    ACCIDENT: 0.15,
    ACHIEVEMENT: 0.10,
    CAREER: 0.15,
    SOCIAL: 0.05,
    DISASTER: 0.025,
    HISTORICAL: 0.025
  },

  ELDERLY: {
    HEALTH: 0.35,
    EDUCATION: 0.05,
    RELATIONSHIP: 0.25,
    ACCIDENT: 0.20,
    ACHIEVEMENT: 0.05,
    CAREER: 0.025,
    SOCIAL: 0.05,
    DISASTER: 0.025,
    HISTORICAL: 0.025
  }
};

// 特殊事件触发条件和概率调整
export const EVENT_MODIFIERS = {
  HEALTH: {
    CRITICAL_CONDITION: {
      condition: (character: Character) => character.status.health < 20,
      multiplier: 2.0  // 健康状况差时，健康事件概率翻倍
    },
    GENETIC_RISK: {
      condition: (character: Character) => character.familyBackground.geneticConditions.length > 0,
      multiplier: 1.5  // 有遗传病史时，健康事件概率提高50%
    }
  },

  CAREER: {
    HIGH_EDUCATION: {
      condition: (character: Character) => character.status.education === '大学' || character.status.education === '研究生',
      multiplier: 1.3  // 高学历增加职业事件概率
    },
    ECONOMIC_BOOM: {
      condition: (character: Character, year: number) => year >= 1980 && year <= 2000,
      multiplier: 1.5  // 经济腾飞时期职业机会增加
    }
  },

  RELATIONSHIP: {
    HIGH_SOCIAL: {
      condition: (character: Character) => character.skills.social > 70,
      multiplier: 1.4  // 社交能力强增加人际关系事件
    },
    MARRIAGE_AGE: {
      condition: (character: Character) => character.status.age >= 22 && character.status.age <= 35,
      multiplier: 1.5  // 适婚年龄增加恋爱结婚事件
    }
  },

  DISASTER: {
    WAR_TIME: {
      condition: (character: Character, year: number) => year >= 1937 && year <= 1945,
      multiplier: 3.0  // 战争时期灾难事件大幅增加
    },
    NATURAL_DISASTER: {
      condition: (character: Character, birthPlace: string) => 
        ['四川', '云南', '台湾'].includes(birthPlace),
      multiplier: 1.5  // 地质灾害多发地区增加灾难概率
    }
  },

  EDUCATION: {
    GOOD_STUDENT: {
      condition: (character: Character) => 
        character.attributes.intelligence > 70 && character.skills.academic > 60,
      multiplier: 1.4  // 优秀学生更容易遇到教育相关事件
    },
    POOR_FAMILY: {
      condition: (character: Character) => 
        character.familyBackground.economicStatus < 30,
      multiplier: 0.7  // 贫困家庭教育机会减少
    },
    REFORM_ERA: {
      condition: (character: Character, year: number) => 
        year >= 1977 && year <= 1990,
      multiplier: 1.3  // 恢复高考后教育机会增加
    }
  },

  ACHIEVEMENT: {
    HIGH_TALENT: {
      condition: (character: Character) => {
        const talents = Object.values(character.talents);
        return talents.some(value => value > 80);
      },
      multiplier: 1.6  // 特殊天赋容易获得成就
    },
    GOOD_BACKGROUND: {
      condition: (character: Character) => 
        character.familyBackground.socialClass === 'UPPER',
      multiplier: 1.3  // 良好的家庭背景增加成就机会
    }
  },

  SOCIAL: {
    EXTROVERT: {
      condition: (character: Character) => 
        character.personality.extraversion > 70,
      multiplier: 1.5  // 外向性格增加社交事件
    },
    URBAN_LIFE: {
      condition: (character: Character) => 
        character.currentResidence.city === '北京' || 
        character.currentResidence.city === '上海' ||
        character.currentResidence.city === '广州' ||
        character.currentResidence.city === '深圳',
      multiplier: 1.3  // 大城市增加社交机会
    }
  },

  ACCIDENT: {
    RISK_TAKER: {
      condition: (character: Character) => 
        character.personality.openness > 80 && character.attributes.luck < 50,
      multiplier: 1.4  // 爱冒险且运气差的人更容易遇到意外
    },
    DANGEROUS_JOB: {
      condition: (character: Character) => {
        const dangerousJobs = ['矿工', '建筑工人', '消防员', '警察'];
        return dangerousJobs.includes(character.status.career);
      },
      multiplier: 1.6  // 危险职业增加意外概率
    }
  },

  HISTORICAL: {
    POLITICAL_FAMILY: {
      condition: (character: Character) => 
        character.familyBackground.socialClass === 'UPPER' &&
        character.status.reputation > 70,
      multiplier: 1.5  // 政治家庭更容易卷入历史事件
    },
    KEY_PERIOD: {
      condition: (character: Character, year: number) => {
        const keyYears = [1949, 1966, 1976, 1989, 2008];
        return keyYears.includes(year);
      },
      multiplier: 2.0  // 重要历史年份增加历史事件概率
    }
  }
};

// 添加时代背景影响
const ERA_MODIFIERS = {
  HEALTH: {
    PRE_1949: 0.7,    // 医疗条件差
    '1949-1978': 0.8,  // 医疗条件改善
    '1978-2000': 1.0,  // 医疗水平提升
    POST_2000: 1.2     // 现代医疗
  },
  EDUCATION: {
    PRE_1949: 0.5,
    '1949-1978': 0.7,
    '1978-2000': 1.2,
    POST_2000: 1.3
  },
  // ... 其他事件类型的时代修正
};

// 修改计算函数，加入时代背景影响
export function calculateEventProbabilities(
  character: Character,
  currentYear: number
): Record<LifeEventType, number> {
  const ageStage = getAgeStage(character.status.age);
  const baseProbs = BASE_EVENT_PROBABILITIES[ageStage];
  const adjustedProbs = { ...baseProbs };

  // 应用特殊条件修正
  Object.entries(EVENT_MODIFIERS).forEach(([eventType, modifiers]) => {
    Object.values(modifiers).forEach(modifier => {
      if (modifier.condition(character, currentYear)) {
        adjustedProbs[eventType] *= modifier.multiplier;
      }
    });
  });

  // 应用时代背景修正
  const era = getEra(currentYear);
  Object.entries(ERA_MODIFIERS).forEach(([eventType, modifiers]) => {
    if (adjustedProbs[eventType]) {
      adjustedProbs[eventType] *= modifiers[era];
    }
  });

  // 归一化概率总和
  const total = Object.values(adjustedProbs).reduce((sum, prob) => sum + prob, 0);
  Object.keys(adjustedProbs).forEach(key => {
    adjustedProbs[key] = adjustedProbs[key] / total;
  });

  return adjustedProbs;
}

// 获取角色当前年龄段
function getAgeStage(age: number): string {
  for (const [stage, range] of Object.entries(AGE_STAGES)) {
    if (age >= range.min && age <= range.max) {
      return stage;
    }
  }
  return 'ADULT'; // 默认返回成年阶段
}

// 获取时代背景
function getEra(year: number): string {
  if (year < 1949) return 'PRE_1949';
  if (year < 1978) return '1949-1978';
  if (year < 2000) return '1978-2000';
  return 'POST_2000';
} 