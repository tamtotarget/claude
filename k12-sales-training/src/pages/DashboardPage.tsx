import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';
import { modules } from '../content/modules';
import type { Role } from '../types';

export default function DashboardPage() {
  const { profile } = useAuthStore();
  const { modules: progressModules, getModuleProgress, getOverallProgress } = useProgressStore();
  const overallProgress = getOverallProgress();
  const role = (profile?.role || 'SDR') as Role;
  const filteredModules = modules.filter((m) => m.roles.includes(role));

  const completedModules = Object.values(progressModules).filter((m) => m.completed).length;
  const completedQuizzes = Object.values(progressModules).filter((m) => m.quizCompleted).length;
  const avgScore =
    completedQuizzes > 0
      ? Math.round(
          Object.values(progressModules)
            .filter((m) => m.quizCompleted && m.quizScore !== null)
            .reduce((acc, m) => acc + (m.quizScore || 0), 0) / completedQuizzes
        )
      : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Progress</h1>
        <p className="text-gray-600">
          Track your learning journey across all modules.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Overall Progress</div>
          <div className="text-3xl font-bold text-primary">{overallProgress}%</div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-primary-light rounded-full h-1.5 transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Modules Completed</div>
          <div className="text-3xl font-bold text-secondary">
            {completedModules}
            <span className="text-lg text-gray-400">/{modules.length}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Quizzes Passed</div>
          <div className="text-3xl font-bold text-accent">{completedQuizzes}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Average Score</div>
          <div className="text-3xl font-bold text-primary-light">
            {avgScore > 0 ? `${avgScore}%` : '—'}
          </div>
        </div>
      </div>

      {/* Module details */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Module Progress</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredModules.map((mod) => {
            const modProgress = getModuleProgress(mod.id);
            const hasQuiz = mod.quiz.questions.length > 0;

            return (
              <Link
                key={mod.id}
                to={`/module/${mod.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors no-underline"
              >
                <span className="text-2xl">{mod.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      Module {mod.id}: {mod.title}
                    </span>
                    {modProgress.completed && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Complete
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {modProgress.completed
                      ? `Completed on ${new Date(modProgress.lastAccessed).toLocaleDateString()}`
                      : 'Not started'}
                  </div>
                </div>
                {hasQuiz && (
                  <div className="text-right">
                    {modProgress.quizCompleted ? (
                      <div>
                        <div className="text-sm font-bold text-primary">
                          {modProgress.quizScore}%
                        </div>
                        <div className="text-xs text-gray-400">Quiz Score</div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">Quiz available</div>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
