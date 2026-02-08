export type Role = 'SDR' | 'GTM Engineer' | 'SDR Manager' | 'CSM';

export interface Module {
  id: number;
  title: string;
  description: string;
  icon: string;
  content: string;
  quiz: Quiz;
  roles: Role[];
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  scenario?: string;
}

export interface ModuleProgress {
  moduleId: number;
  completed: boolean;
  quizScore: number | null;
  quizCompleted: boolean;
  lastAccessed: string;
}

export interface UserProgress {
  role: Role;
  modules: Record<number, ModuleProgress>;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: Role | '';
  is_manager: boolean;
  manager_id: string | null;
  onboarded: boolean;
  created_at: string;
}

export interface TeamMember {
  profile: Profile;
  progress: ModuleProgress[];
}
