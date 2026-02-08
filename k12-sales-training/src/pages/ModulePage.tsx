import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useProgressStore } from '../stores/progressStore';
import { modules } from '../content/modules';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function ModulePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { markModuleCompleted, updateLastAccessed, getModuleProgress } = useProgressStore();

  const moduleId = Number(id);
  const mod = modules.find((m) => m.id === moduleId);
  const modProgress = getModuleProgress(moduleId);

  useEffect(() => {
    if (mod) {
      updateLastAccessed(mod.id);
    }
  }, [mod, updateLastAccessed]);

  if (!mod) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Module not found</h2>
        <p className="text-gray-500 mb-4">The module you're looking for doesn't exist.</p>
        <Link to="/" className="text-primary hover:underline">
          Return to home
        </Link>
      </div>
    );
  }

  const hasQuiz = mod.quiz.questions.length > 0;
  const nextModule = modules.find((m) => m.id === moduleId + 1);

  const handleMarkComplete = () => {
    markModuleCompleted(mod.id);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary no-underline text-gray-500">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Module {mod.id}</span>
      </nav>

      {/* Module content */}
      <article className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <MarkdownRenderer content={mod.content} />
      </article>

      {/* Action bar */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            {modProgress.completed ? (
              <div className="flex items-center gap-2 text-secondary font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Module completed
                {modProgress.quizCompleted && (
                  <span className="text-sm text-gray-500 ml-2">
                    Quiz score: {modProgress.quizScore}%
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={handleMarkComplete}
                className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors cursor-pointer border-0"
              >
                Mark as Complete
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {hasQuiz && (
              <button
                onClick={() => navigate(`/quiz/${mod.id}`)}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer border-0"
              >
                {modProgress.quizCompleted ? 'Retake Quiz' : 'Take Quiz'}
              </button>
            )}
            {nextModule && (
              <Link
                to={`/module/${nextModule.id}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors no-underline"
              >
                Next Module →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
