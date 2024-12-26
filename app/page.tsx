'use client';
import { useState, useRef } from 'react';
import CharacterSheet from '../components/CharacterSheet';
import EventLog from '../components/EventLog';
import { type Character, type LifeEvent, type NPC } from '../types/game';
import LifeSummary from '../components/LifeSummary';
import RelationshipNetwork from '../components/RelationshipNetwork';
import { EventChainGenerator } from '../lib/eventChainGenerator';
import NPCDetailModal from '../components/NPCDetailModal';
import SkillProgress from '../components/SkillProgress';
import { EventHandler } from '../lib/eventHandler';

export default function Home() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [currentAge, setCurrentAge] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [birthYear, setBirthYear] = useState(1900);
  const latestEventRef = useRef<HTMLDivElement>(null);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [eventHandler, setEventHandler] = useState<EventHandler | null>(null);

  const startGame = async () => {
    try {
      setIsLoading(true);
      const randomBirthYear = Math.floor(Math.random() * (2024 - 1900 + 1)) + 1900;
      setBirthYear(randomBirthYear);

      const response = await fetch('/api/generate-character', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.character) {
        setCharacter(data.character);
        setEventHandler(new EventHandler(data.character));
        setEvents([]);
        setCurrentAge(0);
        setIsGameOver(false);
      }
    } catch (error) {
      console.error('开始游戏失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNextEvent = async () => {
    if (!character || !eventHandler || isGameOver) return;

    try {
      setIsLoading(true);
      const nextAge = currentAge + 1;
      const response = await fetch('/api/generate-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character,
          age: nextAge,
          history: events,
          birthYear
        }),
      });

      const data = await response.json();
      if (data.event) {
        const newEvent = data.event;
        eventHandler.processEvent(newEvent);
        setEvents(prev => [...prev, newEvent]);
        setCurrentAge(nextAge);
        
        if (newEvent.isDeath) {
          setIsGameOver(true);
        }
      }

      setTimeout(() => {
        latestEventRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);

    } catch (error) {
      console.error('生成事件失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const restartGame = () => {
    setCharacter(null);
    setEvents([]);
    setCurrentAge(0);
    setIsGameOver(false);
  };

  const handleRelationshipClick = (npc: NPC) => {
    setSelectedNPC(npc);
    // 可以在这里添加显示NPC详细信息的逻辑
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">重生模拟器</h1>
        
        {!character && (
          <div className="text-center">
            <button
              onClick={startGame}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? '生成中...' : '开始新游戏'}
            </button>
          </div>
        )}

        {character && (
          <>
            <CharacterSheet character={character} birthYear={birthYear} />
            <SkillProgress character={character} />
            <RelationshipNetwork 
              character={character}
              onRelationshipClick={handleRelationshipClick}
            />
            {!isGameOver ? (
              <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-center items-center gap-4 z-50">
                <p className="text-gray-600">当前年龄：{currentAge}岁</p>
                <button
                  onClick={generateNextEvent}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                  {isLoading ? '生成中...' : '继续生活'}
                </button>
              </div>
            ) : (
              <LifeSummary 
                character={character}
                events={events}
                onRestart={restartGame}
              />
            )}
            {events.length > 0 && (
              <EventLog 
                events={events} 
                latestEventRef={latestEventRef}
              />
            )}
          </>
        )}
      </div>
      
      {selectedNPC && (
        <NPCDetailModal
          npc={selectedNPC}
          onClose={() => setSelectedNPC(null)}
        />
      )}
    </div>
  );
}
