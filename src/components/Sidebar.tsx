import React from 'react';
import {
  LayoutDashboard,
  FilePlus2,
  History,
  Boxes,
  Scale,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  currentUser?: User;
  userRole: UserRole;
  pendingReviewsCount: number;
  totalInspectionsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  currentUser,
  userRole,
  pendingReviewsCount,
  totalInspectionsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'new-inspection',
      label: 'New Inspection',
      icon: FilePlus2,
      badge: null,
    },
    {
      id: 'history',
      label: 'History',
      icon: History,
      badge: totalInspectionsCount > 0 ? `${totalInspectionsCount}` : null,
    },
    {
      id: 'products',
      label: 'Product History',
      icon: Boxes,
      badge: null,
    },
    {
      id: 'rules',
      label: 'Compliance Rules',
      icon: Scale,
      badge: '2011',
    },
    {
      id: 'admin',
      label: 'Officers & Admin',
      icon: Users,
      badge: userRole === 'admin' ? 'Admin' : null,
    },
  ];

  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'LM';

  return (
    <aside className="w-64 bg-[#0f172a] h-[calc(100vh-4rem)] sticky top-16 shrink-0 flex flex-col justify-between hidden md:flex select-none border-r border-slate-800">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Brand Header */}
        <div className="px-5 py-4 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs border border-blue-400/30 text-white">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight">PackCheck Portal</span>
            <span className="block text-[10px] text-slate-400 font-mono">
              LM Act 2009 Enforcement
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full rounded-lg px-3 py-2.5 flex items-center justify-between transition-colors text-left text-xs font-semibold ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold shrink-0 ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Inspector Profile in Sidebar */}
      <div className="p-3 border-t border-slate-800 bg-[#090d16]">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-blue-900 border border-blue-500/40 flex items-center justify-center text-blue-200 font-bold shrink-0 text-xs font-mono">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {currentUser?.name || 'Ravi Kumar'}
            </p>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              {currentUser?.badgeNumber || 'LM-DL-2024-883'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
