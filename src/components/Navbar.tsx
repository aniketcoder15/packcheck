import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Building2,
  FileCheck2,
  Menu,
  X,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { User as UserType } from '../types';
import { DEMO_USERS, DEMO_PRESETS } from '../utils/sampleData';
import { StorageRepository } from '../utils/storage';
import { useToast } from './Toast';

interface NavbarProps {
  currentUser: UserType;
  onSelectUser: (user: UserType) => void;
  onLoadPreset: (presetId: string) => void;
  onOpenNewInspection: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectUser,
  onLoadPreset,
  onOpenNewInspection,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { showToast } = useToast();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  const handleUserChange = (user: UserType) => {
    onSelectUser(user);
    setUserDropdownOpen(false);
    showToast({
      type: 'info',
      title: `Switched User Profile`,
      message: `Active as ${user.name} (${user.designation})`,
    });
  };

  const handleSelectPreset = (presetId: string) => {
    onLoadPreset(presetId);
    setPresetDropdownOpen(false);
    const p = DEMO_PRESETS.find((x) => x.id === presetId);
    showToast({
      type: 'success',
      title: 'Demo Package Loaded',
      message: `Loaded "${p?.name}" with label declarations & evidence.`,
    });
  };

  const handleResetData = () => {
    if (window.confirm('Reset all inspections and rules to default sample records?')) {
      StorageRepository.resetDemoData();
      showToast({
        type: 'info',
        title: 'Demo Data Restored',
        message: 'All sample inspections and statutory rules have been reset to factory defaults.',
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-xs">
      {/* Top Govt Bar */}
      <div className="bg-slate-900 px-4 sm:px-8 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-300 font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold text-white">Government of India</span>
          <span className="text-slate-500">•</span>
          <span>Ministry of Consumer Affairs, Food &amp; Public Distribution</span>
          <span className="hidden lg:inline text-slate-500">•</span>
          <span className="hidden lg:inline text-slate-400">Department of Consumer Affairs</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-300">
          <span className="font-mono text-slate-400">Legal Metrology Act, 2009</span>
          <span>•</span>
          <button
            onClick={() => setShowDisclaimerModal(true)}
            className="hover:text-white text-sky-400 underline flex items-center gap-1 font-semibold transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Statutory Disclaimer
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full px-4 sm:px-8 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#1e3a8a] rounded-lg flex items-center justify-center text-white shadow-xs border border-blue-900">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight font-sans">
                    Pack<span className="text-[#1e3a8a]">Check</span>
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300 tracking-wider uppercase hidden sm:inline-block">
                    LM-PCR Portal
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium leading-none hidden sm:block">
                  Packaged Commodities Enforcement System
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Demo Presets */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Preset Picker */}
            <div className="relative">
              <button
                onClick={() => {
                  setPresetDropdownOpen(!presetDropdownOpen);
                  setUserDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold shadow-2xs transition-colors"
                title="Load realistic packaged commodity samples"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Load Sample Package</span>
                <span className="sm:hidden">Samples</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {presetDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                    Select Test Sample Package
                  </div>
                  <div className="py-1 space-y-1 max-h-80 overflow-y-auto">
                    {DEMO_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset.id)}
                        className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex flex-col gap-0.5 text-xs transition-colors border border-transparent hover:border-slate-200"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-900 truncate">{preset.name}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                              preset.expectedStatus === 'COMPLIANT'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : preset.expectedStatus === 'NEEDS_REVIEW'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {preset.expectedStatus === 'COMPLIANT'
                              ? 'Compliant'
                              : preset.expectedStatus === 'NEEDS_REVIEW'
                              ? 'Review'
                              : 'Violation'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{preset.summary}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Start New Inspection Button */}
            <button
              onClick={onOpenNewInspection}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-bold shadow-xs transition-all"
            >
              <FileCheck2 className="w-4 h-4" />
              <span className="hidden sm:inline">New Inspection</span>
              <span className="sm:hidden">Inspect</span>
            </button>

            {/* User Account / Role Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setPresetDropdownOpen(false);
                }}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-xs text-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-[#1e3a8a] text-xs font-bold shrink-0">
                  {(currentUser?.name || 'Officer').charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                    {(currentUser?.name || 'Officer').split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">{currentUser?.role || 'inspector'}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{currentUser?.name || 'Authorized Officer'}</div>
                    <div className="text-[11px] text-slate-500">{currentUser?.designation || 'Field Inspector'}</div>
                    <div className="text-[10px] text-blue-700 mt-1 font-mono font-medium">{currentUser?.badgeNumber || 'LM-DL-2024-883'}</div>
                  </div>

                  <div className="py-1">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Role Account
                    </div>
                    {DEMO_USERS.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleUserChange(u)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          u.id === currentUser.id
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{u.name}</span>
                          <span className="text-[10px] text-slate-500 capitalize">{u.role}</span>
                        </div>
                        {u.id === currentUser.id && (
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleResetData}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-amber-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Restore Default Sample DB
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Disclaimer Modal */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 max-w-lg w-full rounded-2xl p-6 shadow-2xl text-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-orange-600 mb-3">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">Statutory Legal Disclaimer</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 mb-3">
              This system assists inspection by identifying potential non-compliances under the Legal Metrology (Packaged Commodities) Rules, 2011 and amendments.
            </p>
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1 mb-4">
              <p>• Automated computer vision and OCR screenings identify potential discrepancies.</p>
              <p>• Final legal determination remains strictly with the competent statutory authority / Legal Metrology Officer.</p>
              <p>• All potential non-compliances must be physically verified prior to issuing statutory notices under Section 36 of Legal Metrology Act, 2009.</p>
            </div>
            <button
              onClick={() => setShowDisclaimerModal(false)}
              className="w-full py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-lg text-xs font-bold transition-colors"
            >
              Acknowledged
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
