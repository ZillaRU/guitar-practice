import { useState, useCallback, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { usePitchDetection } from '../../hooks/usePitchDetection';
import { Fretboard } from '../Fretboard';
import { SCALE_TYPES, generateScale, type ScaleType } from '../../data/scales';
import { getNoteAtPosition, NOTE_ORDER, notesSimilar } from '../../data/notes';
import type { NoteName, Note, FretPosition, Difficulty } from '../../types';

const DIFFICULTY_FRETS: Record<Difficulty, number> = {
  beginner: 5,
  intermediate: 9,
  advanced: 12,
};

export function ScalePractice() {
  const { difficulty } = useGameStore();
  const [selectedScale, setSelectedScale] = useState<ScaleType>(SCALE_TYPES[0]);
  const [rootNote, setRootNote] = useState<NoteName>('C');
  const [scaleNotes, setScaleNotes] = useState<NoteName[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [correctNotes, setCorrectNotes] = useState<NoteName[]>([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [showAllNotes, setShowAllNotes] = useState(false);

  // 生成音阶
  useEffect(() => {
    const notes = generateScale(rootNote, selectedScale);
    setScaleNotes(notes);
    setCurrentNoteIndex(0);
    setCorrectNotes([]);
    setWrongCount(0);
  }, [rootNote, selectedScale]);

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
    if (!isPlaying || currentNoteIndex >= scaleNotes.length) return;
    
    const targetNote = scaleNotes[currentNoteIndex];
    
    if (notesSimilar(detected, { name: targetNote, octave: 4, frequency: 0 })) {
      // 正确！
      setCorrectNotes(prev => [...prev, targetNote]);
      setCurrentNoteIndex(prev => prev + 1);
      
      if (currentNoteIndex + 1 >= scaleNotes.length) {
        // 音阶完成
        setTimeout(() => {
          setCurrentNoteIndex(0);
          setCorrectNotes([]);
        }, 1500);
      }
    } else {
      setWrongCount(prev => prev + 1);
    }
  }, [isPlaying, currentNoteIndex, scaleNotes]);

  const { isListening, startListening, stopListening, currentNote: detectedNote } = 
    usePitchDetection({ onNoteDetected: handleNoteDetected });

  const startPractice = useCallback(async () => {
    await startListening();
    setIsPlaying(true);
    setCurrentNoteIndex(0);
    setCorrectNotes([]);
    setWrongCount(0);
  }, [startListening]);

  const stopPractice = useCallback(() => {
    stopListening();
    setIsPlaying(false);
  }, [stopListening]);

  const currentTarget = scaleNotes[currentNoteIndex];
  const highlightPositions = currentTarget 
    ? findNotePositions(currentTarget, DIFFICULTY_FRETS[difficulty]) 
    : [];

  return (
    <div className="space-y-6">
      {/* 音阶选择 */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm text-gray-500 block mb-1">根音</label>
            <select
              value={rootNote}
              onChange={(e) => setRootNote(e.target.value as NoteName)}
              className="px-3 py-2 border border-amber-200 rounded-lg bg-white text-gray-700"
            >
              {NOTE_ORDER.map(note => (
                <option key={note} value={note}>{note}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="text-sm text-gray-500 block mb-1">音阶类型</label>
            <select
              value={selectedScale.name}
              onChange={(e) => {
                const scale = SCALE_TYPES.find(s => s.name === e.target.value);
                if (scale) setSelectedScale(scale);
              }}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg bg-white text-gray-700"
            >
              {SCALE_TYPES.map(scale => (
                <option key={scale.name} value={scale.name}>{scale.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {selectedScale && (
          <p className="text-sm text-gray-500">{selectedScale.description}</p>
        )}
      </div>

      {/* 音阶显示 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">音阶音符</span>
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <input
              type="checkbox"
              checked={showAllNotes}
              onChange={(e) => setShowAllNotes(e.target.checked)}
              className="rounded"
            />
            显示所有位置
          </label>
        </div>
        <div className="flex gap-2 flex-wrap">
          {scaleNotes.map((note, index) => {
            const isCorrect = correctNotes.includes(note);
            const isCurrent = index === currentNoteIndex && isPlaying;
            const isPast = index < currentNoteIndex;
            
            return (
              <div
                key={index}
                className={`
                  w-12 h-12 rounded-lg flex items-center justify-center text-lg font-medium
                  transition-all duration-200
                  ${isCorrect ? 'bg-green-100 text-green-700 scale-110' : ''}
                  ${isCurrent && !isCorrect ? 'bg-amber-200 text-amber-800 ring-2 ring-amber-400' : ''}
                  ${isPast && !isCorrect ? 'bg-gray-100 text-gray-400' : ''}
                  ${!isCorrect && !isCurrent && !isPast ? 'bg-amber-50 text-amber-600' : ''}
                `}
              >
                {note}
              </div>
            );
          })}
        </div>
        
        {isPlaying && currentTarget && (
          <div className="mt-3 text-center text-amber-700">
            请弹奏 <span className="text-2xl font-bold">{currentTarget}</span>
          </div>
        )}
      </div>

      {/* 指板 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <Fretboard
          maxFret={DIFFICULTY_FRETS[difficulty]}
          highlightPositions={showAllNotes 
            ? scaleNotes.flatMap(n => findNotePositions(n, DIFFICULTY_FRETS[difficulty]))
            : highlightPositions
          }
          targetNote={isPlaying && currentTarget ? { name: currentTarget, octave: 4, frequency: 0 } : null}
          showAllNotes={showAllNotes}
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
          <button
            onClick={stopPractice}
            className="px-6 py-2.5 bg-gray-500 text-white rounded-lg font-medium
              hover:bg-gray-600 transition-colors shadow-sm"
          >
            停止练习
          </button>
        )}
        
        {detectedNote && (
          <span className="text-sm text-gray-500">
            检测到: <span className="font-medium text-amber-700">{detectedNote.name}{detectedNote.octave}</span>
          </span>
        )}
      </div>

      {/* 统计 */}
      {isPlaying && (
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span>进度: {correctNotes.length}/{scaleNotes.length}</span>
          <span className="text-red-500">错误: {wrongCount}</span>
        </div>
      )}
    </div>
  );
}
