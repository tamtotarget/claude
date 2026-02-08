import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, ModuleProgress, UserProgress } from '../types';

interface ProgressState {
  progress: UserProgress;
  setRole: (role: Role) => void;
  markModuleCompleted: (moduleId: number) => void;
  saveQuizScore: (moduleId: number, score: number) => void;
  updateLastAccessed: (moduleId: number) => void;
  getModuleProgress: (moduleId: number) => ModuleProgress;
  getOverallProgress: () => number;
  resetProgress: () => void;
}

const TOTAL_MODULES = 6;

const defaultModuleProgress = (moduleId: number): ModuleProgress => ({
  moduleId,
  completed: false,
  quizScore: null,
  quizCompleted: false,
  lastAccessed: new Date().toISOString(),
});

const initialProgress: UserProgress = {
  role: 'SDR',
  modules: {},
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: initialProgress,

      setRole: (role: Role) =>
        set((state) => ({
          progress: { ...state.progress, role },
        })),

      markModuleCompleted: (moduleId: number) =>
        set((state) => ({
          progress: {
            ...state.progress,
            modules: {
              ...state.progress.modules,
              [moduleId]: {
                ...(state.progress.modules[moduleId] || defaultModuleProgress(moduleId)),
                completed: true,
                lastAccessed: new Date().toISOString(),
              },
            },
          },
        })),

      saveQuizScore: (moduleId: number, score: number) =>
        set((state) => ({
          progress: {
            ...state.progress,
            modules: {
              ...state.progress.modules,
              [moduleId]: {
                ...(state.progress.modules[moduleId] || defaultModuleProgress(moduleId)),
                quizScore: score,
                quizCompleted: true,
                lastAccessed: new Date().toISOString(),
              },
            },
          },
        })),

      updateLastAccessed: (moduleId: number) =>
        set((state) => ({
          progress: {
            ...state.progress,
            modules: {
              ...state.progress.modules,
              [moduleId]: {
                ...(state.progress.modules[moduleId] || defaultModuleProgress(moduleId)),
                lastAccessed: new Date().toISOString(),
              },
            },
          },
        })),

      getModuleProgress: (moduleId: number) => {
        const state = get();
        return state.progress.modules[moduleId] || defaultModuleProgress(moduleId);
      },

      getOverallProgress: () => {
        const state = get();
        const completedCount = Object.values(state.progress.modules).filter(
          (m) => m.completed
        ).length;
        return Math.round((completedCount / TOTAL_MODULES) * 100);
      },

      resetProgress: () => set({ progress: initialProgress }),
    }),
    {
      name: 'k12-sales-training-progress',
    }
  )
);
