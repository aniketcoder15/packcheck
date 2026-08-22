import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  FileText,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building,
  Scale,
  ChevronDown,
} from 'lucide-react';
import { InspectionRecord, LanguageCode, ComplianceStatus } from '../types';
import { useTranslation } from '../lib/translations';

interface InspectionHistoryViewProps {
  inspections: InspectionRecord[];
  onViewRecord: (record: InspectionRecord) => void;
  language: LanguageCode;
}

export const InspectionHistoryView: React.FC<InspectionHistoryViewProps> = ({
  inspections,
  onViewRecord,
  language,
}) => {
  const t = useTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filter list
  const filtered = inspections.filter((item) => {
    const matchSearch =
      item.commodityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.memoNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.storeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchCategory = categoryFilter === 'ALL' || item.category === categoryFilter;

    return matchSearch && matchStatus && matchCategory;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t('inspection_history')}
            </h2>
            <p className="text-xs text-slate-500">
              Centralized Legal Metrology enforcement database & statutory memorandum records
            </p>
          </div>

          <span className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded-lg border border-blue-200 w-fit">
            {filtered.length} Record(s) Found
          </span>
        </div>

        {/* Search & Select Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Memo No., Commodity, Brand, or Store..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Compliance Statuses</option>
              <option value="COMPLIANT">Statutorily Compliant</option>
              <option value="REVIEW_REQUIRED">Needs Review / Advisory</option>
              <option value="NON_COMPLIANT">Non-Compliant / Violation</option>
            </select>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Food & Beverages">Food & Beverages</option>
              <option value="Cosmetics & Personal Care">Cosmetics & Personal Care</option>
              <option value="Pharmaceuticals & Health">Pharmaceuticals & Health</option>
              <option value="Household Products">Household Products</option>
              <option value="General Pre-Packaged">General Pre-Packaged</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Memo Reference</th>
                <th className="px-5 py-3.5">Inspected Commodity</th>
                <th className="px-5 py-3.5">Manufacturer / Brand</th>
                <th className="px-5 py-3.5">Compliance Status</th>
                <th className="px-5 py-3.5">Score</th>
                <th className="px-5 py-3.5">Officer & Location</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{record.memoNumber}</div>
                    <div className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-900">{record.commodityName}</div>
                    <div className="text-[11px] text-slate-500">{record.category}</div>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-900 truncate max-w-xs">{record.manufacturer}</div>
                    <div className="text-[10px] text-slate-500">{record.brand || 'N/A'}</div>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {record.status === 'COMPLIANT' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Compliant</span>
                      </span>
                    ) : record.status === 'REVIEW_REQUIRED' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Needs Review</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>Non-Compliant</span>
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap font-bold text-slate-900">
                    {record.score}%
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="text-slate-900 font-medium">{record.officerName}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-xs">
                      {record.storeName}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button
                      id={`btn-history-view-${record.id}`}
                      type="button"
                      onClick={() => onViewRecord(record)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold text-xs transition-colors inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Memo</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
