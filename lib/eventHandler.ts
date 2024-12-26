import { Character, LifeEvent } from '../types/game';
import { RelationshipManager } from './relationshipManager';
import { SkillProgressionSystem } from './skillProgressionSystem';
import { calculateEventImpact } from './impactCalculator';
import { StatisticsTracker } from './statistics';

export class EventHandler {
  private character: Character;
  private relationshipManager: RelationshipManager;
  private skillSystem: SkillProgressionSystem;
  private statisticsTracker: StatisticsTracker;

  constructor(character: Character) {
    this.character = character;
    this.relationshipManager = new RelationshipManager(character);
    this.skillSystem = new SkillProgressionSystem(character);
    this.statisticsTracker = new StatisticsTracker(character);
  }

  public processEvent(event: LifeEvent): void {
    // 计算事件影响
    calculateEventImpact(event, this.character);
    
    // 处理关系影响
    this.relationshipManager.calculateRelationshipEffect(event);
    this.relationshipManager.updateRelationship(event);
    
    // 处理技能进展
    this.skillSystem.updateSkills(event);
    
    // 更新角色状态
    this.updateCharacterStatus(event);
    
    // 更新统计数据
    this.statisticsTracker.trackEvent(event);
  }

  private updateCharacterStatus(event: LifeEvent): void {
    if (!event.impact) return;

    const { health, wealth, happiness, reputation } = event.impact;

    if (health) {
      this.character.status.health = Math.max(0, Math.min(100,
        this.character.status.health + health
      ));
    }

    if (wealth) {
      this.character.status.wealth = Math.max(0, Math.min(100,
        this.character.status.wealth + wealth
      ));
    }

    if (happiness) {
      this.character.status.happiness = Math.max(0, Math.min(100,
        this.character.status.happiness + happiness
      ));
    }

    if (reputation) {
      this.character.status.reputation = Math.max(0, Math.min(100,
        this.character.status.reputation + reputation
      ));
    }

    // 检查是否触发死亡
    if (this.character.status.health <= 0) {
      event.isDeath = true;
    }
  }

  // 获取当前状态报告
  public getStatusReport() {
    return {
      skills: this.skillSystem.getSkillProgressReport(),
      relationships: this.relationshipManager.getActiveRelationships(),
      status: { ...this.character.status },
      statistics: this.statisticsTracker.getStatistics()
    };
  }
} 