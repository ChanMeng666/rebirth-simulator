import { Character } from '../types/game';

interface HistoricalEvent {
  year: number;
  event: string;
  era: string;
  impact: {
    society: number; // 1-10，社会影响程度
    personal: number; // 1-10，个人影响程度
  };
}

const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    year: 1911,
    event: '辛亥革命爆发',
    era: '民国初期',
    impact: { society: 10, personal: 8 }
  },
  {
    year: 1937,
    event: '抗日战争全面爆发',
    era: '抗战时期',
    impact: { society: 10, personal: 9 }
  },
  {
    year: 1949,
    event: '中华人民共和国成立',
    era: '新中国',
    impact: { society: 10, personal: 8 }
  },
  {
    year: 1966,
    event: '文化大革命开始',
    era: '文革时期',
    impact: { society: 9, personal: 9 }
  },
  {
    year: 1978,
    event: '改革开放政策实施',
    era: '改革开放',
    impact: { society: 9, personal: 7 }
  },
  {
    year: 2001,
    event: '中国加入世界贸易组织',
    era: '全球化',
    impact: { society: 8, personal: 6 }
  },
  {
    year: 2008,
    event: '北京奥运会举办',
    era: '新时代',
    impact: { society: 7, personal: 5 }
  },
  {
    year: 2020,
    event: '新冠疫情爆发',
    era: '后疫情时代',
    impact: { society: 9, personal: 8 }
  }
];

export function getHistoricalEra(year: number): string {
  for (let i = HISTORICAL_EVENTS.length - 1; i >= 0; i--) {
    if (year >= HISTORICAL_EVENTS[i].year) {
      return HISTORICAL_EVENTS[i].era;
    }
  }
  return '近代';
}

export function getHistoricalEvent(year: number, character: Character): { event: string; era: string } | null {
  // 查找该年份的历史事件
  const event = HISTORICAL_EVENTS.find(e => e.year === year);
  if (!event) return null;

  // 根据角色特征调整事件描述
  let eventDescription = event.event;
  const personalImpact = calculatePersonalImpact(event, character);

  if (personalImpact > 7) {
    eventDescription += getPersonalizedImpact(event, character);
  }

  return {
    event: eventDescription,
    era: event.era
  };
}

function calculatePersonalImpact(event: HistoricalEvent, character: Character): number {
  let impact = event.impact.personal;

  // 根据角色的社会阶层调整影响
  if (character.familyBackground.socialClass === '上层') {
    impact *= 1.2;
  } else if (character.familyBackground.socialClass === '下层') {
    impact *= 0.8;
  }

  // 根据角色的性格特征调整影响
  if (character.personality.openness > 70) {
    impact *= 1.1;
  }

  return Math.min(10, impact);
}

function getPersonalizedImpact(event: HistoricalEvent, character: Character): string {
  const impacts = {
    '辛亥革命': {
      '上层': '，家族地位受到动荡',
      '中层': '，生活方式发生改变',
      '下层': '，看到了新的希望'
    },
    '抗日战争': {
      '上层': '，不得不举家迁移',
      '中层': '，生活陷入困境',
      '下层': '，参与到抗战中'
    },
    // ... 其他历史事件的个性化影响
  };

  const eventKey = Object.keys(impacts).find(key => event.event.includes(key));
  if (!eventKey) return '';

  return impacts[eventKey][character.familyBackground.socialClass] || '';
} 