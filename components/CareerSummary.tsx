import React from 'react';
import { LifeStatistics } from '../lib/statistics';

interface CareerSummaryProps {
  statistics: LifeStatistics;
}

export default function CareerSummary({ statistics }: CareerSummaryProps) {
  const renderStatisticItem = (label: string, value: number | string) => (
    <div className="flex justify-between items-center py-2 border-b">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2">生涯统计</h2>
      
      <div className="space-y-2">
        {renderStatisticItem('重大事件', `${statistics.significantEvents}次`)}
        {renderStatisticItem('人际关系', `${statistics.relationshipCount}个`)}
        {renderStatisticItem('专业技能', `${statistics.skillAchievements}项`)}
        {renderStatisticItem('最高财富', statistics.wealthPeak)}
        {renderStatisticItem('平均幸福指数', Math.round(statistics.happinessAverage))}
        {renderStatisticItem('职业变动', `${statistics.careerChanges}次`)}
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">健康状况趋势</h3>
          <div className="h-24 flex items-end">
            {statistics.healthHistory.map((health, index) => (
              <div
                key={index}
                className="w-2 mx-px bg-green-500 transition-all duration-300"
                style={{ height: `${health}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 