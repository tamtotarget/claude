import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { modules } from '../content/modules';
import type { Profile, ModuleProgress } from '../types';

interface TeamMemberData {
  profile: Profile;
  progress: ModuleProgress[];
}

export default function TeamDashboardPage() {
  const { user } = useAuthStore();
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!user) return;

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('manager_id', user.id);

      if (profileError) {
        console.error('Error fetching team:', profileError);
        setLoading(false);
        return;
      }

      const members: TeamMemberData[] = [];
      for (const profile of (profiles || []) as Profile[]) {
        const { data: progress } = await supabase
          .from('module_progress')
          .select('*')
          .eq('user_id', profile.id);

        members.push({
          profile,
          progress: (progress || []).map((row) => ({
            moduleId: row.module_id,
            completed: row.completed,
            quizScore: row.quiz_score,
            quizCompleted: row.quiz_completed,
            lastAccessed: row.last_accessed,
          })),
        });
      }

      setTeamMembers(members);
      setLoading(false);
    };

    fetchTeam();
  }, [user]);

  const getOverallProgress = (progress: ModuleProgress[]) => {
    const completed = progress.filter((p) => p.completed).length;
    return Math.round((completed / modules.length) * 100);
  };

  const getAvgQuizScore = (progress: ModuleProgress[]) => {
    const quizzes = progress.filter((p) => p.quizCompleted && p.quizScore !== null);
    if (quizzes.length === 0) return null;
    return Math.round(quizzes.reduce((acc, p) => acc + (p.quizScore || 0), 0) / quizzes.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-gray-500">Loading team data...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Dashboard</h1>
        <p className="text-gray-600">
          Track your team's training progress and quiz scores.
        </p>
      </div>

      {/* Team summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Team Members</div>
          <div className="text-3xl font-bold text-primary">{teamMembers.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Fully Completed</div>
          <div className="text-3xl font-bold text-secondary">
            {teamMembers.filter((m) => getOverallProgress(m.progress) === 100).length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Avg Progress</div>
          <div className="text-3xl font-bold text-accent">
            {teamMembers.length > 0
              ? Math.round(
                  teamMembers.reduce((acc, m) => acc + getOverallProgress(m.progress), 0) /
                    teamMembers.length
                )
              : 0}%
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Avg Quiz Score</div>
          <div className="text-3xl font-bold text-primary-light">
            {(() => {
              const scores = teamMembers
                .map((m) => getAvgQuizScore(m.progress))
                .filter((s): s is number => s !== null);
              return scores.length > 0
                ? `${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}%`
                : '—';
            })()}
          </div>
        </div>
      </div>

      {/* Team members list */}
      {teamMembers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members yet</h3>
          <p className="text-sm text-gray-500">
            When team members sign up and select you as their manager, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {teamMembers.map((member) => {
              const overallPct = getOverallProgress(member.progress);
              const avgScore = getAvgQuizScore(member.progress);
              const isExpanded = expandedMember === member.profile.id;
              const completedModules = member.progress.filter((p) => p.completed).length;

              return (
                <div key={member.profile.id}>
                  <button
                    onClick={() => setExpandedMember(isExpanded ? null : member.profile.id)}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer bg-transparent border-0 text-left"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                      {member.profile.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {member.profile.full_name}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {member.profile.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex-1 max-w-48">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`rounded-full h-1.5 transition-all ${
                                overallPct === 100 ? 'bg-secondary' : 'bg-primary-light'
                              }`}
                              style={{ width: `${overallPct}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {completedModules}/{modules.length} modules
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-primary">{overallPct}%</div>
                      {avgScore !== null && (
                        <div className="text-xs text-gray-400">Quiz avg: {avgScore}%</div>
                      )}
                    </div>

                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded module details */}
                  {isExpanded && (
                    <div className="px-6 pb-4 bg-gray-50">
                      <div className="grid gap-2 pl-14">
                        {modules.map((mod) => {
                          const mp = member.progress.find((p) => p.moduleId === mod.id);
                          return (
                            <div
                              key={mod.id}
                              className="flex items-center gap-3 text-sm py-1.5"
                            >
                              <span>{mod.icon}</span>
                              <span className="flex-1 text-gray-700">
                                {mod.title}
                              </span>
                              {mp?.completed ? (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                  Complete
                                </span>
                              ) : (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                  Not started
                                </span>
                              )}
                              {mp?.quizCompleted && (
                                <span className="text-xs font-medium text-primary">
                                  {mp.quizScore}%
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
