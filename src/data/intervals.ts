import type { Interval, IntervalName } from '../types';

// 音程定义（半音数）
export const INTERVALS: Interval[] = [
  { name: '小二度', semitones: 1 },
  { name: '大二度', semitones: 2 },
  { name: '小三度', semitones: 3 },
  { name: '大三度', semitones: 4 },
  { name: '纯四度', semitones: 5 },
  { name: '增四度', semitones: 6 },
  { name: '纯五度', semitones: 7 },
  { name: '小六度', semitones: 8 },
  { name: '大六度', semitones: 9 },
  { name: '小七度', semitones: 10 },
  { name: '大七度', semitones: 11 },
  { name: '纯八度', semitones: 12 },
];

// 计算两个音符之间的音程
export function calculateInterval(semitones: number): Interval {
  const normalized = ((semitones % 12) + 12) % 12;
  return INTERVALS.find(i => i.semitones === normalized) || INTERVALS[0];
}

// 获取随机音程
export function getRandomInterval(): Interval {
  return INTERVALS[Math.floor(Math.random() * INTERVALS.length)];
}
