import React from 'react';
import { NPC } from '../types/game';

interface NPCDetailModalProps {
  npc: NPC | null;
  onClose: () => void;
}

export default function NPCDetailModal({ npc, onClose }: NPCDetailModalProps) {
  if (!npc) return null;

  const getRelationshipStatus = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '关系稳定';
      case 'ESTRANGED': return '关系疏远';
      case 'ENDED': return '关系结束';
      default: return '未知状态';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">角色详情</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">基本信息</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>性别：{npc.biologicalSex}</p>
              <p>年龄：{npc.age}岁</p>
              <p>职业：{npc.occupation}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">性格特征</h4>
            <div className="flex flex-wrap gap-2">
              {npc.traits.map((trait, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 rounded text-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">关系状态</h4>
            <div className="space-y-2">
              <p>关系类型：{npc.relationship.type}</p>
              <p>亲密度：{npc.relationship.intimacy}</p>
              <p>持续时间：{npc.relationship.duration}年</p>
              <p>当前状态：{getRelationshipStatus(npc.relationship.status)}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">互动历史</h4>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {npc.relationship.events.map((event, index) => (
                <p key={index} className="text-sm text-gray-600">
                  {event}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 