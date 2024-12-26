import React from 'react';
import { type Character } from '../types/game'

interface CharacterSheetProps {
  character: Character | null;
  birthYear: number;
}

export default function CharacterSheet({ character, birthYear }: CharacterSheetProps) {
  if (!character) return null;

  const renderAttribute = (value: number) => {
    const getColor = (v: number) => {
      if (v >= 80) return 'text-green-600';
      if (v >= 60) return 'text-blue-600';
      if (v >= 40) return 'text-yellow-600';
      return 'text-red-600';
    };

    return (
      <span className={`font-bold ${getColor(value)}`}>
        {value}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2">角色信息</h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-3">基本信息</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">生理性别：</span>{character.biologicalSex}</p>
              <p><span className="font-medium">性别认同：</span>{character.genderIdentity}</p>
              <p><span className="font-medium">性取向：</span>{character.sexualOrientation}</p>
            </div>
            <div>
              <p><span className="font-medium">出生年份：</span>{character.birthYear}</p>
              <p><span className="font-medium">出生地：</span>{character.birthPlace.country}</p>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-3">家庭背景</h3>
          <div className="space-y-2">
            <p>社会阶层: {character.familyBackground.socialClass}</p>
            <p>经济状况: {renderAttribute(character.familyBackground.economicStatus)}</p>
            <p>父母状况: {character.familyBackground.parentalStatus}</p>
            <p>家庭结构: {character.familyBackground.familyStructure}</p>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">天赋属性</h3>
          <div className="space-y-2">
            {Object.entries(character.talents).map(([key, value]) => (
              <p key={key}>{key}: {renderAttribute(value)}</p>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">当前状态</h3>
          <div className="space-y-2">
            <p>教育程度: {character.status.education}</p>
            <p>职业: {character.status.career}</p>
            <p>财富: {renderAttribute(character.status.wealth)}</p>
            <p>声望: {renderAttribute(character.status.reputation)}</p>
            <p>幸福指数: {renderAttribute(character.status.happiness)}</p>
            <p>健康状况: {renderAttribute(character.status.health)}</p>
          </div>
        </section>
      </div>
    </div>
  );
} 