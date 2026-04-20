import { NoteName, Note, FretPosition, Interval, IntervalSemitones, Chord, ChordType } from '@/types';

// 所有音符名称（带升号）
export const NOTE_NAMES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 标准音高频率 (A4 = 440Hz)
export const A4_FREQUENCY = 440;
export const A4_MIDI_NUMBER = 69;

// 标准调弦 (从6弦到1弦)
export const STANDARD_TUNING: NoteName[] = ['E', 'A', 'D', 'G', 'B', 'E'];

// 各弦的空弦音 (6弦到1弦)
export const STRING_OPEN_NOTES: Record<number, NoteName> = {
  6: 'E', // 低音E
  5: 'A',
  4: 'D',
  3: 'G',
  2: 'B',
  1: 'E', // 高音E
};

/**
 * 将 MIDI 编号转换为音符
 */
export function midiToNote(midiNumber: number): Note {
  const noteIndex = midiNumber % 12;
  const octave = Math.floor(midiNumber / 12) - 1;
  return {
    name: NOTE_NAMES[noteIndex],
    octave,
    frequency: midiToFrequency(midiNumber),
  };
}

/**
 * 将 MIDI 编号转换为频率
 */
export function midiToFrequency(midiNumber: number): number {
  return A4_FREQUENCY * Math.pow(2, (midiNumber - A4_MIDI_NUMBER) / 12);
}

/**
 * 将频率转换为 MIDI 编号
 */
export function frequencyToMidi(frequency: number): number {
  return Math.round(12 * Math.log2(frequency / A4_FREQUENCY) + A4_MIDI_NUMBER);
}

/**
 * 将音符名称转换为 MIDI 编号 (默认4度八度)
 */
export function noteToMidi(noteName: NoteName, octave: number = 4): number {
  const noteIndex = NOTE_NAMES.indexOf(noteName);
  return (octave + 1) * 12 + noteIndex;
}

/**
 * 获取指定弦和品位的音符
 */
export function getNoteAtPosition(string: number, fret: number): Note {
  const openNote = STRING_OPEN_NOTES[string];
  const openNoteIndex = NOTE_NAMES.indexOf(openNote);
  const noteIndex = (openNoteIndex + fret) % 12;
  const octaveIncrease = Math.floor((openNoteIndex + fret) / 12);
  
  // E弦特殊处理（需要正确计算八度）
  const baseOctave = string === 1 || string === 6 ? 4 : 3;
  
  return {
    name: NOTE_NAMES[noteIndex],
    octave: baseOctave + octaveIncrease,
    frequency: 0, // 频率稍后计算
  };
}

/**
 * 在指板上查找指定音符的所有位置
 */
export function findNoteOnFretboard(noteName: NoteName, maxFret: number = 12): FretPosition[] {
  const positions: FretPosition[] = [];
  
  for (let string = 6; string >= 1; string--) {
    for (let fret = 0; fret <= maxFret; fret++) {
      const note = getNoteAtPosition(string, fret);
      if (note.name === noteName) {
        positions.push({ string, fret });
      }
    }
  }
  
  return positions;
}

/**
 * 计算两个音符之间的音程
 */
export function getInterval(note1: Note, note2: Note): Interval | null {
  const midi1 = noteToMidi(note1.name, note1.octave);
  const midi2 = noteToMidi(note2.name, note2.octave);
  const semitones = Math.abs(midi2 - midi1) % 12;
  
  return INTERVALS.find(i => i.semitones === semitones) || null;
}

/**
 * 计算从根音到指定音程的音符
 */
export function getNoteFromInterval(rootNote: Note, semitones: IntervalSemitones): Note {
  const rootIndex = NOTE_NAMES.indexOf(rootNote.name);
  const newIndex = (rootIndex + semitones) % 12;
  const octaveIncrease = rootIndex + semitones >= 12 ? 1 : 0;
  
  return {
    name: NOTE_NAMES[newIndex],
    octave: rootNote.octave + octaveIncrease,
    frequency: 0,
  };
}

/**
 * 计算音符的cents偏移（相对于标准音）
 */
