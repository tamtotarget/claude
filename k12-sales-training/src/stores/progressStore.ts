import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { ModuleProgress } from '../types';

interface ProgressState {
  modules: Record<number, ModuleProgress>;
  loading: boolean;

  fetchProgress: (userId: string) => Promise<void>;
  markModuleCompleted: (userId: string, moduleId: number) => Promise<void>;
  saveQuizScore: (userId: string, moduleId: number, score: number) => Promise<void>;
  updateLastAccessed: (userId: string, moduleId: number) => Promise<void>;
  getModuleProgress: (moduleId: number) => ModuleProgress;
  getOverallProgress: () => number;
}

const TOTAL_MODULES = 6;

const defaultModuleProgress = (moduleId: number): ModuleProgress => ({
  moduleId,
  completed: false,
  quizScore: null,
  quizCompleted: false,
  lastAccessed: new Date().toISOString(),
});

export const useProgressStore = create<ProgressState>()((set, get) => ({
  modules: {},
  loading: false,

  fetchProgress: async (userId: string) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('module_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching progress:', error);
      set({ loading: false });
      return;
    }

    const modules: Record<number, ModuleProgress> = {};
    for (const row of data || []) {
      modules[row.module_id] = {
        moduleId: row.module_id,
        completed: row.completed,
        quizScore: row.quiz_score,
        quizCompleted: row.quiz_completed,
        lastAccessed: row.last_accessed,
      };
    }
    set({ modules, loading: false });
  },

  markModuleCompleted: async (userId: string, moduleId: number) => {
    const now = new Date().toISOString();
    const existing = get().modules[moduleId];

    const { error } = await supabase
      .from('module_progress')
      .upsert({
        user_id: userId,
        module_id: moduleId,
        completed: true,
        quiz_score: existing?.quizScore ?? null,
        quiz_completed: existing?.quizCompleted ?? false,
        last_accessed: now,
        updated_at: now,
      }, { onConflict: 'user_id,module_id' });

    if (error) {
      console.error('Error marking module complete:', error);
      return;
    }

    set((state) => ({
      modules: {
        ...state.modules,
        [moduleId]: {
          ...(state.modules[moduleId] || defaultModuleProgress(moduleId)),
          completed: true,
          lastAccessed: now,
        },
      },
    }));
  },

  saveQuizScore: async (userId: string, moduleId: number, score: number) => {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('module_progress')
      .upsert({
        user_id: userId,
        module_id: moduleId,
        completed: true,
        quiz_score: score,
        quiz_completed: true,
        last_accessed: now,
        updated_at: now,
      }, { onConflict: 'user_id,module_id' });

    if (error) {
      console.error('Error saving quiz score:', error);
      return;
    }

    set((state) => ({
      modules: {
        ...state.modules,
        [moduleId]: {
          ...(state.modules[moduleId] || defaultModuleProgress(moduleId)),
          quizScore: score,
          quizCompleted: true,
          completed: true,
          lastAccessed: now,
        },
      },
    }));
  },

  updateLastAccessed: async (userId: string, moduleId: number) => {
    const now = new Date().toISOString();
    const existing = get().modules[moduleId];

    const { error } = await supabase
      .from('module_progress')
      .upsert({
        user_id: userId,
        module_id: moduleId,
        completed: existing?.completed ?? false,
        quiz_score: existing?.quizScore ?? null,
        quiz_completed: existing?.quizCompleted ?? false,
        last_accessed: now,
        updated_at: now,
      }, { onConflict: 'user_id,module_id' });

    if (error) {
      console.error('Error updating last accessed:', error);
      return;
    }

    set((state) => ({
      modules: {
        ...state.modules,
        [moduleId]: {
          ...(state.modules[moduleId] || defaultModuleProgress(moduleId)),
          lastAccessed: now,
        },
      },
    }));
  },

  getModuleProgress: (moduleId: number) => {
    const state = get();
    return state.modules[moduleId] || defaultModuleProgress(moduleId);
  },

  getOverallProgress: () => {
    const state = get();
    const completedCount = Object.values(state.modules).filter(
      (m) => m.completed
    ).length;
    return Math.round((completedCount / TOTAL_MODULES) * 100);
  },
}));
