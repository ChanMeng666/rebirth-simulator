import { Character, LifeEvent } from '../types/game';
import { EventTemplate, EventCategory } from './eventTypes';

// 常见疾病事件模板
const COMMON_DISEASES = {
  COLD: {
    name: '感冒',
    severity: 10,
    duration: '短期',
    template: '因为{{reason}}感冒了，卧床休息了几天。'
  },
  FEVER: {
    name: '发烧',
    severity: 20,
    duration: '短期',
    template: '突然发起高烧，{{treatment}}。'
  },
  INJURY: {
    name: '受伤',
    severity: 30,
    duration: '中期',
    template: '在{{location}}{{action}}时受伤，{{consequence}}。'
  }
};

// 慢性病事件模板
const CHRONIC_DISEASES = {
  DIABETES: {
    name: '糖尿病',
    severity: 50,
    chronicLevel: 0.7,
    template: '被诊断出糖尿病，需要{{treatment}}。'
  },
  HYPERTENSION: {
    name: '高血压',
    severity: 45,
    chronicLevel: 0.6,
    template: '发现有高血压症状，医生建议{{advice}}。'
  }
};

// 教育相关事件模板
const EDUCATION_EVENTS = {
  PRESCHOOL: {
    GOOD: [
      '在幼儿园表现出众，老师经常表扬',
      '展现出了超前的学习能力',
      '和小朋友相处融洽，交到了好朋友'
    ],
    NORMAL: [
      '开始适应幼儿园生活',
      '喜欢参加幼儿园的各种活动',
      '在幼儿园度过了快乐的时光'
    ],
    BAD: [
      '有些难以适应集体生活',
      '经常和其他小朋友发生矛盾',
      '学习新知识时显得有些吃力'
    ]
  },
  PRIMARY: {
    EXCELLENT: [
      '在期末考试中取得了全班第一的好成绩',
      '被选为班干部，深受老师信任',
      '在学科竞赛中获得了优异成绩'
    ],
    GOOD: [
      '学习成绩稳定在班级前列',
      '积极参加各种课外活动',
      '受到老师的表扬和鼓励'
    ],
    AVERAGE: [
      '学习成绩中规中矩',
      '和同学们相处融洽',
      '参加了一些感兴趣的兴趣班'
    ],
    POOR: [
      '部分科目的成绩不太理想',
      '上课时经常走神',
      '需要家长多多督促学习'
    ]
  }
  // ... 其他教育阶段的模板
};

// 人际关系事件模板
const RELATIONSHIP_EVENTS = {
  FRIENDSHIP: {
    MAKE_FRIEND: {
      templates: [
        '和{{person}}成为了好朋友，{{activity}}',
        '在{{location}}认识了{{person}}，很聊得来',
        '因为共同的{{interest}}爱好，和{{person}}建立了友谊'
      ],
      activities: [
        '一起参加了很多活动',
        '经常一起出去玩',
        '分享了很多共同话题'
      ],
      locations: [
        '学校',
        '工作场所',
        '兴趣班',
        '社交活动中',
        '网络上'
      ],
      interests: [
        '运动',
        '音乐',
        '读书',
        '游戏',
        '旅行'
      ]
    },
    FRIENDSHIP_CHALLENGE: {
      templates: [
        '和{{person}}因为{{reason}}产生了矛盾',
        '与{{person}}的友谊遇到了考验',
        '和{{person}}的关系变得疏远了'
      ],
      reasons: [
        '误会',
        '价值观差异',
        '利益冲突',
        '时间疏忽',
        '第三者插入'
      ]
    }
  },
  
  ROMANCE: {
    CRUSH: {
      templates: [
        '对{{person}}产生了好感，{{reaction}}',
        '发现自己喜欢上了{{person}}',
        '和{{person}}有了暧昧的互动'
      ],
      reactions: [
        '但不敢表白',
        '开始试探对方的态度',
        '决定保持距离',
        '暗自关注对方'
      ]
    },
    CONFESSION: {
      templates: [
        '鼓起勇气向{{person}}表白，{{result}}',
        '向暗恋已久的{{person}}告白，{{result}}',
        '{{person}}向你表白，{{response}}'
      ],
      results: [
        '被温柔地拒绝了',
        '对方也表达了同样的心意',
        '陷入了尴尬的境地',
        '开始了恋爱关系'
      ],
      responses: [
        '你接受了对方的心意',
        '你委婉地拒绝了',
        '你需要时间考虑'
      ]
    },
    BREAKUP: {
      templates: [
        '和{{person}}的恋情结束了，{{reason}}',
        '和{{person}}和平分手，{{aftermath}}',
        '经历了一段痛苦的分手'
      ],
      reasons: [
        '因为性格不合',
        '由于异地压力',
        '价值观差异太大',
        '对方出轨'
      ],
      aftermath: [
        '双方还是做朋友',
        '决定断绝联系',
        '各自开始新生活'
      ]
    }
  },

  MARRIAGE: {
    PROPOSAL: {
      templates: [
        '向{{person}}求婚，{{result}}',
        '在{{location}}被{{person}}求婚，{{response}}',
        '策划了一场浪漫的求婚'
      ],
      locations: [
        '浪漫的海边',
        '熟悉的餐厅',
        '旅行目的地',
        '对方工作场所'
      ],
      results: [
        '对方感动地答应了',
        '收获了甜蜜的答复',
        '被开心地接受了'
      ]
    },
    MARRIED_LIFE: {
      templates: [
        '和{{person}}的婚姻生活{{quality}}',
        '婚姻生活中经历了{{event}}',
        '与配偶{{activity}}'
      ],
      qualities: [
        '幸福美满',
        '平淡温馨',
        '偶有争执',
        '遇到了困境'
      ],
      events: [
        '重要的人生决定',
        '共同克服困难',
        '甜蜜的日常'
      ]
    }
  }
};

