import React, { useState } from 'react';
import {
  Boxes,
  Search,
  CheckCircle,
  XCircle,
  HelpCircle,
  Eye,
  FileText,
  TrendingUp,
  ShieldCheck,
  Building2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ProductHistorySummary, InspectionRecord } from '../types';
import { StorageRepository } from '../utils/storage';

interface ProductHistoryViewProps {
  onViewInspection: (inspection: InspectionRecord) => void;
  onGenerateReport: (inspection: InspectionRecord) => void;
}

export const ProductHistoryView: React.FC<ProductHistoryViewProps> = ({
  onViewInspection,
  onGenerateReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const productSummaries = StorageRepository.getProductHistories();

  const filtered = productSummaries.filter(
    (p) =>
      p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Boxes className="w-4 h-4" />
            <span>Brand &amp; SKU Compliance Tracker</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Product History &amp; Compliance Trajectory
          </h1>
          <p className="text-xs text-slate-500">
            Aggregate compliance history across brands, manufacturers, and repeated market batches.
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search brand or commodity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-xs">
            No products found matching your search.
          </div>
        ) : (
          filtered.map((item) => {
            const key = `${item.brand}-${item.productName}`;
            const isExpanded = expandedKey === key;
            return (
              <div
                key={key}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-all"
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedKey(isExpanded ? null : key)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-sm shrink-0">
                      {item.brand.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-900">{item.productName}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Brand: <span className="font-semibold text-slate-800">{item.brand}</span> • EAN: {item.barcode || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Average Compliance</div>
                      <div className="text-xl font-bold text-emerald-600">{item.averageScore}%</div>
                      <div className="text-[10px] text-slate-500">{item.totalInspections} audits recorded</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                          item.latestStatus === 'COMPLIANT'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.latestStatus === 'NEEDS_REVIEW'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        Latest: {item.latestStatus === 'COMPLIANT' ? 'Compliant' : item.latestStatus === 'NEEDS_REVIEW' ? 'Review' : 'Violation'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Inspection Timeline */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 pt-3">
                      Historical Batch Audits ({item.inspections.length}):
                    </div>
                    <div className="space-y-2">
                      {item.inspections.map((insp) => (
                        <div
                          key={insp.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 text-xs hover:border-slate-300 transition-colors shadow-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-blue-700">{insp.referenceNumber}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-700">Batch: {insp.product.batchNumber}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500">{insp.product.storeName} ({insp.product.inspectionDate})</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                insp.overallStatus === 'COMPLIANT'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}
                            >
                              {insp.complianceScore}%
                            </span>
                            <button
                              onClick={() => onViewInspection(insp)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                              title="View Memo"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onGenerateReport(insp)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 transition-colors"
                              title="Print Report"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
