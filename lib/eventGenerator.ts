import { Character, LifeEvent } from '../types/game';
import { getEventProbabilities, generateEventFromTemplate } from './eventTypes';
import { getHistoricalEvent } from './historicalEvents';
import { RelationshipManager } from './relationshipManager';

export class EventGenerator {
  private character: Character;
  private relationshipManager: RelationshipManager;

  constructor(character: Character) {
    this.character = character;
    this.relationshipManager = new RelationshipManager(character);
  }

  public async generateEvent(age: number): Promise<LifeEvent> {
    // 获取可能的事件类型
    const possibleEvents = getEventProbabilities(this.character, age);
    
    // 获取历史事件
    const birthYear = this.character.birthYear || 2000;
    const historicalEvent = getHistoricalEvent(birthYear + age, this.character);
    
    // 如果有历史事件，优先生成历史事件
    if (historicalEvent) {
      return {
        age,
        type: 'HISTORICAL',
        event: historicalEvent.event,
        impact: {
          happiness: Math.floor(Math.random() * 20) - 10,
          health: Math.floor(Math.random() * 10) - 5
        },
        isSignificant: true
      };
    }

    // 根据年龄段生成合适的事件
    if (age <= 3) {
      return this.generateInfantEvent(age);
    } else if (age <= 6) {
      return this.generatePreschoolEvent(age);
    } else if (age <= 12) {
      return this.generatePrimarySchoolEvent(age);
    } else if (age <= 15) {
      return this.generateTeenageEvent(age);
    } else if (age <= 18) {
      return this.generateHighSchoolEvent(age);
    } else if (age <= 25) {
      return this.generateYoungAdultEvent(age);
    } else {
      // 使用模板系统生成事件
      const eventType = this.selectEventType(age);
      const baseEvent = generateEventFromTemplate(eventType, this.character, age);
      return {
        age,
        ...baseEvent
      } as LifeEvent;
    }
  }

  private generateInfantEvent(age: number): LifeEvent {
    const events = [
      '学会了走路',
      '说出了第一个词',
      '开始认识周围的世界',
      '和家人建立了深厚的感情'
    ];

    return {
      age,
      type: 'ACHIEVEMENT',
      event: events[Math.floor(Math.random() * events.length)],
      impact: {
        happiness: 10,
        health: 5
      }
    };
  }

  private generatePreschoolEvent(age: number): LifeEvent {
    const events = [
      '开始上幼儿园',
      '交到了第一个好朋友',
      '展现出艺术天赋',
      '参加了幼儿园活动',
      '学会了简单的算数',
      '开始对周围世界产生好奇'
    ];

    return {
      age,
      type: 'EDUCATION',
      event: events[Math.floor(Math.random() * events.length)],
      impact: {
        happiness: Math.floor(Math.random() * 10) + 5,
        skills: [{
          skill: 'social',
          change: Math.floor(Math.random() * 5) + 1
        }]
      }
    };
  }

  private generatePrimarySchoolEvent(age: number): LifeEvent {
    const events = [
      '开始上小学',
      '在某门课程中表现出色',
      '参加了兴趣班',
      '获得了小小奖项',
      '和同学打成一片',
      '开始培养自己的兴趣爱好'
    ];

    const skills: Array<keyof Character['skills']> = [
      '学术',
      '艺术',
      '体育',
      '社交',
      '实践'
    ];

    const randomSkill = skills[Math.floor(Math.random() * skills.length)];

    return {
      age,
      type: 'EDUCATION',
      event: events[Math.floor(Math.random() * events.length)],
      impact: {
        happiness: Math.floor(Math.random() * 15) + 5,
        skills: [{
          skill: randomSkill,
          change: Math.floor(Math.random() * 8) + 3
        }]
      }
    };
  }

  private generateTeenageEvent(age: number): LifeEvent {
    const events = [
      '进入初中学习',
      '参加了学校社团',
      '在考试中取得好成绩',
      '经历了青春期困惑',
      '发现了自己的特长',
      '和朋友有了深入交流'
    ];

    return {
      age,
      type: 'EDUCATION',
      event: events[Math.floor(Math.random() * events.length)],
      impact: {
        happiness: Math.floor(Math.random() * 20) - 5,
        reputation: Math.floor(Math.random() * 10),
        skills: [{
          skill: 'academic',
          change: Math.floor(Math.random() * 10) + 5
        }]
      }
    };
  }

  private generateHighSchoolEvent(age: number): LifeEvent {
    const events = [
      '开始高中生活',
      '为高考做准备',
      '参加了重要比赛',
      '确定了未来目标',
      '收获了珍贵友情',
      '经历了成长蜕变'
    ];

    return {
      age,
      type: 'EDUCATION',
      event: events[Math.floor(Math.random() * events.length)],
      impact: {
        happiness: Math.floor(Math.random() * 20) - 10,
        reputation: Math.floor(Math.random() * 15),
        skills: [{
          skill: 'academic',
          change: Math.floor(Math.random() * 12) + 8
        }]
      }
    };
  }

  private generateYoungAdultEvent(age: number): LifeEvent {
    const events = [
      '进入大学学习',
      '开始找工作',
      '谈了一场恋爱',
      '尝试创业项目',
      '规划未来道路',
      '培养专业技能'
    ];

    return {
      age,
      type: 'CAREER',
      event: events[Math.floor(Math.random() * events.length)],
      impact: {
        happiness: Math.floor(Math.random() * 30) - 10,
        wealth: Math.floor(Math.random() * 20) - 5,
        reputation: Math.floor(Math.random() * 20),
        skills: [{
          skill: 'practical',
          change: Math.floor(Math.random() * 15) + 5
        }]
      }
    };
  }

  private selectEventType(age: number): EventCategory {
    const possibleEvents = getEventProbabilities(this.character, age);
    return possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
  }
} 