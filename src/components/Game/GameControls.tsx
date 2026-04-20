import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { GameMode, Difficulty } from '@/types';

export const GameControls: React.FC = () => {
  const { 
    isPlaying, 
    score, 
    settings,
    startGame, 
    endGame,
    setGameMode,
    setDifficulty,
    getCurrentAccuracy,
    getAverageResponseTime,
  } = useGameStore();
  
  const accuracy = getCurrentAccuracy();
  const avgTime = getAverageResponseTime();
  
  return (
    <div className="space-y-6">
      {/* 游戏状态 */}
      {isPlaying && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-text-secondary">正确率</p>
              <p className="text-2xl font-bold text-soft-brown">{accuracy}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-text-secondary">已答题</p>
              <p className="text-2xl font-bold text-soft-brown">{score.total}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-secondary">平均用时</p>
              <p className="text-2xl font-bold text-soft-brown">{(avgTime / 1000).toFixed(1)}s</p>
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="h-2 bg-warm-beige/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent-sage to-accent-amber transition-all duration-500"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>
      )}
      
      {/* 模式选择 */}
      {!isPlaying && (
        <>
          <div className="card">
            <h3 className="text-sm font-medium text-text-secondary mb-3">练习模式</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: 'note-location', label: '🎸 音符定位', desc: '找到指定音符的位置' },
                { value: 'interval-identification', label: '🎵 音程识别', desc: '识别两个音符的音程' },
                { value: 'chord-position', label: '🎶 和弦位置', desc: '找到和弦的指法位置' },
              ].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setGameMode(mode.value as GameMode)}
                  className={`
                    p-4 rounded-xl text-left transition-all duration-300
                    ${settings.mode === mode.value 
                      ? 'bg-soft-brown text-white shadow-md' 
                      : 'bg-warm-beige/30 hover:bg-warm-beige/50'
                    }
                  `}
                >
                  <div className="font-medium">{mode.label}</div>
                  <div className={`text-sm ${settings.mode === mode.value ? 'text-white/70' : 'text-text-secondary'}`}>
                    {mode.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-sm font-medium text-text-secondary mb-3">难度级别</h3>
            <div className="flex gap-2">
              {[
                { value: 'beginner', label: '初级', desc: '前5品' },
                { value: 'intermediate', label: '中级', desc: '前9品' },
                { value: 'advanced', label: '高级', desc: '全指板' },
              ].map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => setDifficulty(diff.value as Difficulty)}
                  className={`
                    flex-1 p-3 rounded-xl text-center transition-all duration-300
                    ${settings.difficulty === diff.value 
                      ? 'bg-soft-brown text-white' 
                      : 'bg-warm-beige/30 hover:bg-warm-beige/50'
                    }
                  `}
                >
                  <div className="font-medium text-sm">{diff.label}</div>
                  <div className={`text-xs ${settings.difficulty === diff.value ? 'text-white/70' : 'text-text-secondary'}`}>
                    {diff.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* 开始按钮 */}
          <button
            onClick={startGame}
            className="w-full btn-primary text-lg py-4"
          >
            开始练习
          </button>
        </>
      )}
      
      {/* 游戏中控制 */}
      {isPlaying && (
        <button
          onClick={endGame}
          className="w-full btn-secondary"
        >
          结束练习
        </button>
      )}
    </div>
  );
};

export default GameControls;
