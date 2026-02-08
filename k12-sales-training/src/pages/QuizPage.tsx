import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../stores/progressStore';
import { modules } from '../content/modules';

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { saveQuizScore, markModuleCompleted } = useProgressStore();

  const moduleId = Number(id);
  const mod = modules.find((m) => m.id === moduleId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!mod || mod.quiz.questions.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz not available</h2>
        <p className="text-gray-500 mb-4">This module doesn't have a quiz yet.</p>
        <Link to={`/module/${moduleId}`} className="text-primary hover:underline">
          Return to module
        </Link>
      </div>
    );
  }

  const questions = mod.quiz.questions;
  const question = questions[currentQuestion];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const hasAnswered = selectedAnswers[currentQuestion] !== undefined;
  const isCorrect = selectedAnswers[currentQuestion] === question.correctAnswer;

  const handleSelectAnswer = (answerIndex: number) => {
    if (hasAnswered) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion]: answerIndex }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (isLastQuestion) {
      const correctCount = questions.reduce((acc, q, idx) => {
        return acc + (selectedAnswers[idx] === q.correctAnswer ? 1 : 0);
      }, 0);
      const score = Math.round((correctCount / totalQuestions) * 100);
      saveQuizScore(moduleId, score);
      markModuleCompleted(moduleId);
      setShowResult(true);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  if (showResult) {
    const correctCount = questions.reduce((acc, q, idx) => {
      return acc + (selectedAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 70;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className={`text-6xl mb-4 ${passed ? 'text-secondary' : 'text-accent'}`}>
            {passed ? '🎉' : '📚'}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </h2>
          <p className="text-gray-600 mb-6">
            You scored <span className="font-bold text-lg">{score}%</span> ({correctCount}/{totalQuestions} correct)
          </p>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                passed ? 'bg-secondary' : 'bg-accent'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>

          {/* Review answers */}
          <div className="text-left space-y-4 mb-8">
            {questions.map((q, idx) => {
              const wasCorrect = selectedAnswers[idx] === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-lg border ${
                    wasCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm mt-0.5">{wasCorrect ? '✅' : '❌'}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{q.question}</p>
                      {!wasCorrect && (
                        <p className="text-xs text-gray-600 mt-1">
                          Correct answer: {q.options[q.correctAnswer]}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswers({});
                setShowResult(false);
                setShowExplanation(false);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer border-0"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => navigate(`/module/${moduleId}`)}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer border-0"
            >
              Back to Module
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary no-underline text-gray-500">Home</Link>
        <span>/</span>
        <Link to={`/module/${mod.id}`} className="hover:text-primary no-underline text-gray-500">
          Module {mod.id}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Quiz</span>
      </nav>

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900">
            {mod.title} — Quiz
          </h2>
          <span className="text-sm text-gray-500">
            {currentQuestion + 1} / {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-primary-light rounded-full h-1.5 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        {question.scenario && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
              Scenario
            </div>
            <p className="text-sm text-amber-900">{question.scenario}</p>
          </div>
        )}

        <h3 className="text-lg font-semibold text-gray-900 mb-6">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let optionStyle = 'border-gray-200 hover:border-primary-light hover:bg-blue-50';
            if (hasAnswered) {
              if (idx === question.correctAnswer) {
                optionStyle = 'border-green-400 bg-green-50';
              } else if (idx === selectedAnswers[currentQuestion] && !isCorrect) {
                optionStyle = 'border-red-400 bg-red-50';
              } else {
                optionStyle = 'border-gray-200 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                disabled={hasAnswered}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm cursor-pointer bg-transparent ${optionStyle} ${
                  hasAnswered ? 'cursor-default' : ''
                }`}
              >
                <span className="font-medium text-gray-500 mr-2">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="text-gray-800">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && hasAnswered && (
          <div
            className={`mt-6 p-4 rounded-lg border ${
              isCorrect
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{isCorrect ? '✅' : '❌'}</span>
              <span className={`text-sm font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            <p className="text-sm text-gray-600">{question.explanation}</p>
          </div>
        )}

        {/* Navigation */}
        {hasAnswered && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer border-0"
            >
              {isLastQuestion ? 'See Results' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
