import { Character, NPC, Relationship, LifeEvent } from '../types/game';
import { generateNPC } from './npcGenerator';

export class RelationshipManager {
  private character: Character;

  constructor(character: Character) {
    this.character = character;
  }

  // 添加新的NPC关系
  public addNewRelationship(type: RelationType): NPC {
    const npc = generateNPC(type, this.character.status.age);
    this.character.status.relationships.push(npc.relationship);
    return npc;
  }

  // 更新关系状态
  public updateRelationship(event: LifeEvent): void {
    if (!event.impact?.relationships) return;

    event.impact.relationships.forEach(change => {
      const relationship = this.character.status.relationships.find(
        r => r.person === change.person
      );

      if (relationship) {
        // 更新亲密度
        relationship.intimacy = Math.max(0, Math.min(100,
          relationship.intimacy + change.intimacyChange
        ));

        // 更新关系状态
        this.updateRelationshipStatus(relationship);

        // 记录事件
        relationship.events.push(event.event);
      }
    });
  }

  // 根据亲密度更新关系状态
  private updateRelationshipStatus(relationship: Relationship): void {
    if (relationship.intimacy < 20) {
      relationship.status = 'ENDED';
    } else if (relationship.intimacy < 40) {
      relationship.status = 'ESTRANGED';
    } else {
      relationship.status = 'ACTIVE';
    }
  }

  // 获取所有活跃关系
  public getActiveRelationships(): Relationship[] {
    return this.character.status.relationships.filter(
      r => r.status === 'ACTIVE'
    );
  }

  // 计算关系对事件的影响
  public calculateRelationshipEffect(event: LifeEvent): void {
    const activeRelationships = this.getActiveRelationships();
    const supportLevel = activeRelationships.reduce(
      (sum, rel) => sum + (rel.intimacy / 100), 0
    );

    // 社交支持系统对事件影响的调整
    if (event.impact) {
      if (event.impact.happiness) {
        event.impact.happiness *= (1 + supportLevel * 0.2);
      }
      if (event.impact.health && event.impact.health < 0) {
        event.impact.health *= (1 - supportLevel * 0.1);
      }
    }
  }
} 