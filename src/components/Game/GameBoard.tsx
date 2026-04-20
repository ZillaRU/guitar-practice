import React, { useState, useCallback, useEffect } from 'react';
import { Fretboard } from '@/components/Fretboard/Fretboard';
import { useGameStore } from '@/store/gameStore';
import { FretPosition } from '@/types';
import { formatNote } from '@/utils/musicTheory';

interface GameBoardProps {
  onAnswer: (position: FretPosition) => void;
  showResult: boolean;
  lastResult?: { correct: boolean; expectedPositions?: FretPosition[] };
}

export const GameBoard: React.FC<GameBoardProps> = ({
  onAnswer,
  showResult,
  lastResult,
}) => {
  const { currentQuestion, settings } = useGameStore();
  const [selectedPosition, setSelectedPosition] = useState<FretPosition | null>(null);
  
  // 获取目标音符
  const targetNote = currentQuestion?.data.type === 'note' 
    ? currentQuestion.data.targetNote 
    : null;
  
  // 高亮显示的位置（正确答案位置）
  const highlightedPositions = showResult && lastResult?.expectedPositions
    ? lastResult.expectedPositions
    : [];
  
  // 处理位置点击
  const handlePositionClick = useCallback((position: FretPosition) => {
    setSelectedPosition(position);
  }, []);
  
  // 提交答案
  const handleSubmit = useCallback(() => {
    if (selectedPosition) {
      onAnswer(selectedPosition);
      setSelectedPosition(null);
    }
  }, [selectedPosition, onAnswer]);
  
  // 清除选中状态当问题改变时
  useEffect(() => {
    setSelectedPosition(null);
  }, [currentQuestion?.id]);
  
  // 键盘支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selectedPosition && !showResult) {
        handleSubmit();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPosition, showResult, handleSubmit]);
  
  if (!currentQuestion || currentQuestion.data.type !== 'note') {
    return (
      <div className="flex items-center justify-center h-64 text-text-secondary">
        加载中...
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      {/* 题目显示 */}
      <div className="text-center mb-8">
        <p className="text-sm text-text-secondary mb-2">请找到这个音符的位置</p>
        <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/80 rounded-2xl shadow-sm">
          <span className="text-4xl md:text-5xl font-display font-bold text-soft-brown">
            {formatNote(targetNote!)}
          </span>
          {showResult && lastResult && (
            <span 
              className={`text-2xl ${lastResult.correct ? 'text-success' : 'text-error'}`}
            >
              {lastResult.correct ? '✓' : '✗'}
            </span>
          )}
        </div>
      </div>
      
      {/* 指板 */}
      <div className="card mb-6">
        <Fretboard
          maxFret={settings.maxFret}
          highlightedPositions={highlightedPositions}
          selectedPosition={selectedPosition}
          onPositionClick={handlePositionClick}
          showNotes={settings.mode === 'note-location'}
          interactive={!showResult}
        />
      </div>
      
      {/* 选中位置显示 */}
      {selectedPosition && !showResult && (
        <div className="text-center mb-4 animate-fade-in">
          <p className="text-text-secondary">
            已选择: <span className="text-soft-brown font-medium">
              {selectedPosition.string}弦 {selectedPosition.fret === 0 ? '空弦' : selectedPosition.fret + '品'}
            </span>
          </p>
        </div>
      )}
      
      {/* 提交按钮 */}
      {!showResult && (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedPosition}
            className={`
              px-8 py-3 rounded-full font-medium transition-all duration-300
              ${selectedPosition 
                ? 'bg-soft-brown text-white hover:bg-deep-brown hover:shadow-lg active:scale-95' 
                : 'bg-warm-beige text-text-secondary cursor-not-allowed'
              }
            `}
          >
            确认答案
          </button>
        </div>
      )}
      
      {/* 结果提示 */}
      {showResult && lastResult && (
        <div className="text-center animate-fade-in">
          <p className={`text-lg font-medium mb-4 ${lastResult.correct ? 'text-success' : 'text-error'}`}>
            {lastResult.correct ? '回答正确！太棒了 🎉' : '回答错误，再接再厉 💪'}
          </p>
          {!lastResult.correct && lastResult.expectedPositions && (
            <p className="text-sm text-text-secondary">
              正确位置: {lastResult.expectedPositions.map(pos => 
                `${pos.string}弦${pos.fret === 0 ? '空弦' : pos.fret + '品'}`
              ).join(' 或 ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GameBoard;
