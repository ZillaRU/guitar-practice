import type { NoteName } from '../types';

// 音阶类型
export interface ScaleType {
  name: string;
  nameEn: string;
  intervals: number[]; // 半音数
  description: string;
}

// 常用音阶
export const SCALE_TYPES: ScaleType[] = [
  {
    name: '大调音阶',
    nameEn: 'Major',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    description: '最基础的音阶，明亮、开朗的感觉',
  },
  {
    name: '自然小调',
    nameEn: 'Natural Minor',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    description: '小调音阶，柔和、忧郁的感觉',
  },
  {
    name: '大调五声',
    nameEn: 'Major Pentatonic',
    intervals: [0, 2, 4, 7, 9],
    description: '五声音阶，常用于流行、摇滚',
  },
  {
    name: '小调五声',
    nameEn: 'Minor Pentatonic',
    intervals: [0, 3, 5, 7, 10],
    description: '五声音阶，常用于布鲁斯、摇滚',
  },
  {
    name: '布鲁斯音阶',
    nameEn: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10],
    description: '加入降五度的蓝调音，更有味道',
  },
  // 中古调式
  {
    name: 'Ionian（伊奥尼亚）',
    nameEn: 'Ionian',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    description: '同大调音阶',
  },
  {
    name: 'Dorian（多利亚）',
    nameEn: 'Dorian',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    description: '小调感但有大六度，爵士常用',
  },
  {
    name: 'Phrygian（弗里几亚）',
    nameEn: 'Phrygian',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    description: '西班牙风味，降二度',
  },
  {
    name: 'Lydian（利底亚）',
    nameEn: 'Lydian',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    description: '梦幻感，升四度',
  },
  {
    name: 'Mixolydian（混合利底亚）',
    nameEn: 'Mixolydian',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    description: '布鲁斯、摇滚常用，降七度',
  },
  {
    name: 'Aeolian（爱奥利亚）',
    nameEn: 'Aeolian',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    description: '同自然小调',
  },
  {
    name: 'Locrian（洛克利亚）',
    nameEn: 'Locrian',
    intervals: [0, 1, 3, 5, 6, 8, 10],
    description: '最暗的调式，减音阶感',
  },
];

// 根据根音和音阶类型生成音符序列
export function generateScale(root: NoteName, scaleType: ScaleType): NoteName[] {
  const NOTE_ORDER: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootIndex = NOTE_ORDER.indexOf(root);
  
  return scaleType.intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return NOTE_ORDER[noteIndex];
  });
}

// 把位定义（根音在第几弦第几品）
export interface Position {
  string: number;
  fret: number;
}

export const SCALE_POSITIONS: Record<string, { rootString: number; frets: number[] }> = {
  'C-1': { rootString: 5, frets: [3, 5, 7, 8, 10, 12, 13, 15] }, // C 大调第 1 把位
  'G-1': { rootString: 6, frets: [3, 5, 7, 8, 10, 12, 13, 15] }, // G 大调第 1 把位
};
