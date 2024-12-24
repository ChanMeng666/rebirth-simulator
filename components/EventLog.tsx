import React from 'react';
import { type LifeEvent } from '../types/game';

interface EventLogProps {
  events: LifeEvent[];
}

export default function EventLog({ events }: EventLogProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2">人生经历</h2>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div 
            key={index}
            className={`p-4 rounded ${
              event.isDeath ? 'bg-red-50' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold">{event.age}岁</span>
              <p className="flex-1">{event.event}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 