// 定义不同年龄段的事件类型和概率
export const AGE_STAGES = {
  INFANT: { min: 0, max: 3, deathRate: 0.001 },
  CHILD: { min: 4, max: 12, deathRate: 0.0005 },
  TEEN: { min: 13, max: 18, deathRate: 0.001 },
  YOUNG_ADULT: { min: 19, max: 35, deathRate: 0.002 },
  ADULT: { min: 36, max: 60, deathRate: 0.005 },
  ELDER: { min: 61, max: 100, deathRate: 0.02 }
} as const;

// 获取当前年龄段的基础死亡率
function getBaseDeathRate(age: number) {
  const stage = Object.values(AGE_STAGES).find(
    stage => age >= stage.min && age <= stage.max
  );
  return stage?.deathRate || 0.02;
}

// 计算死亡概率
export function getDeathProbability(age: number, strength: number) {
  const baseRate = getBaseDeathRate(age);
  const ageEffect = Math.max(0, (age - 70) / 100); // 70岁后开始增加死亡概率
  const strengthEffect = (100 - strength) / 400; // 降低体力对死亡的影响
  
  return Math.min(0.8, baseRate + ageEffect + strengthEffect); // 最高80%概率
}

interface HistoricalEra {
  start: number;
  end: number;
  name: string;
}

// 获取当前所处的历史年代
export function getHistoricalEra(birthYear: number): HistoricalEra | null {
  const eras: HistoricalEra[] = [
    { start: 1900, end: 1949, name: "民国" },
    { start: 1950, end: 1965, name: "建国初期" },
    { start: 1966, end: 1976, name: "文革时期" },
    { start: 1977, end: 1991, name: "改革开放初期" },
    { start: 1992, end: 2011, name: "快速发展期" },
    { start: 2012, end: 2019, name: "新时代" },
    { start: 2020, end: 2023, name: "疫情时期" },
    { start: 2024, end: 2100, name: "未来" }
  ];
  
  return eras.find(era => birthYear >= era.start && birthYear <= era.end) || null;
}

// 获取当前年龄段
export function getAgeStage(age: number) {
  if (age <= AGE_STAGES.INFANT.max) return 'INFANT';
  if (age <= AGE_STAGES.CHILD.max) return 'CHILD';
  if (age <= AGE_STAGES.TEEN.max) return 'TEEN';
  if (age <= AGE_STAGES.YOUNG_ADULT.max) return 'YOUNG_ADULT';
  if (age <= AGE_STAGES.ADULT.max) return 'ADULT';
  return 'ELDER';
} 