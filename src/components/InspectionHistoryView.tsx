import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  FileText,
  Copy,
  Trash2,
  Download,
  PlusCircle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Calendar,
  Layers,
  Table as TableIcon,
  Grid as GridIcon,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { InspectionRecord, CommodityCategory } from '../types';
import { StorageRepository } from '../utils/storage';
import { useToast } from './Toast';

interface InspectionHistoryViewProps {
  inspections: InspectionRecord[];
  onViewInspection: (inspection: InspectionRecord) => void;
  onGenerateReport: (inspection: InspectionRecord) => void;
  onNewInspection: () => void;
}

export const InspectionHistoryView: React.FC<InspectionHistoryViewProps> = ({
  inspections,
  onViewInspection,
  onGenerateReport,
  onNewInspection,
}) => {
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'newest' | 'score' | 'brand'>('newest');

  // Delete handler
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this inspection record?')) {
      StorageRepository.deleteInspection(id);
      showToast({
        type: 'info',
        title: 'Inspection Deleted',
        message: 'Record removed from persistent storage.',
      });
    }
  };

  // Duplicate handler
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

  // Export all filtered
  const handleExportCSV = () => {
    const rows = [
      ['Ref No', 'Product Name', 'Brand', 'Category', 'Store', 'Location', 'Status', 'Score', 'Inspector', 'Date'],
      ...filtered.map((i) => [
        `"${i.referenceNumber}"`,
        `"${i.product.productName}"`,
        `"${i.product.brand}"`,
        `"${i.product.category}"`,
        `"${i.product.storeName}"`,
        `"${i.product.inspectionLocation}"`,
        `"${i.overallStatus}"`,
        `"${i.complianceScore}%"`,
        `"${i.product.inspectorName}"`,
        `"${i.product.inspectionDate}"`,
      ]),
    ];

    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PackCheck_Inspection_History_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast({
      type: 'info',
      title: 'CSV Export Generated',
      message: `Exported ${filtered.length} inspection records.`,
    });
  };

  // Filter and sort
  const filtered = inspections
    .filter((item) => {
      const matchQuery =
        item.product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.inspectorName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || item.overallStatus === statusFilter;
      const matchCategory = categoryFilter === 'ALL' || item.product.category === categoryFilter;

      return matchQuery && matchStatus && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'score') return b.complianceScore - a.complianceScore;
      if (sortBy === 'brand') return a.product.brand.localeCompare(b.product.brand);
      return 0;
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Inspection Repository &amp; Audit Database</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Inspection History ({filtered.length})
          </h1>
          <p className="text-xs text-slate-500">
            Searchable log of all packaged commodity audits, compliance ratings, and statutory enforcement notices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onNewInspection}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-bold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Inspection</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product, brand, store, inspector, ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Compliance Statuses</option>
              <option value="COMPLIANT">Compliant</option>
              <option value="POTENTIAL_NON_COMPLIANCE">Potential Violations</option>
              <option value="NEEDS_REVIEW">Needs Inspector Review</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Food & Beverages">Food &amp; Beverages</option>
              <option value="Edible Oils & Fats">Edible Oils &amp; Fats</option>
              <option value="Detergents & Cleaning">Detergents &amp; Cleaning</option>
              <option value="Cosmetics & Toiletries">Cosmetics</option>
              <option value="General Consumer Goods">General Consumer</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="score">Sort: Highest Score</option>
              <option value="brand">Sort: Brand A-Z</option>
            </select>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Showing <span className="text-slate-900 font-bold">{filtered.length}</span> of{' '}
            <span className="text-slate-900 font-bold">{inspections.length}</span> records
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              title="Grid Card View"
            >
              <GridIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3.5 px-4">Memo Reference</th>
                  <th className="py-3.5 px-4">Commodity / Brand</th>
                  <th className="py-3.5 px-4">Store &amp; Location</th>
                  <th className="py-3.5 px-4">Compliance Status</th>
                  <th className="py-3.5 px-4">Inspector</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      No inspection records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => onViewInspection(item)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {item.referenceNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {item.product.productName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>Brand: {item.product.brand}</span>
                          <span>•</span>
                          <span className="text-slate-500">{item.product.category}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="truncate max-w-[190px]">{item.product.storeName}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[190px]">
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
                              ? 'Needs Review'
                              : 'Potential Violation'}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">{item.complianceScore}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <div>{item.product.inspectorName}</div>
                        <div className="text-[10px] font-mono text-slate-500">{item.product.inspectorId}</div>
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
                            title="View Audit"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onGenerateReport(item);
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 transition-colors"
                            title="Generate Official Report"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDuplicate(item.id, e)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 transition-colors"
                            title="Delete"
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
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onViewInspection(item)}
              className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-blue-700">
                    {item.referenceNumber}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      item.overallStatus === 'COMPLIANT'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.overallStatus === 'NEEDS_REVIEW'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {item.overallStatus === 'COMPLIANT'
                      ? 'Compliant'
                      : item.overallStatus === 'NEEDS_REVIEW'
                      ? 'Needs Review'
                      : 'Violation'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {item.product.productName}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Brand: <span className="text-slate-800 font-semibold">{item.product.brand}</span>
                </div>

                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="truncate">Store: {item.product.storeName}</div>
                  <div className="truncate">Date: {item.product.inspectionDate}</div>
                  <div className="flex items-center justify-between text-slate-900 font-bold pt-1 border-t border-slate-200">
                    <span>Compliance Score</span>
                    <span className="text-emerald-600">{item.complianceScore}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">By {item.product.inspectorName}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateReport(item);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200"
                    title="Print Report"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
