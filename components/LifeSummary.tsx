import React from 'react';
import { type Character, type LifeEvent } from '../types/game';
import { getAgeStage, AGE_STAGES } from '../lib/ageUtils';

interface LifeSummaryProps {
  character: Character;
  events: LifeEvent[];
  onRestart: () => void;
}

export default function LifeSummary({ character, events, onRestart }: LifeSummaryProps) {
  const finalAge = events[events.length - 1]?.age || 0;
  const ageStage = getAgeStage(finalAge);
  
  const getLifeQuality = () => {
    const significantEvents = events.filter(e => e.isSignificant).length;
    const lifespan = finalAge / AGE_STAGES.ELDER.max;
    const score = (significantEvents * 0.6 + lifespan * 0.4) * 100;
    
    if (score >= 80) return '传奇人生';
    if (score >= 60) return '圆满人生';
    if (score >= 40) return '平凡人生';
    return '坎坷人生';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2">人生总结</h2>
      
      <div className="space-y-4 mb-6">
        <p className="text-lg">
          享年: <span className="font-semibold">{finalAge}岁</span>
        </p>
        <p className="text-lg">
          人生评价: <span className="font-semibold">{getLifeQuality()}</span>
        </p>
        <p className="text-gray-600 italic">
          {character.gender}主角以{character.appearance}的外貌、{character.intelligence}的智力和{character.strength}的体魄，
          经历了{events.length}个人生事件，最终在{finalAge}岁时结束了这一生。
        </p>
      </div>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          重新开始
        </button>
      </div>
    </div>
  );
} 