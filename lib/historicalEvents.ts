import { getHistoricalEra } from './ageUtils';

type EraName = keyof typeof HISTORICAL_EVENTS;

export const HISTORICAL_EVENTS = {
  "民国": [
    "军阀混战爆发，社会动荡不安",
    "新文化运动兴起，思想启蒙盛行",
    "抗日战争爆发，举国同仇敌忾"
  ],
  "建国初期": [
    "新中国成立，百业待兴",
    "土地改革运动开展",
    "工业化建设如火如荼"
  ],
  "文革时期": [
    "文化大革命开始，社会剧烈动荡",
    "知识青年上山下乡",
    "教育体系受到严重冲击"
  ],
  "改革开放初期": [
    "改革开放政策实施",
    "恢复高考制度",
    "农村实行家庭联产承包责任制",
    "第一批私营企业出现"
  ],
  "快速发展期": [
    "互联网技术迅速普及",
    "房地产市场快速发展",
    "北京申奥成功",
    "加入世贸组织"
  ],
  "新时代": [
    "移动支付普及",
    "共享经济兴起",
    "人工智能技术发展",
    "脱贫攻坚战取得胜利"
  ],
  "疫情时期": [
    "新冠疫情爆发",
    "全民居家隔离",
    "疫情防控常态化",
    "后疫情时代开启"
  ],
  "未来": [
    "元宇宙技术成熟",
    "火星移民计划启动",
    "量子计算机普及",
    "脑机接口技术突破"
  ]
} as const;

interface HistoricalEventResult {
  event: string;
  era: EraName;
}

// 获取特定年份的重大历史事件
export function getHistoricalEvent(year: number, character: any): HistoricalEventResult | null {
  const era = getHistoricalEra(year);
  if (!era) return null;

  const eraName = era.name as EraName;
  const events = HISTORICAL_EVENTS[eraName];
  if (!events) return null;

  // 根据角色属性和随机因素决定是否触发历史事件
  const shouldTrigger = Math.random() < 0.15;
  if (!shouldTrigger) return null;

  const eventIndex = Math.floor(Math.random() * events.length);
  return {
    event: events[eventIndex],
    era: eraName
  };
} 