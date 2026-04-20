import { useState, useCallback, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { usePitchDetection } from '../../hooks/usePitchDetection';
import { Fretboard } from '../Fretboard';
import { CHORD_TYPES, generateChord, getChordFullName, type ChordType } from '../../data/chords';
import { getNoteAtPosition, NOTE_ORDER, notesSimilar } from '../../data/notes';
import type { NoteName, Note, FretPosition, Difficulty } from '../../types';

const DIFFICULTY_FRETS: Record<Difficulty, number> = {
  beginner: 5,
  intermediate: 9,
  advanced: 12,
};

type PracticeMode = 'identify' | 'construct';

export function ChordPractice() {
  const { difficulty } = useGameStore();
  const [mode, setMode] = useState<PracticeMode>('construct');
  const [rootNote, setRootNote] = useState<NoteName>('C');
  const [chordType, setChordType] = useState<ChordType>(CHORD_TYPES[0]);
  const [chordNotes, setChordNotes] = useState<NoteName[]>([]);
  const [foundNotes, setFoundNotes] = useState<NoteName[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // 生成和弦音符
  useEffect(() => {
    const notes = generateChord(rootNote, chordType);
    setChordNotes(notes);
    setFoundNotes([]);
    setWrongCount(0);
  }, [rootNote, chordType]);

  // 随机出题
  const generateQuestion = useCallback(() => {
    const randomRoot = NOTE_ORDER[Math.floor(Math.random() * 12)];
    const randomType = CHORD_TYPES[Math.floor(Math.random() * CHORD_TYPES.length)];
    setRootNote(randomRoot);
    setChordType(randomType);
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
    if (!isPlaying) return;
    
    const detectedName = detected.name;
    
    // 检查是否是和弦音
    if (chordNotes.includes(detectedName) && !foundNotes.includes(detectedName)) {
      setFoundNotes(prev => [...prev, detectedName]);
      
      // 检查是否完成
      if (foundNotes.length + 1 >= chordNotes.length) {
        setTimeout(() => {
          generateQuestion();
        }, 1500);
      }
    } else if (!chordNotes.includes(detectedName)) {
      setWrongCount(prev => prev + 1);
    }
  }, [isPlaying, chordNotes, foundNotes, generateQuestion]);

  const { isListening, startListening, stopListening, currentNote: detectedNote } = 
    usePitchDetection({ onNoteDetected: handleNoteDetected });

  const startPractice = useCallback(async () => {
    await startListening();
    setIsPlaying(true);
    generateQuestion();
  }, [startListening, generateQuestion]);

  const stopPractice = useCallback(() => {
    stopListening();
    setIsPlaying(false);
  }, [stopListening]);

  const allChordPositions = chordNotes.flatMap(n => findNotePositions(n, DIFFICULTY_FRETS[difficulty]));
  const foundPositions = foundNotes.flatMap(n => findNotePositions(n, DIFFICULTY_FRETS[difficulty]));

  const chordName = getChordFullName(rootNote, chordType);

  return (
    <div className="space-y-6">
      {/* 模式选择 */}
      <div className="flex gap-2">
        {[
          { id: 'construct' as PracticeMode, label: '构造和弦' },
          { id: 'identify' as PracticeMode, label: '识别和弦' },
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

      {/* 和弦选择（构造模式） */}
      {mode === 'construct' && !isPlaying && (
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
            <label className="text-sm text-gray-500 block mb-1">和弦类型</label>
            <select
              value={chordType.name}
              onChange={(e) => {
                const type = CHORD_TYPES.find(t => t.name === e.target.value);
                if (type) setChordType(type);
              }}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg bg-white text-gray-700"
            >
              {CHORD_TYPES.map(type => (
                <option key={type.name} value={type.name}>{type.name} ({type.symbol || '三和弦'})</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 和弦显示 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-amber-800">{chordName}</div>
          <div className="text-sm text-gray-500 mt-1">{chordType.description}</div>
        </div>
        
        {/* 和弦组成音 */}
        <div className="flex gap-3 justify-center flex-wrap">
          {chordNotes.map((note, index) => {
            const isFound = foundNotes.includes(note);
            return (
              <div
                key={index}
                className={`
                  w-14 h-14 rounded-lg flex flex-col items-center justify-center
                  transition-all duration-200
                  ${isFound 
                    ? 'bg-green-100 text-green-700 scale-110' 
                    : 'bg-amber-50 text-amber-600'}
                `}
              >
                <span className="text-xl font-bold">{isFound ? note : '?'}</span>
                <span className="text-xs text-gray-400">{chordType.degrees[index]}</span>
              </div>
            );
          })}
        </div>
        
        {isPlaying && (
          <div className="mt-4 text-center text-sm text-gray-500">
            找到并弹奏和弦的所有组成音 ({foundNotes.length}/{chordNotes.length})
          </div>
        )}
      </div>

      {/* 指板 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">指板位置</span>
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <input
              type="checkbox"
              checked={showHint}
              onChange={(e) => setShowHint(e.target.checked)}
              className="rounded"
            />
            显示提示
          </label>
        </div>
        <Fretboard
          maxFret={DIFFICULTY_FRETS[difficulty]}
          highlightPositions={showHint ? allChordPositions : foundPositions}
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
      {isPlaying && (
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span>找到: {foundNotes.length}/{chordNotes.length}</span>
          <span className="text-red-500">错误: {wrongCount}</span>
        </div>
      )}

      {/* 和弦音程表 */}
      <div className="bg-amber-50 rounded-lg p-4 text-sm">
        <div className="font-medium text-amber-800 mb-2">{chordName} 的构成</div>
        <div className="grid grid-cols-2 gap-2">
          {chordNotes.map((note, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-gray-500">{chordType.degrees[i]}</span>
              <span className="font-medium text-amber-700">{note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
