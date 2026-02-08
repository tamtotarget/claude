import { Link } from 'react-router-dom';
import { useProgressStore } from '../stores/progressStore';
import { modules } from '../content/modules';

export default function HomePage() {
  const { progress, getModuleProgress } = useProgressStore();
  const filteredModules = modules.filter((m) => m.roles.includes(progress.role));

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to K-12 Sales Training
        </h1>
        <p className="text-lg text-gray-600">
          Build expertise in selling to the education market. Select a module below to get started.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
          Learning as: {progress.role}
        </div>
      </div>

      {/* Module grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredModules.map((mod) => {
          const modProgress = getModuleProgress(mod.id);
          const hasQuiz = mod.quiz.questions.length > 0;

          return (
            <Link
              key={mod.id}
              to={`/module/${mod.id}`}
              className="group block bg-white rounded-xl border border-gray-200 p-6 no-underline hover:border-primary-light hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{mod.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      Module {mod.id}
                    </h3>
                    {modProgress.completed && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                        Completed
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-medium text-gray-700 mb-2">{mod.title}</h4>
                  <p className="text-sm text-gray-500 mb-3">{mod.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {hasQuiz && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Quiz ({mod.quiz.questions.length} questions)
                        {modProgress.quizCompleted && ` — ${modProgress.quizScore}%`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {Object.values(progress.modules).filter((m) => m.completed).length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Modules Completed</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-secondary">
            {Object.values(progress.modules).filter((m) => m.quizCompleted).length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Quizzes Passed</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-accent">
            {filteredModules.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Available Modules</div>
        </div>
      </div>
    </div>
  );
}
