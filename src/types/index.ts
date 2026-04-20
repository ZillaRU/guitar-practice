// 音符名称
export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

// 完整音符（含八度）
export interface Note {
  name: NoteName;
  octave: number;
  frequency: number;
}

// 指板位置
export interface FretPosition {
  string: number; // 1-6，1是最细的弦（高音E）
  fret: number;   // 0-24，0是空弦
  note: Note;
}

// 音程类型
export type IntervalName = 
  | '小二度' | '大二度' 
  | '小三度' | '大三度' 
  | '纯四度' | '增四度' 
  | '纯五度' | '小六度' 
  | '大六度' | '小七度' 
  | '大七度' | '纯八度';

export interface Interval {
  name: IntervalName;
  semitones: number;
}

// 游戏模式
export type GameMode = 'note-finding' | 'interval-recognition' | 'chord-position';

// 游戏难度
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// 题目
export interface Question {
  type: GameMode;
  target: FretPosition | { note1: Note; note2: Note } | { chordName: string; positions: FretPosition[] };
  difficulty: Difficulty;
  timestamp: number;
}

// 答题结果
export interface AnswerResult {
  question: Question;
  correct: boolean;
  responseTime: number; // 毫秒
  detectedNote?: Note;
  timestamp: number;
}

// 练习统计
export interface PracticeStats {
  totalQuestions: number;
  correctAnswers: number;
  averageResponseTime: number;
  weakPositions: FretPosition[]; // 错误率高的位置
  positionAccuracy: Map<string, number>; // 位置 -> 正确率
  lastPracticeDate: string;
}

// 游戏状态
export interface GameState {
  mode: GameMode;
  difficulty: Difficulty;
  currentQuestion: Question | null;
  isListening: boolean;
  detectedNote: Note | null;
  stats: PracticeStats;
  recentResults: AnswerResult[];
}
