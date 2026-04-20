import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameMode, Difficulty, Question, AnswerResult, PracticeStats, FretPosition } from '../types';

interface GameStore {
  mode: GameMode;
  difficulty: Difficulty;
  currentQuestion: Question | null;
  isListening: boolean;
  detectedNote: string | null;
  recentResults: AnswerResult[];
  stats: PracticeStats;
  
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setIsListening: (listening: boolean) => void;
  setDetectedNote: (note: string | null) => void;
  addResult: (result: AnswerResult) => void;
  resetStats: () => void;
}

const initialStats: PracticeStats = {
  totalQuestions: 0,
  correctAnswers: 0,
  averageResponseTime: 0,
  weakPositions: [],
  positionAccuracy: new Map(),
  lastPracticeDate: new Date().toISOString(),
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      mode: 'note-finding',
      difficulty: 'beginner',
      currentQuestion: null,
      isListening: false,
      detectedNote: null,
      recentResults: [],
      stats: initialStats,

      setMode: (mode) => set({ mode }),
      setDifficulty: (difficulty) => set({ difficulty }),
      setCurrentQuestion: (question) => set({ currentQuestion: question }),
      setIsListening: (listening) => set({ isListening: listening }),
      setDetectedNote: (note) => set({ detectedNote: note }),
      
      addResult: (result) => {
        const { recentResults, stats } = get();
        const newResults = [...recentResults, result].slice(-50); // 保留最近50条
        
        // 更新统计
        const totalQuestions = stats.totalQuestions + 1;
        const correctAnswers = stats.correctAnswers + (result.correct ? 1 : 0);
        const totalTime = stats.averageResponseTime * stats.totalQuestions + result.responseTime;
        
        set({
          recentResults: newResults,
          stats: {
            ...stats,
            totalQuestions,
            correctAnswers,
            averageResponseTime: totalTime / totalQuestions,
            lastPracticeDate: new Date().toISOString(),
          },
        });
      },
      
      resetStats: () => set({ stats: initialStats, recentResults: [] }),
    }),
    {
      name: 'guitar-practice-storage',
      partialize: (state) => ({
        stats: state.stats,
        recentResults: state.recentResults,
      }),
    }
  )
);
