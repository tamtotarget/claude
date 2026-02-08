import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { modules } from '../content/modules';
import type { Profile, ModuleProgress } from '../types';

interface EmployeeData {
  profile: Profile;
  progress: ModuleProgress[];
}

interface ManagerRollup {
  manager: Profile;
  members: EmployeeData[];
  avgProgress: number;
  avgQuizScore: number | null;
  fullyCompleted: number;
}

export default function AdminDashboardPage() {
  const [allEmployees, setAllEmployees] = useState<EmployeeData[]>([]);
  const [managers, setManagers] = useState<ManagerRollup[]>([]);
  const [unassigned, setUnassigned] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedManager, setExpandedManager] = useState<string | null>(null);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      // Fetch all profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('onboarded', true);

      if (!profiles) {
        setLoading(false);
        return;
      }

      // Fetch all progress
      const { data: allProgress } = await supabase
        .from('module_progress')
        .select('*');

      const progressMap = new Map<string, ModuleProgress[]>();
      for (const row of allProgress || []) {
        const existing = progressMap.get(row.user_id) || [];
        existing.push({
          moduleId: row.module_id,
          completed: row.completed,
          quizScore: row.quiz_score,
          quizCompleted: row.quiz_completed,
          lastAccessed: row.last_accessed,
        });
        progressMap.set(row.user_id, existing);
      }

      const employees: EmployeeData[] = (profiles as Profile[]).map((p) => ({
        profile: p,
        progress: progressMap.get(p.id) || [],
      }));

      setAllEmployees(employees);

      // Group by manager
      const managerProfiles = (profiles as Profile[]).filter((p) => p.is_manager);
      const managerRollups: ManagerRollup[] = managerProfiles.map((mgr) => {
        const members = employees.filter((e) => e.profile.manager_id === mgr.id);
        const avgProgress = members.length > 0
          ? Math.round(members.reduce((acc, m) => acc + getOverallProgress(m.progress), 0) / members.length)
          : 0;
        const quizScores = members
          .map((m) => getAvgQuizScore(m.progress))
          .filter((s): s is number => s !== null);
        const avgQuizScore = quizScores.length > 0
          ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
          : null;
        const fullyCompleted = members.filter((m) => getOverallProgress(m.progress) === 100).length;

        return { manager: mgr, members, avgProgress, avgQuizScore, fullyCompleted };
      });

      setManagers(managerRollups);

      // Unassigned employees (no manager, and not a manager themselves)
      const assignedIds = new Set(managerRollups.flatMap((mr) => mr.members.map((m) => m.profile.id)));
      const managerIds = new Set(managerProfiles.map((m) => m.id));
      const unassignedEmployees = employees.filter(
        (e) => !assignedIds.has(e.profile.id) && !managerIds.has(e.profile.id) && !e.profile.is_admin
      );
      setUnassigned(unassignedEmployees);

      setLoading(false);
    };

    fetchAll();
  }, []);

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
        <div className="text-gray-500">Loading organization data...</div>
      </div>
    );
  }

  const totalEmployees = allEmployees.filter((e) => !e.profile.is_admin).length;
  const totalCompleted = allEmployees.filter((e) => !e.profile.is_admin && getOverallProgress(e.progress) === 100).length;
  const orgAvgProgress = totalEmployees > 0
    ? Math.round(allEmployees.filter((e) => !e.profile.is_admin).reduce((acc, e) => acc + getOverallProgress(e.progress), 0) / totalEmployees)
    : 0;
  const allQuizScores = allEmployees
    .filter((e) => !e.profile.is_admin)
    .map((e) => getAvgQuizScore(e.progress))
    .filter((s): s is number => s !== null);
  const orgAvgQuizScore = allQuizScores.length > 0
    ? Math.round(allQuizScores.reduce((a, b) => a + b, 0) / allQuizScores.length)
    : null;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">Admin</span>
        </div>
        <p className="text-gray-600">
          Company-wide training overview with manager-level rollups.
        </p>
      </div>

      {/* Org-wide stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Total Employees</div>
          <div className="text-3xl font-bold text-primary">{totalEmployees}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Org Avg Progress</div>
          <div className="text-3xl font-bold text-primary-light">{orgAvgProgress}%</div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-primary-light rounded-full h-1.5" style={{ width: `${orgAvgProgress}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Fully Completed</div>
          <div className="text-3xl font-bold text-secondary">
            {totalCompleted}
            <span className="text-lg text-gray-400">/{totalEmployees}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">Org Avg Quiz Score</div>
          <div className="text-3xl font-bold text-accent">
            {orgAvgQuizScore !== null ? `${orgAvgQuizScore}%` : '—'}
          </div>
        </div>
      </div>

      {/* Manager rollups */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">By Manager</h2>
        </div>

        {managers.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No managers have onboarded yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {managers.map((mr) => {
              const isExpanded = expandedManager === mr.manager.id;
              return (
                <div key={mr.manager.id}>
                  {/* Manager summary row */}
                  <button
                    onClick={() => setExpandedManager(isExpanded ? null : mr.manager.id)}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer bg-transparent border-0 text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold text-sm shrink-0">
                      {mr.manager.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{mr.manager.full_name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">{mr.manager.role}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{mr.members.length} direct reports</div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-center">
                        <div className="text-sm font-bold text-primary">{mr.avgProgress}%</div>
                        <div className="text-xs text-gray-400">Avg Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-accent">{mr.avgQuizScore !== null ? `${mr.avgQuizScore}%` : '—'}</div>
                        <div className="text-xs text-gray-400">Avg Quiz</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-secondary">{mr.fullyCompleted}/{mr.members.length}</div>
                        <div className="text-xs text-gray-400">Done</div>
                      </div>
                    </div>

                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded: team members */}
                  {isExpanded && (
                    <div className="bg-gray-50 border-t border-gray-100">
                      {mr.members.length === 0 ? (
                        <div className="px-6 py-4 text-sm text-gray-500 pl-20">No team members yet.</div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {mr.members.map((member) => {
                            const memberProgress = getOverallProgress(member.progress);
                            const memberQuiz = getAvgQuizScore(member.progress);
                            const isMemberExpanded = expandedMember === member.profile.id;

                            return (
                              <div key={member.profile.id}>
                                <button
                                  onClick={() => setExpandedMember(isMemberExpanded ? null : member.profile.id)}
                                  className="w-full flex items-center gap-4 px-6 py-3 pl-20 hover:bg-gray-100 transition-colors cursor-pointer bg-transparent border-0 text-left"
                                >
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                                    {member.profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-gray-800">{member.profile.full_name}</span>
                                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 text-gray-600">{member.profile.role}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 shrink-0">
                                    <div className="flex items-center gap-2">
                                      <div className="w-20 bg-gray-200 rounded-full h-1.5">
                                        <div
                                          className={`rounded-full h-1.5 ${memberProgress === 100 ? 'bg-secondary' : 'bg-primary-light'}`}
                                          style={{ width: `${memberProgress}%` }}
                                        />
                                      </div>
                                      <span className="text-xs font-medium text-gray-600 w-8">{memberProgress}%</span>
                                    </div>
                                    {memberQuiz !== null && (
                                      <span className="text-xs text-gray-500">Quiz: {memberQuiz}%</span>
                                    )}
                                  </div>
                                  <svg
                                    className={`w-3 h-3 text-gray-400 transition-transform ${isMemberExpanded ? 'rotate-180' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>

                                {isMemberExpanded && (
                                  <div className="px-6 pb-3 pl-32 bg-gray-50">
                                    <div className="grid gap-1.5">
                                      {modules.map((mod) => {
                                        const mp = member.progress.find((p) => p.moduleId === mod.id);
                                        return (
                                          <div key={mod.id} className="flex items-center gap-3 text-xs py-1">
                                            <span>{mod.icon}</span>
                                            <span className="flex-1 text-gray-700">{mod.title}</span>
                                            {mp?.completed ? (
                                              <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700">Done</span>
                                            ) : (
                                              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">—</span>
                                            )}
                                            {mp?.quizCompleted && (
                                              <span className="font-medium text-primary">{mp.quizScore}%</span>
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
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Unassigned employees */}
      {unassigned.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Unassigned Employees
              <span className="text-sm font-normal text-gray-500 ml-2">({unassigned.length})</span>
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {unassigned.map((emp) => {
              const progress = getOverallProgress(emp.progress);
              return (
                <div key={emp.profile.id} className="flex items-center gap-4 px-6 py-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-xs shrink-0">
                    {emp.profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-800">{emp.profile.full_name}</span>
                    <span className="text-xs text-gray-500 ml-2">{emp.profile.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-primary-light rounded-full h-1.5" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
