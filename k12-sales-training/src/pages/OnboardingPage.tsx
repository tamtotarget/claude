import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import type { Role, Profile } from '../types';

const roles: { value: Role; label: string; description: string }[] = [
  { value: 'SDR', label: 'SDR', description: 'Sales Development Representative — outbound prospecting and lead generation' },
  { value: 'GTM Engineer', label: 'GTM Engineer', description: 'Go-to-Market Engineer — technical sales support and demos' },
  { value: 'SDR Manager', label: 'SDR Manager', description: 'SDR Manager — leading and coaching the SDR team' },
  { value: 'CSM', label: 'CSM', description: 'Customer Success Manager — onboarding, retention, and expansion' },
  { value: 'Other', label: 'Other', description: 'Other team member — access all training modules' },
];

export default function OnboardingPage() {
  const { user, updateProfile } = useAuthStore();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');
  const [selectedManagerId, setSelectedManagerId] = useState('');
  const [managers, setManagers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || user?.user_metadata?.name || ''
  );

  const isManagerRole = selectedRole === 'SDR Manager';

  useEffect(() => {
    const fetchManagers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_manager', true);
      if (data) setManagers(data as Profile[]);
    };
    fetchManagers();
  }, []);

  const handleComplete = async () => {
    if (!selectedRole) return;
    setLoading(true);
    try {
      await updateProfile({
        full_name: fullName,
        role: selectedRole,
        is_manager: isManagerRole,
        manager_id: isManagerRole ? null : (selectedManagerId || null),
        onboarded: true,
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to the team!</h1>
          <p className="text-gray-600 mt-1">Let's get you set up in a couple of steps.</p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                s === step ? 'bg-primary' : s < step ? 'bg-secondary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {/* Step 1: Name confirmation */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Confirm your name</h2>
              <p className="text-sm text-gray-500 mb-6">This is how your manager and teammates will see you.</p>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
              />
              <button
                onClick={() => fullName.trim() && setStep(2)}
                disabled={!fullName.trim()}
                className="mt-6 w-full px-4 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Role selection */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">What's your role?</h2>
              <p className="text-sm text-gray-500 mb-6">
                We'll tailor the training modules to your role.
              </p>
              <div className="space-y-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm cursor-pointer bg-transparent ${
                      selectedRole === role.value
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{role.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{role.description}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer border-0"
                >
                  Back
                </button>
                <button
                  onClick={() => selectedRole && setStep(3)}
                  disabled={!selectedRole}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Manager selection (or confirmation for managers) */}
          {step === 3 && (
            <div>
              {isManagerRole ? (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">You're a manager!</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    You'll be able to see your team's progress and training status in the Team Dashboard. Team members will select you as their manager when they onboard.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">📊</span>
                      <div>
                        <div className="text-sm font-medium text-gray-800">Manager features include:</div>
                        <ul className="text-xs text-gray-600 mt-1 space-y-1 list-disc pl-4">
                          <li>Team progress overview</li>
                          <li>Individual module & quiz tracking</li>
                          <li>Onboarding completion status</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Who's your manager?</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Your manager will be able to track your training progress.
                  </p>
                  {managers.length > 0 ? (
                    <div className="space-y-3">
                      {managers.map((mgr) => (
                        <button
                          key={mgr.id}
                          onClick={() => setSelectedManagerId(mgr.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm cursor-pointer bg-transparent ${
                            selectedManagerId === mgr.id
                              ? 'border-primary bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium text-gray-900">{mgr.full_name}</div>
                          <div className="text-xs text-gray-500">{mgr.email}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-sm text-gray-500">
                      <p>No managers have signed up yet.</p>
                      <p className="text-xs mt-1">You can skip this and update later.</p>
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer border-0"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer border-0 disabled:opacity-50"
                >
                  {loading ? 'Setting up...' : 'Start Training'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
