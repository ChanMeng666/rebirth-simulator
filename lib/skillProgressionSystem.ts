import { Character, LifeEvent } from '../types/game';

export class SkillProgressionSystem {
  private character: Character;

  constructor(character: Character) {
    this.character = character;
  }

  // 更新技能
  public updateSkills(event: LifeEvent): void {
    if (!event.impact?.skills) return;

    event.impact.skills.forEach(change => {
      const skillMap = {
        academic: '学术',
        artistic: '艺术',
        athletic: '体育',
        social: '社交',
        practical: '实践'
      };
      
      const chineseSkill = skillMap[change.skill] || change.skill;
      const currentSkill = this.character.skills[chineseSkill];
      const learningRate = this.calculateLearningRate(chineseSkill);
      
      this.character.skills[chineseSkill] = Math.max(0, Math.min(100,
        currentSkill + (change.change * learningRate)
      ));
    });
  }

  // 计算学习效率
  private calculateLearningRate(skill: keyof Character['skills']): number {
    const baseRate = 1.0;
    const intelligenceBonus = this.character.attributes.intelligence / 200;
    const personalityBonus = this.calculatePersonalityBonus();
    
    return baseRate + intelligenceBonus + personalityBonus;
  }

  // 计算性格对学习的影响
  private calculatePersonalityBonus(): number {
    const { openness, conscientiousness } = this.character.personality;
    return (openness + conscientiousness) / 400;
  }

  // 获取技能进展报告
  public getSkillProgressReport(): Record<keyof Character['skills'], number> {
    return { ...this.character.skills };
  }
} 