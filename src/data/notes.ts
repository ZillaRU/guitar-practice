import type { Note, NoteName, FretPosition } from '../types';

// 标准调弦（从细到粗）
const STANDARD_TUNING: NoteName[] = ['E', 'B', 'G', 'D', 'A', 'E'];

// 音符频率映射（A4 = 440Hz）
const NOTE_FREQUENCIES: Record<string, number> = {
  'C0': 16.35, 'C#0': 17.32, 'D0': 18.35, 'D#0': 19.45, 'E0': 20.60, 'F0': 21.83, 'F#0': 23.12, 'G0': 24.50, 'G#0': 25.96, 'A0': 27.50, 'A#0': 29.14, 'B0': 30.87,
  'C1': 32.70, 'C#1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'E1': 41.20, 'F1': 43.65, 'F#1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'B1': 61.74,
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'B6': 1975.53,
};

// 音符顺序
const NOTE_ORDER: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 获取音符在序列中的位置（0-11）
export function getNoteIndex(note: NoteName): number {
  return NOTE_ORDER.indexOf(note);
}

// 根据弦号和品数获取音符
export function getNoteAtPosition(stringNum: number, fret: number): Note {
  // stringNum: 1-6，1是最细的弦（高音E）
  const openNote = STANDARD_TUNING[stringNum - 1];
  const openIndex = getNoteIndex(openNote);
  
  // 计算品数对应的音符
  const noteIndex = (openIndex + fret) % 12;
  const noteName = NOTE_ORDER[noteIndex];
  
  // 计算八度
  // 空弦的八度
  const openOctaves: Record<number, number> = {
    1: 4, // E4
    2: 3, // B3
    3: 3, // G3
    4: 3, // D3
    5: 2, // A2
    6: 2, // E2
  };
  
  const openOctave = openOctaves[stringNum];
  const octaveIncrease = Math.floor((openIndex + fret) / 12);
  const octave = openOctave + octaveIncrease;
  
  const noteStr = `${noteName}${octave}`;
  const frequency = NOTE_FREQUENCIES[noteStr] || 0;
  
  return {
    name: noteName,
    octave,
    frequency,
  };
}

// 生成指板上所有位置
export function generateFretboard(maxFret: number = 12): FretPosition[][] {
  const fretboard: FretPosition[][] = [];
  
  for (let stringNum = 1; stringNum <= 6; stringNum++) {
    const stringPositions: FretPosition[] = [];
    for (let fret = 0; fret <= maxFret; fret++) {
      stringPositions.push({
        string: stringNum,
        fret,
        note: getNoteAtPosition(stringNum, fret),
      });
    }
    fretboard.push(stringPositions);
  }
  
  return fretboard;
}

// 根据频率获取最近的音符
export function frequencyToNote(frequency: number): Note | null {
  if (frequency < 16 || frequency > 2000) return null;
  
  let closestNote: Note | null = null;
  let minDiff = Infinity;
  
  for (const [noteStr, freq] of Object.entries(NOTE_FREQUENCIES)) {
    const diff = Math.abs(frequency - freq);
    if (diff < minDiff) {
      minDiff = diff;
      const name = noteStr.slice(0, -1) as NoteName;
      const octave = parseInt(noteStr.slice(-1));
      closestNote = { name, octave, frequency: freq };
    }
  }
  
  return closestNote;
}

// 音符相等比较
export function notesEqual(note1: Note, note2: Note): boolean {
  return note1.name === note2.name && note1.octave === note2.octave;
}

// 音符相似比较（忽略八度）
export function notesSimilar(note1: Note, note2: Note): boolean {
  return note1.name === note2.name;
}

export { NOTE_ORDER, NOTE_FREQUENCIES, STANDARD_TUNING };
