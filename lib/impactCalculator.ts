import { Character, LifeEvent } from '../types/game';

interface ImpactFactors {
  baseImpact: number;
  personalityMultiplier: number;
  attributeMultiplier: number;
  randomVariation: number;
}

// 计算最终影响值
function calculateFinalImpact(factors: ImpactFactors): number {
  return Math.round(
    factors.baseImpact * 
    factors.personalityMultiplier * 
    factors.attributeMultiplier * 
    factors.randomVariation
  );
}

// 获取性格对学习的影响系数
function getPersonalityLearningMultiplier(character: Character): number {
  const { openness, conscientiousness } = character.personality;
  return (0.5 + (openness + conscientiousness) / 200);
}

// 获取性格对关系的影响系数
function getPersonalityRelationshipMultiplier(character: Character): number {
  const { extraversion, agreeableness } = character.personality;
  return (0.5 + (extraversion + agreeableness) / 200);
}

// 计算事件总体影响
export function calculateEventImpact(event: LifeEvent, character: Character): void {
  switch (event.type) {
    case 'EDUCATION':
      calculateEducationImpact(event, character);
      break;
    case 'CAREER':
      calculateCareerImpact(event, character);
      break;
    case 'RELATIONSHIP':
      calculateRelationshipImpact(event, character);
      break;
    case 'HEALTH':
      calculateHealthImpact(event, character);
      break;
    // ... 其他事件类型
  }
}

// 计算教育事件影响
function calculateEducationImpact(event: LifeEvent, character: Character): void {
  const baseImpact = 10;
  const learningMultiplier = getPersonalityLearningMultiplier(character);
  const intelligenceMultiplier = 0.5 + character.attributes.intelligence / 100;
  
  event.impact.skills = [{
    skill: 'academic',
    change: calculateFinalImpact({
      baseImpact,
      personalityMultiplier: learningMultiplier,
      attributeMultiplier: intelligenceMultiplier,
      randomVariation: 0.8 + Math.random() * 0.4
    })
  }];
  
  event.impact.happiness = Math.round(
    (character.personality.conscientiousness / 100) * (Math.random() * 10)
  );
}

// 计算职业事件影响
function calculateCareerImpact(event: LifeEvent, character: Character): void {
  const baseWealthChange = 15;
  const careerMultiplier = 0.5 + (character.skills.practical + character.skills.social) / 200;
  
  event.impact.wealth = calculateFinalImpact({
    baseImpact: baseWealthChange,
    personalityMultiplier: character.personality.conscientiousness / 100,
    attributeMultiplier: careerMultiplier,
    randomVariation: 0.7 + Math.random() * 0.6
  });
  
  event.impact.reputation = Math.round(event.impact.wealth / 2);
}

// 计算关系事件影响
function calculateRelationshipImpact(event: LifeEvent, character: Character): void {
  const baseIntimacyChange = 20;
  const socialMultiplier = 0.5 + character.skills.social / 100;
  
  event.impact.relationships = [{
    person: "新朋友", // 这里应该根据具体情况生成
    intimacyChange: calculateFinalImpact({
      baseImpact: baseIntimacyChange,
      personalityMultiplier: getPersonalityRelationshipMultiplier(character),
      attributeMultiplier: socialMultiplier,
      randomVariation: 0.6 + Math.random() * 0.8
    })
  }];
  
  event.impact.happiness = Math.round(
    (character.personality.extraversion / 100) * (Math.random() * 15)
  );
}

// 计算健康事件影响
function calculateHealthImpact(event: LifeEvent, character: Character): void {
  const baseHealthChange = -15;
  const healthMultiplier = 0.5 + character.attributes.health / 100;
  
  event.impact.health = calculateFinalImpact({
    baseImpact: baseHealthChange,
    personalityMultiplier: 1 - (character.personality.neuroticism / 200),
    attributeMultiplier: healthMultiplier,
    randomVariation: 0.7 + Math.random() * 0.6
  });
  
  event.impact.happiness = Math.round(event.impact.health / 2);
  
  // 检查是否可能导致死亡
  if (character.attributes.health + (event.impact.health || 0) <= 0) {
    event.isDeath = true;
  }
} 