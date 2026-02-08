import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProgressStore } from '../stores/progressStore';
import { modules } from '../content/modules';
import type { Role } from '../types';

const roles: Role[] = ['SDR', 'GTM Engineer', 'SDR Manager', 'CSM'];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { progress, setRole, getOverallProgress, getModuleProgress } = useProgressStore();
  const overallProgress = getOverallProgress();

  const filteredModules = modules.filter((m) => m.roles.includes(progress.role));

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <h1 className="text-lg font-bold text-primary">K-12 Sales Training</h1>
        <div className="w-10" />
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transition-transform duration-200 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="block no-underline">
            <h1 className="text-xl font-bold text-primary">K-12 Sales Training</h1>
            <p className="text-sm text-gray-500 mt-1">Master the education market</p>
          </Link>
        </div>

        {/* Role selector */}
        <div className="p-4 border-b border-gray-200">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Your Role
          </label>
          <select
            value={progress.role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500">Overall Progress</span>
            <span className="text-xs font-bold text-primary">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-light rounded-full h-2 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Module navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {filteredModules.map((mod) => {
            const modProgress = getModuleProgress(mod.id);
            const isActive = location.pathname === `/module/${mod.id}` || location.pathname === `/quiz/${mod.id}`;

            return (
              <Link
                key={mod.id}
                to={`/module/${mod.id}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{mod.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{mod.title}</div>
                </div>
                {modProgress.completed && (
                  <span className={`text-sm ${isActive ? 'text-white' : 'text-secondary'}`}>
                    ✓
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Dashboard link */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors ${
              location.pathname === '/dashboard'
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Progress Dashboard
          </Link>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