export function getCentsOffset(frequency: number, note: Note): number {
  const expectedFrequency = midiToFrequency(noteToMidi(note.name, note.octave));
  return Math.round(1200 * Math.log2(frequency / expectedFrequency));
}

/**
 * 所有音程定义
 */
export const INTERVALS: Interval[] = [
  { name: 'unison', semitones: 0, abbreviation: 'P1' },
  { name: 'minor 2nd', semitones: 1, abbreviation: 'm2' },
  { name: 'major 2nd', semitones: 2, abbreviation: 'M2' },
  { name: 'minor 3rd', semitones: 3, abbreviation: 'm3' },
  { name: 'major 3rd', semitones: 4, abbreviation: 'M3' },
  { name: 'perfect 4th', semitones: 5, abbreviation: 'P4' },
  { name: 'tritone', semitones: 6, abbreviation: 'TT' },
  { name: 'perfect 5th', semitones: 7, abbreviation: 'P5' },
  { name: 'minor 6th', semitones: 8, abbreviation: 'm6' },
  { name: 'major 6th', semitones: 9, abbreviation: 'M6' },
  { name: 'minor 7th', semitones: 10, abbreviation: 'm7' },
  { name: 'major 7th', semitones: 11, abbreviation: 'M7' },
  { name: 'octave', semitones: 12, abbreviation: 'P8' },
];

/**
 * 和弦类型定义
 */
export const CHORD_TYPES: Record<ChordType, { name: string; intervals: IntervalSemitones[] }> = {
  'major': { name: 'Major', intervals: [0, 4, 7] },
  'minor': { name: 'Minor', intervals: [0, 3, 7] },
  '7': { name: '7', intervals: [0, 4, 7, 10] },
  'maj7': { name: 'Major 7', intervals: [0, 4, 7, 11] },
  'min7': { name: 'Minor 7', intervals: [0, 3, 7, 10] },
  'dim': { name: 'Diminished', intervals: [0, 3, 6] },
  'aug': { name: 'Augmented', intervals: [0, 4, 8] },
  'sus2': { name: 'Sus2', intervals: [0, 2, 7] },
  'sus4': { name: 'Sus4', intervals: [0, 5, 7] },
};

/**
 * 生成指定根音的和弦
 */
export function getChord(rootNote: NoteName, type: ChordType): Chord {
  const chordType = CHORD_TYPES[type];
  return {
    name: `${rootNote} ${chordType.name}`,
    type,
    intervals: chordType.intervals,
  };
}

/**
 * 获取难度对应的最大品数
 */
export function getMaxFretForDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): number {
  switch (difficulty) {
    case 'beginner': return 5;
    case 'intermediate': return 9;
    case 'advanced': return 12;
  }
}

/**
 * 随机选择一个音符
 */
export function getRandomNote(maxFret: number = 12, preferredNotes?: NoteName[]): Note {
  const targetNotes = preferredNotes || NOTE_NAMES;
  const noteName = targetNotes[Math.floor(Math.random() * targetNotes.length)];
  
  // 随机选择一个八度 (3-5)
  const octave = 3 + Math.floor(Math.random() * 3);
  
  return {
    name: noteName,
    octave,
    frequency: midiToFrequency(noteToMidi(noteName, octave)),
  };
}

/**
 * 生成随机音程
 */
export function generateRandomInterval(maxFret: number = 12): { note1: Note; note2: Note; interval: Interval } {
  const note1 = getRandomNote(maxFret);
  // 排除同音和八度
  const availableIntervals = INTERVALS.filter(i => i.semitones > 0 && i.semitones <= maxFret);
  const interval = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];
  const note2 = getNoteFromInterval(note1, interval.semitones);
  
  return { note1, note2, interval };
}

/**
 * 格式化音符显示
 */
export function formatNote(note: Note): string {
  return `${note.name}${note.octave}`;
}

/**
 * 获取品丝位置描述
 */
export function formatFretPosition(position: FretPosition): string {
  return `${position.string}弦 ${position.fret === 0 ? '空弦' : position.fret + '品'}`;
}
