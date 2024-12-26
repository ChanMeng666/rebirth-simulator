import React from 'react';
import { Character, NPC } from '../types/game';

interface RelationshipNetworkProps {
  character: Character;
  onRelationshipClick?: (npc: NPC) => void;
}

export default function RelationshipNetwork({ character, onRelationshipClick }: RelationshipNetworkProps) {
  const groupedRelationships = {
    FAMILY: character.status.relationships.filter(r => r.type === 'FAMILY'),
    FRIEND: character.status.relationships.filter(r => r.type === 'FRIEND'),
    ROMANCE: character.status.relationships.filter(r => r.type === 'ROMANCE'),
    WORK: character.status.relationships.filter(r => r.type === 'WORK')
  };

  const renderRelationshipGroup = (title: string, relationships: Relationship[]) => {
    if (relationships.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <div className="grid grid-cols-2 gap-2">
          {relationships.map((rel, index) => (
            <div
              key={index}
              onClick={() => onRelationshipClick?.(rel)}
              className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
            >
              <p className="font-medium">{rel.person}</p>
              <div className="flex justify-between text-sm text-gray-600">
                <span>亲密度: {rel.intimacy}</span>
                <span>{rel.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2">人际关系网</h2>
      {renderRelationshipGroup('家庭关系', groupedRelationships.FAMILY)}
      {renderRelationshipGroup('朋友关系', groupedRelationships.FRIEND)}
      {renderRelationshipGroup('恋爱关系', groupedRelationships.ROMANCE)}
      {renderRelationshipGroup('工作关系', groupedRelationships.WORK)}
    </div>
  );
} 