// 生成具体的疾病事件
export function generateCommonDiseaseEvent(age: number): LifeEvent {
  const diseases = Object.values(COMMON_DISEASES);
  const disease = diseases[Math.floor(Math.random() * diseases.length)];
  
  const reasons = [
    '天气突然转凉',
    '淋雨后',
    '过度劳累',
    '熬夜后',
    '饮食不当'
  ];
  
  const treatments = [
    '去医院打了针',
    '吃了几天药',
    '在家休养',
    '看了医生',
    '输了液'
  ];

  const event = disease.template
    .replace('{{reason}}', reasons[Math.floor(Math.random() * reasons.length)])
    .replace('{{treatment}}', treatments[Math.floor(Math.random() * treatments.length)]);

  return {
    age,
    event,
    type: 'HEALTH',
    impact: {
      health: -disease.severity,
      happiness: -10,
      wealth: -5
    }
  };
}

// 生成教育事件
export function generatePreschoolEvent(intelligence: number): LifeEvent {
  const events = EDUCATION_EVENTS.PRESCHOOL;
  let eventText: string;

  if (intelligence >= 80) {
    eventText = events.GOOD[Math.floor(Math.random() * events.GOOD.length)];
  } else if (intelligence >= 40) {
    eventText = events.NORMAL[Math.floor(Math.random() * events.NORMAL.length)];
  } else {
    eventText = events.BAD[Math.floor(Math.random() * events.BAD.length)];
  }

  return {
    age: Math.floor(Math.random() * 3) + 4, // 4-6岁
    event: eventText,
    type: 'EDUCATION',
    impact: {
      happiness: intelligence >= 60 ? 10 : -5,
      skills: [
        {
          skill: 'academic',
          change: intelligence >= 80 ? 5 : (intelligence >= 40 ? 3 : 1)
        }
      ]
    }
  };
}

// 生成职业事件
export function generateJobSearchEvent(skills: Character['skills'], education: string): LifeEvent {
  const jobTypes = {
    HIGH: ['知名企业', '外资公司', '国有企业'],
    MEDIUM: ['中小企业', '创业公司', '本地企业'],
    LOW: ['小商店', '工厂', '服务行业']
  };

  const academicLevel = skills.academic;
  const socialLevel = skills.social;
  const practicalLevel = skills.practical;
  
  const totalScore = (academicLevel + socialLevel + practicalLevel) / 3;
  
  let jobPool: string[];
  let salaryLevel: string;
  let successRate: number;

  if (totalScore >= 75) {
    jobPool = jobTypes.HIGH;
    salaryLevel = '可观';
    successRate = 0.8;
  } else if (totalScore >= 50) {
    jobPool = jobTypes.MEDIUM;
    salaryLevel = '尚可';
    successRate = 0.6;
  } else {
    jobPool = jobTypes.LOW;
    salaryLevel = '一般';
    successRate = 0.4;
  }

  const success = Math.random() < successRate;
  const company = jobPool[Math.floor(Math.random() * jobPool.length)];

  const event = success
    ? `经过努力求职，成功在一家${company}找到了工作，薪资${salaryLevel}。`
    : `四处投递简历，暂时还没有找到合适的工作。`;

  return {
    age: 0, // 需要在调用时设置具体年龄
    event,
    type: 'CAREER',
    impact: {
      wealth: success ? 20 : -5,
      happiness: success ? 15 : -10,
      reputation: success ? 10 : 0
    }
  };
}

