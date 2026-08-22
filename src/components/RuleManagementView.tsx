import React, { useState } from 'react';
import {
  Scale,
  ShieldAlert,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  RotateCcw,
  Search,
  Filter,
  BookOpen,
  Info,
  Sliders,
  Check,
} from 'lucide-react';
import { LegalMetrologyRule, Severity } from '../types';
import { StorageRepository } from '../utils/storage';
import { useToast } from './Toast';

export const RuleManagementView: React.FC = () => {
  const { showToast } = useToast();
  const [rules, setRules] = useState<LegalMetrologyRule[]>(StorageRepository.getRules());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const handleToggleRule = (rule: LegalMetrologyRule) => {
    const updated = { ...rule, enabled: !rule.enabled };
    StorageRepository.saveRule(updated);
    setRules(StorageRepository.getRules());
    showToast({
      type: 'info',
      title: 'Rule Status Updated',
      message: `${rule.ruleReference} is now ${updated.enabled ? 'Enabled' : 'Disabled'}.`,
    });
  };

  const handleSeverityChange = (rule: LegalMetrologyRule, severity: Severity) => {
    const updated = { ...rule, defaultSeverity: severity };
    StorageRepository.saveRule(updated);
    setRules(StorageRepository.getRules());
    showToast({
      type: 'success',
      title: 'Severity Updated',
      message: `${rule.ruleReference} severity set to ${severity}.`,
    });
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all Legal Metrology rules and severities to official statutory defaults?')) {
      StorageRepository.resetRulesToDefault();
      setRules(StorageRepository.getRules());
      showToast({
        type: 'info',
        title: 'Rules Reset',
        message: 'Statutory defaults for PC Rules 2011 restored.',
      });
    }
  };

  const filtered = rules.filter((r) => {
    const matchSearch =
      r.ruleReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.actSection && r.actSection.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchCategory = categoryFilter === 'ALL' || r.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Rule Configuration Engine</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Legal Metrology (Packaged Commodities) Rules, 2011
          </h1>
          <p className="text-xs text-slate-500">
            Active compliance verification matrix and statutory rule definitions under Legal Metrology Act, 2009.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Statutory Defaults</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search rule reference, title, or Act section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:w-64">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Mandatory Declarations">Mandatory Declarations</option>
            <option value="Pricing & MRP">Pricing &amp; MRP</option>
            <option value="Net Quantity">Net Quantity</option>
            <option value="Consumer Protection">Consumer Protection</option>
            <option value="Legibility & Font">Legibility &amp; Font</option>
          </select>
        </div>
      </div>

      {/* Rule Cards List */}
      <div className="space-y-3">
        {filtered.map((rule) => (
          <div
            key={rule.id}
            className={`bg-white border rounded-xl p-5 shadow-xs transition-all ${
              rule.enabled ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {rule.ruleReference}
                  </span>
                  {rule.actSection && (
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {rule.actSection}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {rule.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{rule.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{rule.description}</p>
                <div className="text-[11px] text-slate-500 pt-1">
                  <span className="font-semibold text-slate-700">Enforcement Rationale:</span>{' '}
                  {rule.legalExplanation}
                </div>
              </div>

              {/* Controls */}
              <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-3 shrink-0">
                {/* Enable/Disable Toggle */}
                <button
                  onClick={() => handleToggleRule(rule)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    rule.enabled
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {rule.enabled ? 'RULE ACTIVE' : 'RULE DISABLED'}
                </button>

                {/* Severity Dropdown */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-500">Severity:</span>
                  <select
                    value={rule.defaultSeverity}
                    onChange={(e) => handleSeverityChange(rule, e.target.value as Severity)}
                    className={`text-[10px] font-bold uppercase rounded-md px-2 py-1 bg-slate-50 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      rule.defaultSeverity === 'CRITICAL'
                        ? 'text-red-700 border-red-200 bg-red-50'
                        : rule.defaultSeverity === 'MODERATE'
                        ? 'text-amber-700 border-amber-200 bg-amber-50'
                        : 'text-slate-700 border-slate-200 bg-slate-50'
                    }`}
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="MINOR">MINOR</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
