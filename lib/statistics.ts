import { Character, LifeEvent } from '../types/game';

export interface LifeStatistics {
  significantEvents: number;
  relationshipCount: number;
  skillAchievements: number;
  wealthPeak: number;
  healthHistory: number[];
  happinessAverage: number;
  careerChanges: number;
  educationLevel: number;
}

export class StatisticsTracker {
  private character: Character;
  private events: LifeEvent[];
  private statistics: LifeStatistics;

  constructor(character: Character) {
    this.character = character;
    this.events = [];
    this.statistics = this.initializeStatistics();
  }

  private initializeStatistics(): LifeStatistics {
    return {
      significantEvents: 0,
      relationshipCount: 0,
      skillAchievements: 0,
      wealthPeak: this.character.status.wealth,
      healthHistory: [this.character.status.health],
      happinessAverage: this.character.status.happiness,
      careerChanges: 0,
      educationLevel: 0
    };
  }

  public trackEvent(event: LifeEvent): void {
    this.events.push(event);
    this.updateStatistics(event);
  }

  private updateStatistics(event: LifeEvent): void {
    // 更新重要事件计数
    if (event.isSignificant) {
      this.statistics.significantEvents++;
    }

    // 更新关系统计
    if (event.impact?.relationships?.length) {
      this.statistics.relationshipCount = this.character.status.relationships.length;
    }

    // 更新技能成就
    if (event.impact?.skills?.length) {
      this.checkSkillAchievements();
    }

    // 更新财富峰值
    if (this.character.status.wealth > this.statistics.wealthPeak) {
      this.statistics.wealthPeak = this.character.status.wealth;
    }

    // 记录健康历史
    this.statistics.healthHistory.push(this.character.status.health);

    // 更新幸福度平均值
    this.updateHappinessAverage();

    // 检查职业变动
    this.checkCareerChange(event);

    // 更新教育水平
    this.updateEducationLevel(event);
  }

  private checkSkillAchievements(): void {
    const skillThreshold = 70; // 专家级别
    let newAchievements = 0;

    Object.values(this.character.skills).forEach(value => {
      if (value >= skillThreshold) {
        newAchievements++;
      }
    });

    this.statistics.skillAchievements = newAchievements;
  }

  private updateHappinessAverage(): void {
    const totalHappiness = this.events.reduce((sum, event) => {
      return sum + (event.impact?.happiness || 0);
    }, this.character.status.happiness);

    this.statistics.happinessAverage = totalHappiness / (this.events.length + 1);
  }

  private checkCareerChange(event: LifeEvent): void {
    if (event.type === 'CAREER' && event.event.includes('转行')) {
      this.statistics.careerChanges++;
    }
  }

  private updateEducationLevel(event: LifeEvent): void {
    const educationLevels = {
      '小学': 1,
      '初中': 2,
      '高中': 3,
      '大学': 4,
      '研究生': 5,
      '博士': 6
    };

    if (event.type === 'EDUCATION') {
      for (const [level, value] of Object.entries(educationLevels)) {
        if (event.event.includes(level) && value > this.statistics.educationLevel) {
          this.statistics.educationLevel = value;
          break;
        }
      }
    }
  }

  public getStatistics(): LifeStatistics {
    return { ...this.statistics };
  }

  public generateLifeReport(): string {
    const stats = this.statistics;
    return `
生涯总结：
- 经历重大事件：${stats.significantEvents}次
- 建立人际关系：${stats.relationshipCount}个
- 掌握专业技能：${stats.skillAchievements}项
- 最高财富水平：${stats.wealthPeak}
- 平均幸福指数：${Math.round(stats.happinessAverage)}
- 职业变动次数：${stats.careerChanges}次
- 最终教育水平：${this.getEducationLevelText(stats.educationLevel)}
    `.trim();
  }

  private getEducationLevelText(level: number): string {
    const levels = ['无', '小学', '初中', '高中', '大学', '研究生', '博士'];
    return levels[level] || '未知';
  }
} 