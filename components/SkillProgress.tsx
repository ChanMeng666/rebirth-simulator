import React from 'react';
import { Character } from '../types/game';

interface SkillProgressProps {
  character: Character;
}

export default function SkillProgress({ character }: SkillProgressProps) {
  const skillLabels: Record<string, string> = {
    学术: '学术能力',
    艺术: '艺术天赋',
    体育: '运动能力',
    社交: '社交技巧',
    实践: '实践技能'
  };

  const skillLevels: Record<number, string> = {
    0: '无',
    10: '新手',
    30: '入门',
    50: '熟练',
    70: '精通',
    90: '大师'
  };

  const getSkillLevel = (value: number): string => {
    if (value >= 90) return '大师';
    if (value >= 70) return '专家';
    if (value >= 50) return '熟练';
    if (value >= 30) return '入门';
    return '新手';
  };

  const getProgressColor = (value: number): string => {
    if (value >= 90) return 'bg-purple-500';
    if (value >= 70) return 'bg-blue-500';
    if (value >= 50) return 'bg-green-500';
    if (value >= 30) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2">技能进展</h2>
      
      <div className="space-y-4">
        {Object.entries(character.skills).map(([skill, value]) => (
          <div key={skill} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">{skillLabels[skill] || skill}</span>
              <span className="text-sm text-gray-600">
                {getSkillLevel(value)} ({value})
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${getProgressColor(value)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 