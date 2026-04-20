import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { NoteFindingGame, ScalePractice, IntervalPractice, ChordPractice } from './components/Game';
import { StatsPanel } from './components/Stats';
import type { Difficulty } from './types';

type PracticeMode = 'note-finding' | 'scale' | 'interval' | 'chord';
type Tab = 'practice' | 'stats';

const PRACTICE_MODES: { id: PracticeMode; label: string; icon: string; desc: string }[] = [
  { id: 'note-finding', label: '音符定位', icon: '🎯', desc: '找到指板上的音符' },
  { id: 'scale', label: '音阶练习', icon: '🎵', desc: '练习各种音阶' },
  { id: 'interval', label: '音程训练', icon: '📐', desc: '三度音与音程关系' },
  { id: 'chord', label: '和弦构造', icon: '🎸', desc: '学习和弦组成' },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('practice');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('note-finding');
  const { difficulty, setDifficulty } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* 顶部标题 */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-amber-100 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-amber-800">
            指板记忆
          </h1>
          <div className="text-sm text-amber-600">
            慢慢熟悉每一个角落
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* 练习模式选择 */}
        {activeTab === 'practice' && (
          <div className="mb-6">
            <div className="grid grid-cols-4 gap-2">
              {PRACTICE_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setPracticeMode(mode.id)}
                  className={`
                    p-3 rounded-xl text-center transition-all
                    ${practiceMode === mode.id 
                      ? 'bg-amber-600 text-white shadow-md scale-105' 
                      : 'bg-white text-gray-600 hover:bg-amber-50'}
                  `}
                >
                  <div className="text-xl mb-1">{mode.icon}</div>
                  <div className="text-xs font-medium">{mode.label}</div>
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-400 text-center mt-2">
              {PRACTICE_MODES.find(m => m.id === practiceMode)?.desc}
            </div>
          </div>
        )}

        {/* 难度选择 */}
        <div className="mb-6">
          <div className="flex gap-2">
            {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${difficulty === d 
                    ? 'bg-amber-600 text-white shadow-sm' 
                    : 'bg-white text-gray-600 hover:bg-amber-50'}
                `}
              >
                {d === 'beginner' ? '初级' : d === 'intermediate' ? '中级' : '高级'}
              </button>
            ))}
          </div>
        </div>

        {/* 标签页 */}
        <div className="flex border-b border-amber-200 mb-6">
          {[
            { id: 'practice' as Tab, label: '练习' },
            { id: 'stats' as Tab, label: '统计' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 text-sm font-medium transition-colors
                ${activeTab === tab.id 
                  ? 'text-amber-700 border-b-2 border-amber-600' 
                  : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        {activeTab === 'practice' && (
          <>
            {practiceMode === 'note-finding' && <NoteFindingGame />}
            {practiceMode === 'scale' && <ScalePractice />}
            {practiceMode === 'interval' && <IntervalPractice />}
            {practiceMode === 'chord' && <ChordPractice />}
          </>
        )}
        
        {activeTab === 'stats' && (
          <StatsPanel />
        )}
      </main>

      {/* 底部留白 */}
      <div className="h-8" />
    </div>
  );
}

export default App;
