import type { NoteName } from '../types';

// 和弦类型
export interface ChordType {
  name: string;
  symbol: string;
  intervals: number[]; // 相对于根音的半音数
  degrees: string[]; // 音级名称
  description: string;
}

// 常用和弦
export const CHORD_TYPES: ChordType[] = [
  // 三和弦
  {
    name: '大三和弦',
    symbol: '',
    intervals: [0, 4, 7],
    degrees: ['根音', '大三度', '纯五度'],
    description: '明亮、稳定的大调和弦',
  },
  {
    name: '小三和弦',
    symbol: 'm',
    intervals: [0, 3, 7],
    degrees: ['根音', '小三度', '纯五度'],
    description: '柔和、忧郁的小调和弦',
  },
  {
    name: '减三和弦',
    symbol: 'dim',
    intervals: [0, 3, 6],
    degrees: ['根音', '小三度', '减五度'],
    description: '紧张、不协和',
  },
  {
    name: '增三和弦',
    symbol: 'aug',
    intervals: [0, 4, 8],
    degrees: ['根音', '大三度', '增五度'],
    description: '神秘、悬浮感',
  },
  // 七和弦
  {
    name: '大七和弦',
    symbol: 'maj7',
    intervals: [0, 4, 7, 11],
    degrees: ['根音', '大三度', '纯五度', '大七度'],
    description: '温柔、梦幻的爵士和弦',
  },
  {
    name: '属七和弦',
    symbol: '7',
    intervals: [0, 4, 7, 10],
    degrees: ['根音', '大三度', '纯五度', '小七度'],
    description: '布鲁斯、摇滚常用',
  },
  {
    name: '小七和弦',
    symbol: 'm7',
    intervals: [0, 3, 7, 10],
    degrees: ['根音', '小三度', '纯五度', '小七度'],
    description: '柔和、爵士常用',
  },
  {
    name: '半减七和弦',
    symbol: 'm7b5',
    intervals: [0, 3, 6, 10],
    degrees: ['根音', '小三度', '减五度', '小七度'],
    description: '爵士 ii-V-I 中常用',
  },
  // 挂留和弦
  {
    name: '挂二和弦',
    symbol: 'sus2',
    intervals: [0, 2, 7],
    degrees: ['根音', '大二度', '纯五度'],
    description: '空灵、开阔',
  },
  {
    name: '挂四和弦',
    symbol: 'sus4',
    intervals: [0, 5, 7],
    degrees: ['根音', '纯四度', '纯五度'],
    description: '悬浮、期待感',
  },
  // add 和弦
  {
    name: 'add9',
    symbol: 'add9',
    intervals: [0, 4, 7, 14],
    degrees: ['根音', '大三度', '纯五度', '九度'],
    description: '丰富、饱满',
  },
];

// 根据根音和和弦类型生成音符
export function generateChord(root: NoteName, chordType: ChordType): NoteName[] {
  const NOTE_ORDER: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootIndex = NOTE_ORDER.indexOf(root);
  
  return chordType.intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return NOTE_ORDER[noteIndex];
  });
}

// 生成和弦全名
export function getChordFullName(root: NoteName, chordType: ChordType): string {
  return `${root}${chordType.symbol}`;
}

// 常见和弦进行
export const CHORD_PROGRESSIONS = [
  {
    name: 'I-IV-V-I',
    chords: [
      { root: 'C' as NoteName, type: CHORD_TYPES[0] },
      { root: 'F' as NoteName, type: CHORD_TYPES[0] },
      { root: 'G' as NoteName, type: CHORD_TYPES[0] },
      { root: 'C' as NoteName, type: CHORD_TYPES[0] },
    ],
  },
  {
    name: 'ii-V-I',
    chords: [
      { root: 'D' as NoteName, type: CHORD_TYPES[6] }, // Dm7
      { root: 'G' as NoteName, type: CHORD_TYPES[5] }, // G7
      { root: 'C' as NoteName, type: CHORD_TYPES[4] }, // Cmaj7
    ],
  },
  {
    name: 'I-V-vi-IV',
    chords: [
      { root: 'C' as NoteName, type: CHORD_TYPES[0] },
      { root: 'G' as NoteName, type: CHORD_TYPES[0] },
      { root: 'A' as NoteName, type: CHORD_TYPES[1] },
      { root: 'F' as NoteName, type: CHORD_TYPES[0] },
    ],
  },
];
