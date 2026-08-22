import React from 'react';
import {
  Printer,
  Download,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building,
  Scale,
  Award,
} from 'lucide-react';
import { InspectionRecord } from '../types';
import { useToast } from './Toast';

interface ReportViewProps {
  inspection: InspectionRecord;
  onBack: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ inspection, onBack }) => {
  const { showToast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(inspection, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Legal_Metrology_Memo_${inspection.referenceNumber.replace(/[\/\s]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast({
      type: 'info',
      title: 'Report Downloaded',
      message: 'JSON inspection file saved.',
    });
  };

  const findings = inspection.findings;
  const violations = findings.filter((f) => f.status === 'FAIL');
  const warnings = findings.filter((f) => f.status === 'WARNING' || f.status === 'NEEDS_MANUAL_REVIEW');
  const passed = findings.filter((f) => f.status === 'PASS');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Top Action Bar (hidden in print) */}
      <div className="flex items-center justify-between print:hidden bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Findings</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-bold shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Official Government Memorandum Document (Printable Sheet) */}
      <div className="bg-white text-slate-900 rounded-xl p-8 sm:p-12 shadow-2xl border border-slate-200 print:border-none print:shadow-none print:p-0">
        {/* National Header */}
        <div className="text-center border-b-2 border-slate-900 pb-6 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 border border-slate-300 mb-2">
            <Scale className="w-7 h-7 text-slate-800" />
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-700">
            Government of India • Ministry of Consumer Affairs, Food & Public Distribution
          </div>
          <div className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-slate-950 mt-0.5">
            Directorate of Legal Metrology
          </div>
          <div className="text-xs font-semibold text-slate-600">
            Enforcement & Surveillance Division under Legal Metrology Act, 2009 (No. 1 of 2010)
          </div>

          <div className="mt-4 pt-3 border-t border-slate-300 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="font-bold text-slate-700">MEMO REF NO:</span>{' '}
              <span className="font-extrabold text-blue-900">{inspection.referenceNumber}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700">DATE:</span>{' '}
              <span>{inspection.product.inspectionDate} {inspection.product.inspectionTime}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center bg-slate-100 border border-slate-300 py-2.5 rounded-lg mb-6">
          <h2 className="text-sm font-extrabold tracking-wide uppercase text-slate-900">
            Packaged Commodity Inspection Memorandum & Rule Compliance Audit
          </h2>
          <div className="text-[11px] text-slate-600 font-medium">
            (Issued under Rule 6 of the Legal Metrology (Packaged Commodities) Rules, 2011)
          </div>
        </div>

        {/* Section 1: Inspection & Premise Particulars */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            I. Establishment & Surveillance Premises
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-600">Establishment / Store:</span>
              <div className="font-semibold text-slate-900">{inspection.product.storeName}</div>
            </div>
            <div>
              <span className="font-bold text-slate-600">Location Address:</span>
              <div className="font-semibold text-slate-900">{inspection.product.inspectionLocation}</div>
            </div>
            <div>
              <span className="font-bold text-slate-600">Inspecting Officer:</span>
              <div className="font-semibold text-slate-900">
                {inspection.product.inspectorName} (Badge No: {inspection.product.inspectorId})
              </div>
            </div>
            <div>
              <span className="font-bold text-slate-600">Inspection Schedule:</span>
              <div className="font-semibold text-slate-900">
                {inspection.product.inspectionDate} at {inspection.product.inspectionTime}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Commodity Specifications */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            II. Packaged Commodity Particulars
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 font-medium block">Commodity Name</span>
              <span className="font-bold text-slate-900">{inspection.product.productName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Brand</span>
              <span className="font-bold text-slate-900">{inspection.product.brand}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Category</span>
              <span className="font-bold text-slate-900">{inspection.product.category}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Origin</span>
              <span className="font-bold text-slate-900">
                {inspection.product.isImported ? 'Imported' : 'Domestic Manufacture'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Batch / Lot No.</span>
              <span className="font-mono font-bold text-slate-900">{inspection.product.batchNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">EAN Barcode</span>
              <span className="font-mono font-bold text-slate-900">{inspection.product.barcode || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Overall Status</span>
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  inspection.overallStatus === 'COMPLIANT'
                    ? 'bg-emerald-100 text-emerald-800'
                    : inspection.overallStatus === 'NEEDS_REVIEW'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {inspection.overallStatus === 'COMPLIANT'
                  ? 'Compliant'
                  : inspection.overallStatus === 'NEEDS_REVIEW'
                  ? 'Needs Review'
                  : 'Potential Violation'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Compliance Index</span>
              <span className="font-extrabold text-slate-900">{inspection.complianceScore}%</span>
            </div>
          </div>
        </div>

        {/* Section 3: Extracted Statutory Declarations Table */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            III. Statutory Declarations Extracted from Label Artwork
          </h3>
          <table className="w-full text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold">
                <th className="border border-slate-300 p-2 text-left w-1/3">Statutory Parameter [PCR 2011]</th>
                <th className="border border-slate-300 p-2 text-left">Extracted Value / Declaration on Package</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="border border-slate-300 p-2 font-semibold text-slate-700">
                  Manufacturer / Packer / Importer [Rule 6(1)(a)]
                </td>
                <td className="border border-slate-300 p-2 font-medium">
                  {inspection.verifiedDeclarations.manufacturerName || 'Not Declared'}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold text-slate-700">
                  Complete Postal Address with PIN [Rule 6(1)(a) Expl. I]
                </td>
                <td className="border border-slate-300 p-2 font-medium">
                  {inspection.verifiedDeclarations.manufacturerAddress || 'Not Declared'}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold text-slate-700">
                  Country of Origin [Rule 6(1)(g)]
                </td>
                <td className="border border-slate-300 p-2 font-medium">
                  {inspection.verifiedDeclarations.countryOfOrigin || 'Not Declared (Mandatory for imported items)'}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold text-slate-700">
                  Net Quantity with Metric Unit [Rule 6(1)(c) & Rule 11]
                </td>
                <td className="border border-slate-300 p-2 font-mono font-bold">
                  {inspection.verifiedDeclarations.netQuantityValue}{' '}
                  {inspection.verifiedDeclarations.netQuantityUnit}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold text-slate-700">
                  Maximum Retail Price (MRP) [Rule 6(1)(e)]
                </td>
                <td className="border border-slate-300 p-2 font-mono font-bold">
                  ₹{inspection.verifiedDeclarations.mrpValue} (Inclusive of all taxes:{' '}
                  {inspection.verifiedDeclarations.mrpIncludesTaxes ? 'Yes' : 'NO'})
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold text-slate-700">
                  Unit Sale Price (USP) [Rule 6(1)(da) (2021 Amendment)]
                </td>
                <td className="border border-slate-300 p-2 font-mono font-bold">
                  {inspection.verifiedDeclarations.unitSalePriceValue
                    ? `₹${inspection.verifiedDeclarations.unitSalePriceValue} / ${inspection.verifiedDeclarations.unitSalePriceUnit}`
                    : 'Not Declared / Missing'}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold text-slate-700">
                  Month & Year of Mfg/Packing [Rule 6(1)(d)]
                </td>
                <td className="border border-slate-300 p-2 font-mono">
                  {inspection.verifiedDeclarations.packingMonthYear || 'Not Declared'}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold text-slate-700">
                  Consumer Care Contact Cell [Rule 6(1)(f)]
                </td>
                <td className="border border-slate-300 p-2">
                  <div className="font-semibold">{inspection.verifiedDeclarations.consumerCareName}</div>
                  <div className="text-slate-600">
                    Phone: {inspection.verifiedDeclarations.consumerCarePhone || 'None'} | Email:{' '}
                    {inspection.verifiedDeclarations.consumerCareEmail || 'None'}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4: Detailed Statutory Compliance Matrix */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            IV. Legal Metrology Compliance Matrix
          </h3>
          <table className="w-full text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold">
                <th className="border border-slate-300 p-2 text-left w-24">Rule Ref</th>
                <th className="border border-slate-300 p-2 text-left">Statutory Title</th>
                <th className="border border-slate-300 p-2 text-center w-28">Status</th>
                <th className="border border-slate-300 p-2 text-left">Legal Explanation / Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {findings.map((f) => (
                <tr key={f.id} className={f.status === 'FAIL' ? 'bg-rose-50' : ''}>
                  <td className="border border-slate-300 p-2 font-mono font-bold text-slate-800">
                    {f.ruleReference}
                  </td>
                  <td className="border border-slate-300 p-2 font-semibold text-slate-900">
                    {f.ruleTitle}
                  </td>
                  <td className="border border-slate-300 p-2 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                        f.status === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : f.status === 'FAIL'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="border border-slate-300 p-2 text-slate-700 leading-tight text-[11px]">
                    <p>{f.legalExplanation}</p>
                    {f.extractedEvidence && (
                      <p className="font-mono text-slate-500 mt-1">
                        Evidence: {f.extractedEvidence}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 5: Potential Violations & Proposed Enforcement Action */}
        {violations.length > 0 && (
          <div className="mb-6 bg-rose-50 border border-rose-200 p-4 rounded-lg">
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-900 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>V. Summary of Potential Non-Compliances & Recommended Statutory Action</span>
            </h3>
            <div className="space-y-2 text-xs text-rose-900">
              {violations.map((v) => (
                <div key={v.id} className="border-b border-rose-200/80 pb-1.5 last:border-none">
                  <span className="font-bold">{v.ruleReference} ({v.ruleTitle}):</span>{' '}
                  <span>{v.recommendedAction || 'Issue statutory notice under Section 36 of Legal Metrology Act, 2009.'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 6: Officer Remarks & Signatures */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            VI. Inspecting Officer Observations & Attestation
          </h3>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 min-h-[60px]">
            {inspection.inspectorRemarks || 'Visual and OCR label compliance examination completed under provisions of Legal Metrology (Packaged Commodities) Rules, 2011.'}
          </div>

          <div className="grid grid-cols-2 gap-8 mt-12 text-xs">
            <div className="border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-900">{inspection.product.inspectorName}</div>
              <div className="text-slate-600">Legal Metrology Inspector</div>
              <div className="text-slate-500 font-mono text-[10px]">ID: {inspection.product.inspectorId}</div>
            </div>

            <div className="border-t border-slate-400 pt-2 text-right">
              <div className="font-bold text-slate-900">Controller / Assistant Controller</div>
              <div className="text-slate-600">Legal Metrology Directorate</div>
              <div className="text-slate-500 text-[10px]">Zonal Enforcement Office</div>
            </div>
          </div>
        </div>

        {/* Mandatory Statutory Disclaimer */}
        <div className="mt-8 pt-4 border-t-2 border-slate-900 text-center text-[10px] text-slate-500 uppercase tracking-tight">
          <p className="font-bold text-slate-700">
            Statutory Disclaimer: This system assists inspection by identifying potential non-compliances. Final legal determination remains with the competent authority.
          </p>
          <p className="mt-0.5">
            PackCheck Legal Metrology Portal • Generated electronically on {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};