// 生成恋爱事件
export function generateRomanceEvent(character: Character, age: number): LifeEvent {
  const { personality, status } = character;
  const { extraversion, agreeableness } = personality;
  
  // 根据性格特征调整事件概率
  const eventTypes = {
    CRUSH: 0.4 + (extraversion / 200),
    CONFESSION: 0.3 + (extraversion / 150),
    BREAKUP: 0.3 - (agreeableness / 200)
  };

  const eventType = weightedRandomSelect(eventTypes);
  const templates = RELATIONSHIP_EVENTS.ROMANCE[eventType];
  
  // 生成人物名字（这里可以扩展为更复杂的NPC生成系统）
  const names = ['小明', '小红', '小华', '小林', '小张'];
  const person = names[Math.floor(Math.random() * names.length)];
  
  let eventText = randomSelect(templates.templates)
    .replace('{{person}}', person);

  // 根据不同事件类型填充不同的模板变量
  switch (eventType) {
    case 'CRUSH':
      eventText = eventText.replace('{{reaction}}', 
        randomSelect(templates.reactions));
      break;
    case 'CONFESSION':
      eventText = eventText.replace('{{result}}',
        randomSelect(templates.results));
      break;
    case 'BREAKUP':
      eventText = eventText.replace('{{reason}}',
        randomSelect(templates.reasons));
      break;
  }

  return {
    age,
    event: eventText,
    type: 'RELATIONSHIP',
    impact: {
      happiness: eventType === 'BREAKUP' ? -20 : 15,
      skills: [{
        skill: 'social',
        change: 2
      }],
      relationships: [{
        person,
        intimacyChange: eventType === 'BREAKUP' ? -50 : 30
      }]
    }
  };
}

// 辅助函数
function randomSelect<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function weightedRandomSelect<T extends string>(probabilities: Record<T, number>): T {
  const total = Object.values(probabilities).reduce((sum, p) => sum + p, 0);
  let random = Math.random() * total;
  
  for (const [key, prob] of Object.entries(probabilities)) {
    random -= prob;
    if (random <= 0) {
      return key as T;
    }
  }
  
  return Object.keys(probabilities)[0] as T;
}

export const EDUCATION_TEMPLATES: EventTemplate[] = [
  {
    type: 'EDUCATION',
    probability: (character, age) => age < 25 ? 0.4 : 0.1,
    baseEvent: '参加考试',
    possibleOutcomes: ['成绩优异', '表现一般', '成绩不理想'],
    impactRanges: {
      happiness: [-10, 20],
      reputation: [-5, 15]
    }
  },
  {
    type: 'EDUCATION',
    probability: (character, age) => age >= 18 && age <= 30 ? 0.3 : 0,
    baseEvent: '升学选择',
    possibleOutcomes: ['成功考入理想学校', '勉强达到预期', '未能如愿'],
    impactRanges: {
      happiness: [-15, 25],
      reputation: [-10, 20],
      wealth: [-20, 0]
    }
  }
];

export const CAREER_TEMPLATES: EventTemplate[] = [
  {
    type: 'CAREER',
    probability: (character, age) => age >= 18 ? 0.3 : 0,
    baseEvent: '工作机会',
    possibleOutcomes: ['升职加薪', '维持现状', '业绩下滑'],
    impactRanges: {
      wealth: [-10, 30],
      happiness: [-15, 25],
      reputation: [-10, 20]
    }
  },
  {
    type: 'CAREER',
    probability: (character, age) => age >= 25 ? 0.2 : 0,
    baseEvent: '创业尝试',
    possibleOutcomes: ['初见成效', '举步维艰', '遭遇挫折'],
    impactRanges: {
      wealth: [-30, 50],
      happiness: [-20, 30],
      reputation: [-15, 25]
    }
  }
];

// 在现有的模板后添加新的事件模板

