import { Character, LifeEvent } from '../types/game';
import {
  EDUCATION_TEMPLATES,
  CAREER_TEMPLATES,
  // ... 导入其他模板
} from './eventTemplates';

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

interface EventTemplate {
  type: EventCategory;
  probability: (character: Character, age: number) => number;
  baseEvent: string;
  possibleOutcomes: string[];
  impactRanges: {
    health?: [number, number];
    wealth?: [number, number];
    happiness?: [number, number];
    reputation?: [number, number];
  };
}

export const EVENT_TEMPLATES: Record<EventCategory, EventTemplate[]> = {
  EDUCATION: EDUCATION_TEMPLATES,
  CAREER: CAREER_TEMPLATES,
  // ... 使用其他导入的模板
};

export function getEventProbabilities(character: Character, age: number): EventCategory[] {
  const probabilities: [EventCategory, number][] = Object.entries(EVENT_TEMPLATES)
    .map(([category, templates]) => {
      const maxProb = Math.max(...templates.map(t => t.probability(character, age)));
      return [category as EventCategory, maxProb];
    });

  // 根据概率随机选择事件类型
  return probabilities
    .filter(([_, prob]) => Math.random() < prob)
    .map(([category]) => category);
}

export function generateEventFromTemplate(
  category: EventCategory,
  character: Character,
  age: number
): Partial<LifeEvent> {
  const templates = EVENT_TEMPLATES[category];
  const template = templates[Math.floor(Math.random() * templates.length)];
  const outcome = template.possibleOutcomes[
    Math.floor(Math.random() * template.possibleOutcomes.length)
  ];

  const impact = Object.entries(template.impactRanges).reduce((acc, [key, [min, max]]) => {
    acc[key] = Math.floor(Math.random() * (max - min + 1)) + min;
    return acc;
  }, {} as Record<string, number>);

  return {
    type: category,
    event: `${template.baseEvent}：${outcome}`,
    impact,
    isSignificant: Math.random() < 0.2
  };
} 