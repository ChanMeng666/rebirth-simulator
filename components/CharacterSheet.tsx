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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-gray-700">
            出生年份: <span className="font-semibold">{birthYear}年</span>
          </p>
          <p className="text-gray-700">
            性别: <span className="font-semibold">{character.gender}</span>
          </p>
          <p className="text-gray-700">
            外貌: {renderAttribute(character.appearance)}
          </p>
          <p className="text-gray-700">
            智力: {renderAttribute(character.intelligence)}
          </p>
          <p className="text-gray-700">
            体力: {renderAttribute(character.strength)}
          </p>
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-700">
            天赋: <span className="font-semibold">
              {character.talent.length > 0 ? character.talent.join('、') : '未知'}
            </span>
          </p>
          <p className="text-gray-700">
            性格: <span className="font-semibold">
              {character.personality || '未知'}
            </span>
          </p>
          <p className="text-gray-700">
            家庭背景: <span className="font-semibold">
              {character.familyBackground || '未知'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
} 