export const HEALTH_TEMPLATES: EventTemplate[] = [
  {
    type: 'HEALTH',
    probability: (character, age) => Math.min(0.1 + age / 200, 0.4),
    baseEvent: '身体检查',
    possibleOutcomes: ['一切正常', '发现小问题', '需要进一步检查'],
    impactRanges: {
      health: [-15, 5],
      happiness: [-10, 10],
      wealth: [-20, 0]
    }
  },
  {
    type: 'HEALTH',
    probability: (character, age) => 0.1 + (100 - character.status.health) / 200,
    baseEvent: '突发疾病',
    possibleOutcomes: ['及时治愈', '需要调养', '病情加重'],
    impactRanges: {
      health: [-30, -5],
      happiness: [-20, 0],
      wealth: [-40, -10]
    }
  }
];

export const RELATIONSHIP_TEMPLATES: EventTemplate[] = [
  {
    type: 'RELATIONSHIP',
    probability: (character, age) => 0.3 * (character.personality.extraversion / 100),
    baseEvent: '社交活动',
    possibleOutcomes: ['结识新朋友', '加深友谊', '发生小摩擦'],
    impactRanges: {
      happiness: [-5, 15],
      reputation: [-5, 10]
    }
  },
  {
    type: 'RELATIONSHIP',
    probability: (character, age) => age >= 18 ? 0.2 : 0,
    baseEvent: '恋爱机会',
    possibleOutcomes: ['陷入热恋', '暧昧不明', '错过机会'],
    impactRanges: {
      happiness: [-10, 30],
      wealth: [-10, 10]
    }
  }
];

export const ACCIDENT_TEMPLATES: EventTemplate[] = [
  {
    type: 'ACCIDENT',
    probability: (character, age) => 0.05,
    baseEvent: '交通事故',
    possibleOutcomes: ['有惊无险', '轻微受伤', '严重受伤'],
    impactRanges: {
      health: [-50, -5],
      happiness: [-30, -5],
      wealth: [-40, -10]
    }
  },
  {
    type: 'ACCIDENT',
    probability: (character, age) => 0.03,
    baseEvent: '意外事件',
    possibleOutcomes: ['及时化解', '造成损失', '严重影响'],
    impactRanges: {
      health: [-20, 0],
      happiness: [-25, -5],
      wealth: [-30, -5]
    }
  }
];

export const ACHIEVEMENT_TEMPLATES: EventTemplate[] = [
  {
    type: 'ACHIEVEMENT',
    probability: (character, age) => 0.1 * (character.skills.academic / 100),
    baseEvent: '技能突破',
    possibleOutcomes: ['获得认证', '掌握新技能', '达到专业水平'],
    impactRanges: {
      happiness: [5, 20],
      reputation: [5, 15],
      wealth: [0, 20]
    }
  },
  {
    type: 'ACHIEVEMENT',
    probability: (character, age) => 0.05 + (character.status.reputation / 200),
    baseEvent: '获得表彰',
    possibleOutcomes: ['受到嘉奖', '获得奖项', '得到认可'],
    impactRanges: {
      happiness: [10, 25],
      reputation: [10, 30],
      wealth: [5, 25]
    }
  }
];

// 更新EVENT_TEMPLATES对象
export const EVENT_TEMPLATES: Record<EventCategory, EventTemplate[]> = {
  EDUCATION: EDUCATION_TEMPLATES,
  CAREER: CAREER_TEMPLATES,
  HEALTH: HEALTH_TEMPLATES,
  RELATIONSHIP: RELATIONSHIP_TEMPLATES,
  ACCIDENT: ACCIDENT_TEMPLATES,
  ACHIEVEMENT: ACHIEVEMENT_TEMPLATES,
  WEALTH: [], // 待添加
  SOCIAL: [], // 待添加
  DISASTER: [], // 待添加
  HISTORICAL: [] // 使用historicalEvents.ts中的事件
};

// 添加事件影响计算的辅助函数
export function calculateEventImpact(
  template: EventTemplate,
  character: Character,
  outcome: string
): Record<string, number> {
  const impact = {};
  
  for (const [key, [min, max]] of Object.entries(template.impactRanges)) {
    let baseImpact = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // 根据性格特征调整影响
    if (key === 'happiness') {
      baseImpact *= (1 + (character.personality.neuroticism - 50) / 100);
    } else if (key === 'wealth') {
      baseImpact *= (1 + (character.skills.practical - 50) / 100);
    }
    
    impact[key] = Math.round(baseImpact);
  }
  
  return impact;
} 