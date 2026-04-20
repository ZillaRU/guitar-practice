import { useState, useCallback, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { usePitchDetection } from '../../hooks/usePitchDetection';
import { Fretboard } from '../Fretboard';
import { INTERVALS, calculateInterval } from '../../data/intervals';
import { getNoteAtPosition, NOTE_ORDER, notesSimilar, frequencyToNote } from '../../data/notes';
import type { NoteName, Note, FretPosition, Difficulty, Interval } from '../../types';

const DIFFICULTY_FRETS: Record<Difficulty, number> = {
  beginner: 5,
  intermediate: 9,
  advanced: 12,
};

// 三度音练习模式
type ThirdsMode = 'ascending' | 'descending' | 'harmonic';

export function IntervalPractice() {
  const { difficulty } = useGameStore();
  const [mode, setMode] = useState<ThirdsMode>('ascending');
  const [currentRoot, setCurrentRoot] = useState<NoteName>('C');
  const [targetInterval, setTargetInterval] = useState<Interval>(INTERVALS[3]); // 默认大三度
  const [targetNote, setTargetNote] = useState<NoteName | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedRoot, setHasPlayedRoot] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // 计算目标音符
  useEffect(() => {
    const rootIndex = NOTE_ORDER.indexOf(currentRoot);
    const targetIndex = (rootIndex + targetInterval.semitones) % 12;
    setTargetNote(NOTE_ORDER[targetIndex]);
  }, [currentRoot, targetInterval]);

  // 生成新题目
  const generateQuestion = useCallback(() => {
    const randomRoot = NOTE_ORDER[Math.floor(Math.random() * NOTE_ORDER.length)];
    const randomInterval = INTERVALS[Math.floor(Math.random() * 4) + 2]; // 大二度到大三度
    setCurrentRoot(randomRoot);
    setTargetInterval(randomInterval);
    setHasPlayedRoot(false);
    setShowHint(false);
  }, []);

  // 找到指板上某个音符的所有位置
  const findNotePositions = useCallback((noteName: NoteName, maxFret: number): FretPosition[] => {
    const positions: FretPosition[] = [];
    for (let stringNum = 1; stringNum <= 6; stringNum++) {
      for (let fret = 0; fret <= maxFret; fret++) {
        const note = getNoteAtPosition(stringNum, fret);
        if (note.name === noteName) {
          positions.push({ string: stringNum, fret, note });
        }
      }
    }
    return positions;
  }, []);

  // 检测到音符
  const handleNoteDetected = useCallback((detected: Note) => {
    if (!isPlaying || !targetNote) return;
    
    if (!hasPlayedRoot) {
      // 检测根音
      if (notesSimilar(detected, { name: currentRoot, octave: 4, frequency: 0 })) {
        setHasPlayedRoot(true);
      }
    } else {
      // 检测目标音
      setTotalCount(prev => prev + 1);
      
      if (notesSimilar(detected, { name: targetNote, octave: 4, frequency: 0 })) {
        setCorrectCount(prev => prev + 1);
        setTimeout(generateQuestion, 800);
      }
    }
  }, [isPlaying, targetNote, currentRoot, hasPlayedRoot, generateQuestion]);

  const { isListening, startListening, stopListening, currentNote: detectedNote } = 
    usePitchDetection({ onNoteDetected: handleNoteDetected });

  const startPractice = useCallback(async () => {
    await startListening();
    setIsPlaying(true);
    setCorrectCount(0);
    setTotalCount(0);
    generateQuestion();
  }, [startListening, generateQuestion]);

  const stopPractice = useCallback(() => {
    stopListening();
    setIsPlaying(false);
    setHasPlayedRoot(false);
  }, [stopListening]);

  const rootPositions = findNotePositions(currentRoot, DIFFICULTY_FRETS[difficulty]);
  const targetPositions = targetNote ? findNotePositions(targetNote, DIFFICULTY_FRETS[difficulty]) : [];

  return (
    <div className="space-y-6">
      {/* 模式选择 */}
      <div className="flex gap-2">
        {[
          { id: 'ascending' as ThirdsMode, label: '上行音程' },
          { id: 'descending' as ThirdsMode, label: '下行音程' },
          { id: 'harmonic' as ThirdsMode, label: '双音' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${mode === m.id 
                ? 'bg-amber-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-amber-50'}
            `}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 题目显示 */}
      {isPlaying && (
        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <div className="text-sm text-gray-500 mb-4">
            先弹根音，再弹<span className="font-medium text-amber-700">{targetInterval.name}</span>
          </div>
          
          <div className="flex items-center justify-center gap-8">
            <div className={`
              w-20 h-20 rounded-xl flex flex-col items-center justify-center
              ${hasPlayedRoot ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
            `}>
              <span className="text-3xl font-bold">{currentRoot}</span>
              <span className="text-xs">根音</span>
            </div>
            
            <div className="text-2xl text-gray-300">→</div>
            
            <div className={`
              w-20 h-20 rounded-xl flex flex-col items-center justify-center
              bg-gray-100 text-gray-400
            `}>
              <span className="text-3xl font-bold">?</span>
              <span className="text-xs">{targetInterval.name}</span>
            </div>
          </div>

          {showHint && targetNote && (
            <div className="mt-4 text-amber-600">
              答案: <span className="font-bold text-xl">{targetNote}</span>
            </div>
          )}
        </div>
      )}

      {/* 指板 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <Fretboard
          maxFret={DIFFICULTY_FRETS[difficulty]}
          highlightPositions={showHint ? [...rootPositions, ...targetPositions] : rootPositions}
          showAllNotes={false}
        />
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center gap-4">
        {!isPlaying ? (
          <button
            onClick={startPractice}
            className="px-6 py-2.5 bg-amber-600 text-white rounded-lg font-medium
              hover:bg-amber-700 transition-colors shadow-sm"
          >
            开始练习
          </button>
        ) : (
          <>
            <button
              onClick={stopPractice}
              className="px-6 py-2.5 bg-gray-500 text-white rounded-lg font-medium
                hover:bg-gray-600 transition-colors shadow-sm"
            >
              停止练习
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-4 py-2.5 bg-amber-100 text-amber-700 rounded-lg font-medium
                hover:bg-amber-200 transition-colors"
            >
              {showHint ? '隐藏提示' : '显示提示'}
            </button>
            <button
              onClick={generateQuestion}
              className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium
                hover:bg-gray-200 transition-colors"
            >
              下一题
            </button>
          </>
        )}
        
        {detectedNote && (
          <span className="text-sm text-gray-500">
            检测到: <span className="font-medium text-amber-700">{detectedNote.name}{detectedNote.octave}</span>
          </span>
        )}
      </div>

      {/* 统计 */}
      {isPlaying && totalCount > 0 && (
        <div className="text-sm text-gray-500">
          正确率: {Math.round((correctCount / totalCount) * 100)}% ({correctCount}/{totalCount})
        </div>
      )}

      {/* 说明 */}
      <div className="bg-amber-50 rounded-lg p-4 text-sm text-gray-600">
        <div className="font-medium text-amber-800 mb-2">练习说明</div>
        <ul className="space-y-1 list-disc list-inside">
          <li>系统给出根音和音程，你需要找到对应的音</li>
          <li>先弹根音，再弹目标音</li>
          <li>这是构建音程感和和弦基础的重要练习</li>
        </ul>
      </div>
    </div>
  );
}
