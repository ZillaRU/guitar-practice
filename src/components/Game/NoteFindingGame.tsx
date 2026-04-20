import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { usePitchDetection } from '../../hooks/usePitchDetection';
import { Fretboard } from '../Fretboard';
import { getNoteAtPosition, NOTE_ORDER } from '../../data/notes';
import type { Note, FretPosition, Difficulty } from '../../types';

// 难度对应的品数范围
const DIFFICULTY_FRETS: Record<Difficulty, number> = {
  beginner: 5,
  intermediate: 9,
  advanced: 12,
};

// 生成随机音符题目
function generateQuestion(difficulty: Difficulty): { note: Note; positions: FretPosition[] } {
  const maxFret = DIFFICULTY_FRETS[difficulty];
  const positions: FretPosition[] = [];
  
  // 随机选择一个音符名
  const noteName = NOTE_ORDER[Math.floor(Math.random() * NOTE_ORDER.length)];
  
  // 找到指板上所有该音符的位置（在范围内）
  for (let stringNum = 1; stringNum <= 6; stringNum++) {
    for (let fret = 0; fret <= maxFret; fret++) {
      const note = getNoteAtPosition(stringNum, fret);
      if (note.name === noteName) {
        positions.push({ string: stringNum, fret, note });
      }
    }
  }
  
  // 随机选择一个位置作为目标
  const targetPosition = positions[Math.floor(Math.random() * positions.length)];
  
  return {
    note: targetPosition.note,
    positions,
  };
}

export function NoteFindingGame() {
  const { difficulty, currentQuestion, setCurrentQuestion, addResult, isListening, setIsListening } = useGameStore();
  const [targetNote, setTargetNote] = useState<Note | null>(null);
  const [correctPositions, setCorrectPositions] = useState<FretPosition[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);

  // 音高检测回调
  const handleNoteDetected = useCallback((detected: Note) => {
    if (!targetNote) return;
    
    const responseTime = Date.now() - questionStartTime;
    const correct = detected.name === targetNote.name && detected.octave === targetNote.octave;
    
    setFeedback(correct ? 'correct' : 'wrong');
    
    if (correct) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
      setStreak(prev => prev + 1);
      
      addResult({
        question: currentQuestion!,
        correct: true,
        responseTime,
        detectedNote,
        timestamp: Date.now(),
      });
      
      // 1秒后生成新题目
      setTimeout(() => {
        newQuestion();
      }, 800);
    } else {
      setScore(prev => ({ ...prev, correct: prev.correct, total: prev.total + 1 }));
      setStreak(0);
    }
  }, [targetNote, questionStartTime, currentQuestion, addResult]);

  const { currentNote: detectedNote, isListening: micListening, startListening, stopListening, error } = 
    usePitchDetection({ onNoteDetected: handleNoteDetected });

  // 生成新题目
  const newQuestion = useCallback(() => {
    const { note, positions } = generateQuestion(difficulty);
    setTargetNote(note);
    setCorrectPositions(positions);
    setFeedback(null);
    setQuestionStartTime(Date.now());
    
    setCurrentQuestion({
      type: 'note-finding',
      target: { string: note.octave >= 4 ? 1 : 6, fret: 0, note }, // 简化存储
      difficulty,
      timestamp: Date.now(),
    });
  }, [difficulty, setCurrentQuestion]);

  // 开始游戏
  const startGame = useCallback(async () => {
    await startListening();
    setIsListening(true);
    newQuestion();
  }, [startListening, setIsListening, newQuestion]);

  // 停止游戏
  const endGame = useCallback(() => {
    stopListening();
    setIsListening(false);
    setTargetNote(null);
    setFeedback(null);
  }, [stopListening, setIsListening]);

  // 难度变化时重新生成题目
  useEffect(() => {
    if (micListening) {
      newQuestion();
    }
  }, [difficulty]);

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!micListening ? (
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-amber-600 text-white rounded-lg font-medium
                hover:bg-amber-700 transition-colors shadow-sm"
            >
              开始练习
            </button>
          ) : (
            <button
              onClick={endGame}
              className="px-6 py-2.5 bg-gray-500 text-white rounded-lg font-medium
                hover:bg-gray-600 transition-colors shadow-sm"
            >
              结束练习
            </button>
          )}
        </div>
        
        {/* 分数 */}
        <div className="flex items-center gap-4 text-sm">
          <div className="text-amber-700">
            正确: <span className="font-bold text-lg">{score.correct}</span>
          </div>
          <div className="text-gray-500">
            总计: <span className="font-medium">{score.total}</span>
          </div>
          {streak > 2 && (
            <div className="text-green-600 font-medium">
              🔥 连续 {streak} 题
            </div>
          )}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* 题目显示 */}
      {micListening && targetNote && (
        <div className="space-y-4">
          {/* 目标音符 */}
          <div className={`
            text-center p-6 rounded-xl transition-all duration-300
            ${feedback === 'correct' ? 'bg-green-100 scale-105' : 
              feedback === 'wrong' ? 'bg-red-100' : 'bg-amber-50'}
          `}>
            <div className="text-gray-500 text-sm mb-2">请找到这个音符</div>
            <div className="text-5xl font-bold text-amber-800">
              {targetNote.name}{targetNote.octave}
            </div>
            
            {/* 反馈 */}
            {feedback && (
              <div className={`mt-3 text-lg font-medium
                ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}
              >
                {feedback === 'correct' ? '✓ 正确！' : `✗ 检测到: ${detectedNote?.name}${detectedNote?.octave}`}
              </div>
            )}
          </div>

          {/* 检测到的音符 */}
          {detectedNote && (
            <div className="text-center text-sm text-gray-500">
              检测到: <span className="font-medium text-amber-700">
                {detectedNote.name}{detectedNote.octave}
              </span>
            </div>
          )}

          {/* 指板 */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Fretboard
              maxFret={DIFFICULTY_FRETS[difficulty]}
              highlightPositions={feedback === 'correct' ? correctPositions : []}
              targetNote={feedback === 'correct' ? null : targetNote}
              showAllNotes={false}
            />
          </div>
          
          {/* 提示：显示正确位置 */}
          <details className="text-sm text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700">
              显示所有正确位置
            </summary>
            <div className="mt-2">
              <Fretboard
                maxFret={DIFFICULTY_FRETS[difficulty]}
                highlightPositions={correctPositions}
                showAllNotes={true}
              />
            </div>
          </details>
        </div>
      )}

      {/* 未开始提示 */}
      {!micListening && !targetNote && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🎸</div>
          <div>点击"开始练习"后，系统会随机出题</div>
          <div className="text-sm mt-2">用麦克风检测你弹奏的音符</div>
        </div>
      )}
    </div>
  );
}
