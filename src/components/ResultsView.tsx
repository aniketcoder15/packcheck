import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  FileText,
  Edit3,
  CheckCircle,
  XCircle,
  HelpCircle,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Scale,
  Eye,
  Check,
  X,
  MessageSquare,
  AlertCircle,
  Save,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import {
  InspectionRecord,
  ComplianceFinding,
  User,
  FindingStatus,
} from '../types';
import { StorageRepository } from '../utils/storage';
import { useToast } from './Toast';

interface ResultsViewProps {
  inspection: InspectionRecord;
  currentUser: User;
  onEditDeclarations: () => void;
  onGenerateReport: () => void;
  onBackToDashboard: () => void;
  onUpdateInspection: (updated: InspectionRecord) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  inspection,
  currentUser,
  onEditDeclarations,
  onGenerateReport,
  onBackToDashboard,
  onUpdateInspection,
}) => {
  const { showToast } = useToast();

  const [findings, setFindings] = useState<ComplianceFinding[]>(inspection.findings);
  const [inspectorNotes, setInspectorNotes] = useState(inspection.inspectorRemarks || '');
  const [activeEvidenceFinding, setActiveEvidenceFinding] = useState<ComplianceFinding | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Stats
  const totalChecks = findings.length;
  const passedCount = findings.filter((f) => f.status === 'PASS').length;
  const failCount = findings.filter((f) => f.status === 'FAIL').length;
  const warningCount = findings.filter((f) => f.status === 'WARNING').length;
  const reviewCount = findings.filter((f) => f.status === 'NEEDS_MANUAL_REVIEW').length;

  const handleManualReview = (findingId: string, newStatus: FindingStatus, notes: string) => {
    const updated = findings.map((f) => {
      if (f.id === findingId) {
        return {
          ...f,
          status: newStatus,
          manualReviewNotes: notes,
          manualReviewBy: currentUser.name,
          manualReviewTimestamp: new Date().toISOString(),
        };
      }
      return f;
    });

    setFindings(updated);

    // Recalculate score & overall status
    const criticalFail = updated.some((f) => f.status === 'FAIL' && f.severity === 'CRITICAL');
    const anyFail = updated.some((f) => f.status === 'FAIL');
    const anyReview = updated.some((f) => f.status === 'NEEDS_MANUAL_REVIEW');

    let overall = inspection.overallStatus;
    if (criticalFail || anyFail) overall = 'POTENTIAL_NON_COMPLIANCE';
    else if (anyReview) overall = 'NEEDS_REVIEW';
    else overall = 'COMPLIANT';

    const passed = updated.filter((f) => f.status === 'PASS').length;
    const score = Math.round((passed / Math.max(updated.length, 1)) * 100);

    const updatedInspection: InspectionRecord = {
      ...inspection,
      findings: updated,
      overallStatus: overall,
      complianceScore: score,
      inspectorRemarks: inspectorNotes,
      updatedAt: new Date().toISOString(),
    };

    StorageRepository.saveInspection(updatedInspection);
    onUpdateInspection(updatedInspection);

    showToast({
      type: 'success',
      title: 'Finding Verified',
      message: `Updated finding status to ${newStatus}.`,
    });
  };

  const handleSaveNotes = () => {
    const updatedInspection: InspectionRecord = {
      ...inspection,
      inspectorRemarks: inspectorNotes,
      updatedAt: new Date().toISOString(),
    };
    StorageRepository.saveInspection(updatedInspection);
    onUpdateInspection(updatedInspection);

    showToast({
      type: 'success',
      title: 'Notes Saved',
      message: 'Official inspector observations updated.',
    });
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(inspection, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PackCheck_${inspection.referenceNumber.replace(/[\/\s]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast({
      type: 'info',
      title: 'JSON Audit Log Downloaded',
      message: 'Complete inspection file exported.',
    });
  };

  const handleDownloadCSV = () => {
    const rows = [
      ['Rule ID', 'Rule Reference', 'Act Section', 'Rule Title', 'Status', 'Severity', 'Legal Reasoning', 'Extracted Evidence'],
      ...findings.map((f) => [
        `"${f.ruleId}"`,
        `"${f.ruleReference}"`,
        `"${f.actSection || ''}"`,
        `"${f.ruleTitle}"`,
        `"${f.status}"`,
        `"${f.severity}"`,
        `"${f.legalExplanation.replace(/"/g, '""')}"`,
        `"${(f.extractedEvidence || '').replace(/"/g, '""')}"`,
      ]),
    ];

    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PackCheck_Findings_${inspection.referenceNumber.replace(/[\/\s]/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredFindings = findings.filter((f) => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'FAIL') return f.status === 'FAIL';
    if (filterCategory === 'PASS') return f.status === 'PASS';
    if (filterCategory === 'REVIEW') return f.status === 'NEEDS_MANUAL_REVIEW' || f.status === 'WARNING';
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <span>Inspection Evaluation Summary</span>
              <span>•</span>
              <span className="font-mono text-slate-600">{inspection.referenceNumber}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {inspection.product.productName}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onEditDeclarations}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Declarations</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs flex items-center gap-1.5 transition-colors"
            title="Download JSON record"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs flex items-center gap-1.5 transition-colors"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={onGenerateReport}
            className="px-4 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Official Report</span>
          </button>
        </div>
      </div>

      {/* Compliance Status Hero Banner */}
      <div
        className={`rounded-xl p-6 border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white ${
          inspection.overallStatus === 'COMPLIANT'
            ? 'border-emerald-200 border-l-4 border-l-emerald-600'
            : inspection.overallStatus === 'NEEDS_REVIEW'
            ? 'border-amber-200 border-l-4 border-l-amber-500'
            : 'border-red-200 border-l-4 border-l-red-600'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
              inspection.overallStatus === 'COMPLIANT'
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : inspection.overallStatus === 'NEEDS_REVIEW'
                ? 'bg-amber-100 text-amber-700 border-amber-200'
                : 'bg-red-100 text-red-700 border-red-200'
            }`}
          >
            {inspection.overallStatus === 'COMPLIANT' && <ShieldCheck className="w-7 h-7" />}
            {inspection.overallStatus === 'NEEDS_REVIEW' && <HelpCircle className="w-7 h-7" />}
            {inspection.overallStatus === 'POTENTIAL_NON_COMPLIANCE' && <AlertTriangle className="w-7 h-7" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                  inspection.overallStatus === 'COMPLIANT'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : inspection.overallStatus === 'NEEDS_REVIEW'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {inspection.overallStatus === 'COMPLIANT'
                  ? 'Compliant with PCR 2011'
                  : inspection.overallStatus === 'NEEDS_REVIEW'
                  ? 'Needs Inspector Verification'
                  : 'Potential Non-Compliance Detected'}
              </span>
              <span className="text-xs text-slate-500">• {inspection.product.category}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {inspection.overallStatus === 'COMPLIANT'
                ? 'All Statutory Declarations Verified'
                : inspection.overallStatus === 'NEEDS_REVIEW'
                ? 'Field Verification Required for Borderline Parameters'
                : `${failCount} Potential Statutory Violations Identified`}
            </h2>

            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {inspection.overallStatus === 'COMPLIANT'
                ? 'Package satisfies mandatory labelling standards under India’s Legal Metrology (Packaged Commodities) Rules, 2011.'
                : 'Potential non-compliances identified under Legal Metrology Act 2009 & PCR 2011. Inspect evidence below prior to statutory notice.'}
            </p>
          </div>
        </div>

        {/* Score Ring */}
        <div className="flex items-center gap-4 shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-right">
            <div className="text-[11px] text-slate-500 uppercase font-bold">Compliance Index</div>
            <div className="text-3xl font-extrabold text-slate-900">{inspection.complianceScore}%</div>
            <div className="text-[10px] text-slate-500">
              {passedCount} of {totalChecks} rules passed
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-center shadow-xs">
          <div className="text-[11px] text-slate-500 font-semibold uppercase">Total Rules Checked</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{totalChecks}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-center shadow-xs">
          <div className="text-[11px] text-emerald-700 font-semibold uppercase">Passed Compliant</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{passedCount}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-center shadow-xs">
          <div className="text-[11px] text-red-700 font-semibold uppercase">Potential Violations</div>
          <div className="text-xl font-bold text-red-600 mt-1">{failCount}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-center shadow-xs">
          <div className="text-[11px] text-amber-700 font-semibold uppercase">Review / Warnings</div>
          <div className="text-xl font-bold text-amber-600 mt-1">{warningCount + reviewCount}</div>
        </div>
      </div>

      {/* Findings Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Statutory Rule Verification Matrix</h3>
            <p className="text-xs text-slate-500">
              Rule-by-rule evaluation against Legal Metrology (Packaged Commodities) Rules, 2011
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setFilterCategory('ALL')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                filterCategory === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({totalChecks})
            </button>
            <button
              onClick={() => setFilterCategory('FAIL')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                filterCategory === 'FAIL' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Violations ({failCount})
            </button>
            <button
              onClick={() => setFilterCategory('REVIEW')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                filterCategory === 'REVIEW' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Warnings ({warningCount + reviewCount})
            </button>
            <button
              onClick={() => setFilterCategory('PASS')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                filterCategory === 'PASS' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Passed ({passedCount})
            </button>
          </div>
        </div>

        {/* Findings List */}
        <div className="space-y-3">
          {filteredFindings.map((finding) => (
            <FindingCard
              key={finding.id}
              finding={finding}
              onManualReview={handleManualReview}
              onViewEvidence={() => setActiveEvidenceFinding(finding)}
            />
          ))}
        </div>
      </div>

      {/* Inspector Observations & Final Remarks */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <MessageSquare className="w-4 h-4 text-blue-700" />
            <span>Inspection Officer Remarks &amp; Statutory Enforcement Action</span>
          </div>
          <button
            onClick={handleSaveNotes}
            className="px-3 py-1.5 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Remarks</span>
          </button>
        </div>

        <textarea
          rows={3}
          value={inspectorNotes}
          onChange={(e) => setInspectorNotes(e.target.value)}
          placeholder="Record official inspector observations, seizure details, or recommendations for statutory notice under Section 36 of Legal Metrology Act, 2009..."
          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            <span className="font-semibold text-slate-700">Inspecting Officer:</span>{' '}
            {inspection.product.inspectorName} ({inspection.product.inspectorId})
          </div>
          <div>
            <span className="font-semibold text-slate-700">Location:</span> {inspection.product.storeName},{' '}
            {inspection.product.inspectionLocation}
          </div>
        </div>
      </div>

      {/* Evidence Modal */}
      {activeEvidenceFinding && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 max-w-2xl w-full rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-700">
                  {activeEvidenceFinding.ruleReference}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {activeEvidenceFinding.ruleTitle}
                </h3>
              </div>
              <button
                onClick={() => setActiveEvidenceFinding(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Package Visual Preview */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-200 text-center">
              {inspection.product.images[0] ? (
                <img
                  src={inspection.product.images[0].url}
                  alt="Evidence"
                  className="max-h-72 mx-auto object-contain rounded-lg border border-slate-700"
                />
              ) : (
                <div className="text-xs text-slate-400">No image available</div>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-700 font-semibold">Extracted Label Evidence:</div>
              <div className="p-3 bg-slate-50 rounded-lg font-mono text-slate-800 border border-slate-200">
                {activeEvidenceFinding.extractedEvidence || 'No text extracted for this field.'}
              </div>
              <div className="text-slate-600 leading-relaxed pt-1">
                <span className="text-slate-800 font-semibold">Statutory Basis:</span>{' '}
                {activeEvidenceFinding.legalExplanation}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveEvidenceFinding(null)}
                className="px-4 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-semibold"
              >
                Close Evidence Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Statutory Disclaimer Footer */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 text-center">
        <p className="font-semibold text-slate-800">Statutory Notice</p>
        <p className="mt-0.5 text-[11px] leading-relaxed">
          This system assists inspection by identifying potential non-compliances. Final legal determination remains with the competent authority.
        </p>
      </div>
    </div>
  );
};

interface FindingCardProps {
  finding: ComplianceFinding;
  onManualReview: (findingId: string, status: FindingStatus, notes: string) => void;
  onViewEvidence: () => void;
}

const FindingCard: React.FC<FindingCardProps> = ({ finding, onManualReview, onViewEvidence }) => {
  const [expanded, setExpanded] = useState(finding.status === 'FAIL' || finding.status === 'NEEDS_MANUAL_REVIEW');
  const [showOverride, setShowOverride] = useState(false);
  const [overrideNotes, setOverrideNotes] = useState('');

  const getStatusBadge = () => {
    switch (finding.status) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> PASS
          </span>
        );
      case 'FAIL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" /> NON-COMPLIANCE
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> WARNING
          </span>
        );
      case 'NEEDS_MANUAL_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <HelpCircle className="w-3 h-3" /> NEEDS REVIEW
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">
            N/A
          </span>
        );
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all bg-white shadow-xs ${
        finding.status === 'FAIL'
          ? 'border-red-200 border-l-4 border-l-red-500'
          : finding.status === 'WARNING' || finding.status === 'NEEDS_MANUAL_REVIEW'
          ? 'border-amber-200 border-l-4 border-l-orange-400'
          : 'border-slate-200'
      }`}
    >
      {/* Header Row */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50 rounded-t-xl"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0">{getStatusBadge()}</div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-blue-700">
                {finding.ruleReference}
              </span>
              {finding.actSection && (
                <span className="text-[10px] text-slate-500 hidden sm:inline">
                  [{finding.actSection}]
                </span>
              )}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {finding.ruleTitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase hidden sm:inline ${
              finding.severity === 'CRITICAL'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : finding.severity === 'MODERATE'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {finding.severity}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="p-4 pt-0 border-t border-slate-100 space-y-3 text-xs">
          {/* Legal Explanation */}
          <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Legal Rationale &amp; PCR 2011 Provision:
            </div>
            <p className="leading-relaxed">{finding.legalExplanation}</p>
          </div>

          {/* Evidence vs Expected */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">
                Extracted Label Text
              </div>
              <div className="font-mono text-slate-800 break-words">
                {finding.extractedEvidence || '<Declaration Missing or Not Visible>'}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">
                Statutory Requirement
              </div>
              <div className="text-slate-700">
                {finding.expectedCondition || 'Mandatory statutory declaration under Rule 6(1)'}
              </div>
            </div>
          </div>

          {/* Recommended Enforcement Action */}
          {finding.recommendedAction && (
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-2 text-blue-800 text-[11px]">
              <Scale className="w-4 h-4 shrink-0 mt-0.5 text-blue-700" />
              <div>
                <span className="font-bold">Recommended Enforcement Action:</span>{' '}
                {finding.recommendedAction}
              </div>
            </div>
          )}

          {/* Manual Review Note if Present */}
          {finding.manualReviewNotes && (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
              <span className="font-bold text-amber-700">Inspector Verification Note:</span>{' '}
              {finding.manualReviewNotes} (by {finding.manualReviewBy} at{' '}
              {new Date(finding.manualReviewTimestamp || '').toLocaleTimeString()})
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={onViewEvidence}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold border border-slate-300 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Label Artwork &amp; Bounding Box</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOverride(!showOverride)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-700 text-[11px] font-semibold transition-colors"
              >
                {showOverride ? 'Hide Verification Tool' : 'Inspector Status Verification'}
              </button>
            </div>
          </div>

          {/* Inspector Override Panel */}
          {showOverride && (
            <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="text-[11px] font-bold text-slate-700">
                Manual Inspector Determination Override:
              </div>
              <input
                type="text"
                value={overrideNotes}
                onChange={(e) => setOverrideNotes(e.target.value)}
                placeholder="Reason for verification (e.g. Physical package re-measured with vernier caliper)"
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onManualReview(finding.id, 'PASS', overrideNotes || 'Physically verified compliant');
                    setShowOverride(false);
                  }}
                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs"
                >
                  <Check className="w-3 h-3" /> Mark PASS
                </button>
                <button
                  onClick={() => {
                    onManualReview(finding.id, 'FAIL', overrideNotes || 'Confirmed statutory non-compliance');
                    setShowOverride(false);
                  }}
                  className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs"
                >
                  <X className="w-3 h-3" /> Mark FAIL
                </button>
                <button
                  onClick={() => {
                    onManualReview(finding.id, 'NEEDS_MANUAL_REVIEW', overrideNotes || 'Referred to standard testing lab');
                    setShowOverride(false);
                  }}
                  className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs"
                >
                  <HelpCircle className="w-3 h-3" /> Mark Lab Review
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
