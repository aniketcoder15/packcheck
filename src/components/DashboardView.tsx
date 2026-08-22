import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  Boxes,
  Eye,
  FileText,
  PlusCircle,
  Sparkles,
  ArrowUpRight,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  HelpCircle,
  Copy,
  Trash2,
} from 'lucide-react';
import { InspectionRecord, User } from '../types';
import { DEMO_PRESETS } from '../utils/sampleData';
import { StorageRepository } from '../utils/storage';
import { useToast } from './Toast';

interface DashboardViewProps {
  inspections: InspectionRecord[];
  currentUser: User;
  onNavigateToNew: () => void;
  onViewInspection: (inspection: InspectionRecord) => void;
  onGenerateReport: (inspection: InspectionRecord) => void;
  onLoadPreset: (presetId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  inspections,
  currentUser,
  onNavigateToNew,
  onViewInspection,
  onGenerateReport,
  onLoadPreset,
}) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Compute live statistics strictly from stored inspections
  const total = inspections.length;
  const compliantCount = inspections.filter((i) => i.overallStatus === 'COMPLIANT').length;
  const nonCompliantCount = inspections.filter((i) => i.overallStatus === 'POTENTIAL_NON_COMPLIANCE').length;
  const needsReviewCount = inspections.filter((i) => i.overallStatus === 'NEEDS_REVIEW').length;
  
  const avgScore =
    total > 0
      ? Math.round(inspections.reduce((acc, curr) => acc + curr.complianceScore, 0) / total)
      : 0;

  const compliancePercentage = total > 0 ? Math.round((compliantCount / total) * 100) : 0;

  // Violation Category Breakdown
  const categoryViolations: Record<string, number> = {
    'Mandatory Details (Mfg/Addr)': 0,
    'Pricing & MRP / Taxes': 0,
    'Unit Sale Price (USP)': 0,
    'Net Quantity & Units': 0,
    'Consumer Care Details': 0,
    'Date & Shelf Life': 0,
    'Country of Origin': 0,
    'Font & Readability': 0,
  };

  inspections.forEach((insp) => {
    insp.findings.forEach((f) => {
      if (f.status === 'FAIL') {
        if (f.ruleId.includes('MFG') || f.ruleId.includes('PIN')) categoryViolations['Mandatory Details (Mfg/Addr)']++;
        if (f.ruleId.includes('MRP') || f.ruleId.includes('DUAL')) categoryViolations['Pricing & MRP / Taxes']++;
        if (f.ruleId.includes('USP')) categoryViolations['Unit Sale Price (USP)']++;
        if (f.ruleId.includes('NET_QTY')) categoryViolations['Net Quantity & Units']++;
        if (f.ruleId.includes('CONSUMER')) categoryViolations['Consumer Care Details']++;
        if (f.ruleId.includes('DATE')) categoryViolations['Date & Shelf Life']++;
        if (f.ruleId.includes('ORIGIN')) categoryViolations['Country of Origin']++;
        if (f.ruleId.includes('FONT')) categoryViolations['Font & Readability']++;
      }
    });
  });

  // Filter recent inspections
  const filteredInspections = inspections.filter((item) => {
    const matchesSearch =
      item.product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.storeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.overallStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this inspection record?')) {
      StorageRepository.deleteInspection(id);
      showToast({
        type: 'info',
        title: 'Inspection Deleted',
        message: 'Record removed from persistent storage.',
      });
    }
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const copy = StorageRepository.duplicateInspection(id);
    if (copy) {
      showToast({
        type: 'success',
        title: 'Inspection Duplicated',
        message: `New draft created: ${copy.referenceNumber}`,
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Overview Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Legal Metrology Enforcement Dashboard</h1>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300 tracking-wider uppercase ml-1 hidden sm:inline-block">
              Zone: {(currentUser?.jurisdictionZone || currentUser?.zone || 'Delhi, North Zone').split(',')[0]}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Officer-in-Charge: <span className="font-semibold text-slate-800">{currentUser?.name || 'Officer'}</span> ({currentUser?.designation || 'Inspector'}) • Statutory Surveillance under Legal Metrology (Packaged Commodities) Rules, 2011.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onNavigateToNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-bold shadow-xs transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Package Inspection</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Inspections */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Packages Scanned</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{total}</span>
            <span className="text-slate-500 text-xs font-mono">audits</span>
          </div>
        </div>

        {/* Compliant Products */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs border-t-3 border-t-emerald-600">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fully Compliant</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-700">{compliantCount}</span>
            <span className="text-emerald-700 text-xs font-bold">{compliancePercentage}%</span>
          </div>
        </div>

        {/* Potential Violations */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs border-t-3 border-t-red-600">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Potential Violations</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-red-700">{nonCompliantCount}</span>
            <span className="text-red-600 text-xs font-semibold">Action Needed</span>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs border-t-3 border-t-amber-500">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Officer Review</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-amber-700">{needsReviewCount}</span>
            <span className="text-amber-700 text-xs font-semibold">Under Audit</span>
          </div>
        </div>

        {/* Average Compliance Score */}
        <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs border-t-3 border-t-[#1e3a8a]">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mean Compliance Index</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{avgScore}%</span>
            <span className="text-blue-700 text-xs font-semibold">LM-PCR Matrix</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Status Distribution Gauge */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Statutory Compliance Ratio
              </h3>
              <span className="text-xs text-slate-500 font-mono">{total} Packages</span>
            </div>

            {/* Custom SVG Donut */}
            <div className="flex items-center justify-center py-3">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="10"
                  />
                  {total > 0 && (
                    <>
                      {/* Compliant Segment */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#059669"
                        strokeWidth="10"
                        strokeDasharray={`${(compliantCount / total) * 251.2} 251.2`}
                        strokeDashoffset="0"
                      />
                      {/* Non-Compliant Segment */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#dc2626"
                        strokeWidth="10"
                        strokeDasharray={`${(nonCompliantCount / total) * 251.2} 251.2`}
                        strokeDashoffset={`${-(compliantCount / total) * 251.2}`}
                      />
                      {/* Needs Review Segment */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#d97706"
                        strokeWidth="10"
                        strokeDasharray={`${(needsReviewCount / total) * 251.2} 251.2`}
                        strokeDashoffset={`${-((compliantCount + nonCompliantCount) / total) * 251.2}`}
                      />
                    </>
                  )}
                </svg>
                <div className="absolute text-center">
                  <div className="text-2xl font-bold text-slate-900">{avgScore}%</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Avg Index</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
              <div className="text-sm font-bold text-emerald-700">{compliantCount}</div>
              <div className="text-[10px] text-slate-600 font-medium">Compliant</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-2">
              <div className="text-sm font-bold text-red-700">{nonCompliantCount}</div>
              <div className="text-[10px] text-slate-600 font-medium">Violations</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
              <div className="text-sm font-bold text-amber-700">{needsReviewCount}</div>
              <div className="text-[10px] text-slate-600 font-medium">Review</div>
            </div>
          </div>
        </div>

        {/* Violation Category Breakdown Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Common Statutory Discrepancies
              </h3>
              <span className="text-xs text-slate-500 font-mono">PCR 2011 Non-Compliances</span>
            </div>

            <div className="space-y-2.5 mt-2">
              {Object.entries(categoryViolations).map(([category, count]) => {
                const maxCount = Math.max(...Object.values(categoryViolations), 1);
                const percent = Math.round((count / maxCount) * 100);
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium">{category}</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {count} {count === 1 ? 'case' : 'cases'}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          count > 0 ? 'bg-red-600' : 'bg-slate-200'
                        }`}
                        style={{ width: `${count > 0 ? Math.max(percent, 10) : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Enforcement Focus: Unit Sale Price (Rule 6(1)(da)) &amp; Consumer Care (Rule 6(1)(e))</span>
          </div>
        </div>
      </div>

      {/* Quick Test Demo Samples Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Field Test Commodities &amp; Pre-Packaged Samples
            </h3>
          </div>
          <span className="text-xs text-slate-500">Select to simulate inspection</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              className="text-left p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 hover:bg-white transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                    {preset.name}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
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
                <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                  {preset.summary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-blue-700 font-semibold">
                <span>Load Sample Case</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Inspections Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Statutory Inspections</h2>
            <p className="text-xs text-slate-500">Live surveillance audit trail under Packaged Commodities Rules 2011</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search product, brand, store..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-300 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-slate-700 text-xs focus:outline-none pr-2 py-0.5 font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLIANT">Compliant</option>
                <option value="POTENTIAL_NON_COMPLIANCE">Violations</option>
                <option value="NEEDS_REVIEW">Needs Review</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold">
              <tr className="border-b border-slate-200 text-[11px]">
                <th className="py-3 px-4 font-bold">Memo Ref</th>
                <th className="py-3 px-4 font-bold">Product / Brand</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Retailer &amp; Location</th>
                <th className="py-3 px-4 font-bold">Compliance Status</th>
                <th className="py-3 px-4 font-bold">Date</th>
                <th className="py-3 px-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInspections.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No inspection records found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredInspections.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onViewInspection(item)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {item.referenceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{item.product.productName}</div>
                      <div className="text-[11px] text-slate-500">Brand: {item.product.brand}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-medium">
                        {item.product.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="truncate max-w-[180px] font-medium">{item.product.storeName}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                        {item.product.inspectionLocation}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            item.overallStatus === 'COMPLIANT'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.overallStatus === 'NEEDS_REVIEW'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {item.overallStatus === 'COMPLIANT' && <CheckCircle className="w-3 h-3" />}
                          {item.overallStatus === 'NEEDS_REVIEW' && <HelpCircle className="w-3 h-3" />}
                          {item.overallStatus === 'POTENTIAL_NON_COMPLIANCE' && <XCircle className="w-3 h-3" />}
                          {item.overallStatus === 'COMPLIANT'
                            ? 'Compliant'
                            : item.overallStatus === 'NEEDS_REVIEW'
                            ? 'Review'
                            : 'Violation'}
                        </span>
                        <span className="font-bold text-slate-900 text-xs font-mono">{item.complianceScore}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {item.product.inspectionDate}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewInspection(item);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                          title="View Inspection Memo"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onGenerateReport(item);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 transition-colors"
                          title="Print Statutory Memorandum"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDuplicate(item.id, e)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors"
                          title="Duplicate Inspection"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
