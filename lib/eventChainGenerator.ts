import { Character, LifeEvent, NPC } from '../types/game';
import { generateNPC } from './npcGenerator';

interface EventChain {
  trigger: LifeEvent;
  followUps: LifeEvent[];
}

export class EventChainGenerator {
  private character: Character;
  private eventHistory: LifeEvent[];

  constructor(character: Character, eventHistory: LifeEvent[] = []) {
    this.character = character;
    this.eventHistory = eventHistory;
  }

  // 生成关系事件链
  public generateRelationshipChain(npc: NPC): EventChain {
    const trigger = this.generateRelationshipTrigger(npc);
    const followUps = this.generateFollowUpEvents(trigger, npc);

    return { trigger, followUps };
  }

  // 生成关系事件触发器
  private generateRelationshipTrigger(npc: NPC): LifeEvent {
    const eventTypes = {
      FAMILY: ['家庭聚会', '家庭矛盾', '家族事务'],
      FRIEND: ['社交活动', '共同爱好', '互助互惠'],
      ROMANCE: ['浪漫约会', '感情危机', '重要决定'],
      WORK: ['工作合作', '职场竞争', '团队建设']
    };

    const possibleEvents = eventTypes[npc.relationship.type];
    const eventBase = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];

    return {
      age: this.character.status.age,
      type: 'RELATIONSHIP',
      event: `与${npc.id}发生${eventBase}事件`,
      impact: {
        relationships: [{
          person: npc.id,
          intimacyChange: Math.floor(Math.random() * 20) - 5
        }],
        happiness: Math.floor(Math.random() * 10)
      }
    };
  }

  // 生成后续事件
  private generateFollowUpEvents(trigger: LifeEvent, npc: NPC): LifeEvent[] {
    const followUps: LifeEvent[] = [];
    const shouldGenerateFollowUp = Math.random() < 0.7;

    if (shouldGenerateFollowUp) {
      const followUpEvent = this.generateFollowUpEvent(trigger, npc);
      followUps.push(followUpEvent);
    }

    return followUps;
  }

  // 生成单个后续事件
  private generateFollowUpEvent(trigger: LifeEvent, npc: NPC): LifeEvent {
    // 根据触发事件和NPC关系生成适当的后续事件
    return {
      age: this.character.status.age + 1,
      type: 'RELATIONSHIP',
      event: `后续事件：与${npc.id}的关系发展`,
      impact: {
        relationships: [{
          person: npc.id,
          intimacyChange: Math.floor(Math.random() * 15) - 5
        }],
        happiness: Math.floor(Math.random() * 8) - 2
      }
    };
  }
} 