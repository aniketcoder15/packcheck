import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Eye,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Info,
  Maximize2,
  Edit3,
} from 'lucide-react';
import {
  ExtractedDeclarations,
  PackageImage,
  ProductDetails,
  BoundingBox,
} from '../types';
import { useToast } from './Toast';

interface ExtractionReviewViewProps {
  product: ProductDetails;
  extractedDeclarations: ExtractedDeclarations;
  onProceedToAudit: (updatedDeclarations: ExtractedDeclarations) => void;
  onBackToEdit: () => void;
}

export const ExtractionReviewView: React.FC<ExtractionReviewViewProps> = ({
  product,
  extractedDeclarations,
  onProceedToAudit,
  onBackToEdit,
}) => {
  const { showToast } = useToast();

  // Form State initialized from extracted declarations
  const [form, setForm] = useState<ExtractedDeclarations>({
    ...extractedDeclarations,
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [hoveredBoxId, setHoveredBoxId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'declarations' | 'pricing' | 'contacts' | 'visuals'>('declarations');
  const [showBoxes, setShowBoxes] = useState(true);

  const currentImage = product.images[selectedImageIndex] || product.images[0];

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.75));
  const handleResetZoom = () => setZoom(1);

  const handleFieldChange = (field: keyof ExtractedDeclarations, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveCorrections = () => {
    showToast({
      type: 'success',
      title: 'Corrections Saved',
      message: 'Verified declarations updated for compliance checking.',
    });
  };

  const handleRunAudit = () => {
    onProceedToAudit(form);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Edit3 className="w-4 h-4" />
            <span>Step 2: OCR &amp; Declaration Extraction Review</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {product.productName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Brand: <span className="text-slate-900 font-semibold">{product.brand}</span> • Batch: <span className="font-mono text-slate-700">{product.batchNumber}</span> • Engine:{' '}
            <span className="text-emerald-700 font-semibold">{extractedDeclarations.engineUsed}</span> ({extractedDeclarations.overallOcrConfidence}% Confidence)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToEdit}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs transition-colors"
          >
            Edit Info &amp; Uploads
          </button>
          <button
            onClick={handleSaveCorrections}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-blue-700 hover:text-blue-800 text-xs font-semibold border border-slate-300 shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Corrections</span>
          </button>
          <button
            onClick={handleRunAudit}
            className="px-4 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <span>Run Rule Compliance Check</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Split Viewer: Image Bounding Box Visualizer on Left, Structured Editor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Columns: Interactive Image & Bounding Box Viewer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col h-[650px]">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Package Label View
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                  Zoom: {Math.round(zoom * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowBoxes(!showBoxes)}
                  className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                    showBoxes
                      ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                  title="Toggle detected declaration overlay bounding boxes"
                >
                  Overlay Boxes: {showBoxes ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Canvas / Image Container */}
            <div className="flex-1 bg-slate-900 rounded-xl border border-slate-200 overflow-auto relative flex items-center justify-center p-2">
              <div
                className="relative transition-transform duration-200 origin-center max-w-full max-h-full"
                style={{ transform: `scale(${zoom})` }}
              >
                {currentImage ? (
                  <div className="relative inline-block">
                    <img
                      src={currentImage.url}
                      alt="Package under inspection"
                      className="max-h-[540px] w-auto object-contain rounded-lg shadow-2xl block"
                    />

                    {/* Bounding Box Highlights */}
                    {showBoxes &&
                      form.boundingBoxes.map((box) => {
                        const isHovered = hoveredBoxId === box.id;
                        return (
                          <div
                            key={box.id}
                            onMouseEnter={() => setHoveredBoxId(box.id)}
                            onMouseLeave={() => setHoveredBoxId(null)}
                            className={`absolute border-2 transition-all cursor-pointer rounded-sm ${
                              isHovered
                                ? 'border-orange-400 bg-orange-400/20 z-20 shadow-lg'
                                : 'border-blue-400/80 bg-blue-500/10 hover:border-orange-400 hover:bg-orange-400/20'
                            }`}
                            style={{
                              top: `${box.ymin}%`,
                              left: `${box.xmin}%`,
                              height: `${box.ymax - box.ymin}%`,
                              width: `${box.xmax - box.xmin}%`,
                            }}
                          >
                            <span
                              className={`absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap shadow ${
                                isHovered
                                  ? 'bg-orange-500 text-white font-black'
                                  : 'bg-blue-600 text-white'
                              }`}
                            >
                              {box.label} ({box.confidence}%)
                            </span>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">No image available</div>
                )}
              </div>
            </div>

            {/* Image Selector Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx ? 'border-blue-600 scale-105 shadow-sm' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="thumbnail" className="w-12 h-12 object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-slate-900/90 text-[8px] text-center text-white py-0.5 capitalize">
                      {img.panelType}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 6 Columns: Structured Field Editor */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 bg-slate-50 p-1.5 rounded-lg">
              <button
                onClick={() => setActiveTab('declarations')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === 'declarations'
                    ? 'bg-[#1e3a8a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                Mandatory Details
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === 'pricing'
                    ? 'bg-[#1e3a8a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                Pricing &amp; MRP
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === 'contacts'
                    ? 'bg-[#1e3a8a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                Consumer Care
              </button>
              <button
                onClick={() => setActiveTab('visuals')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === 'visuals'
                    ? 'bg-[#1e3a8a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                Font &amp; Legibility
              </button>
            </div>

            {/* TAB 1: Mandatory Details */}
            {activeTab === 'declarations' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Manufacturer / Packer Name [Rule 6(1)(a)]
                    </label>
                    <span className="text-[10px] text-emerald-700 font-semibold font-mono">Confidence: 96%</span>
                  </div>
                  <input
                    type="text"
                    value={form.manufacturerName}
                    onChange={(e) => handleFieldChange('manufacturerName', e.target.value)}
                    placeholder="Full registered entity name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Complete Postal Address &amp; PIN Code [Rule 6(1)(a) Expl. I]
                  </label>
                  <textarea
                    rows={2}
                    value={form.manufacturerAddress}
                    onChange={(e) => handleFieldChange('manufacturerAddress', e.target.value)}
                    placeholder="Plot/Street, City, State, and 6-digit PIN"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Generic Commodity Name [Rule 6(1)(b)]
                    </label>
                    <input
                      type="text"
                      value={form.genericProductName}
                      onChange={(e) => handleFieldChange('genericProductName', e.target.value)}
                      placeholder="e.g. Whole Wheat Atta"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Country of Origin [Rule 6(1)(g)]
                    </label>
                    <input
                      type="text"
                      value={form.countryOfOrigin}
                      onChange={(e) => handleFieldChange('countryOfOrigin', e.target.value)}
                      placeholder="e.g. India / Switzerland"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Net Quantity Value [Rule 6(1)(c)]
                    </label>
                    <input
                      type="text"
                      value={form.netQuantityValue}
                      onChange={(e) => handleFieldChange('netQuantityValue', e.target.value)}
                      placeholder="e.g. 5 or 500"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Standard Unit
                    </label>
                    <select
                      value={form.netQuantityUnit}
                      onChange={(e) => handleFieldChange('netQuantityUnit', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="kg">kg (Kilograms)</option>
                      <option value="g">g (Grams)</option>
                      <option value="l">l (Litres)</option>
                      <option value="ml">ml (Millilitres)</option>
                      <option value="m">m (Metres)</option>
                      <option value="number">no. (Number/Pieces)</option>
                      <option value="gms">gms (Non-standard - Warning)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Month &amp; Year of Mfg/Packing [Rule 6(1)(d)]
                    </label>
                    <input
                      type="text"
                      value={form.packingMonthYear}
                      onChange={(e) => handleFieldChange('packingMonthYear', e.target.value)}
                      placeholder="e.g. 02/2026"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Best Before / Expiry
                    </label>
                    <input
                      type="text"
                      value={form.bestBeforeDate || ''}
                      onChange={(e) => handleFieldChange('bestBeforeDate', e.target.value)}
                      placeholder="e.g. 6 Months from Packaging"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Pricing & MRP */}
            {activeTab === 'pricing' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Maximum Retail Price (₹) [Rule 6(1)(e)]
                  </label>
                  <input
                    type="text"
                    value={form.mrpValue}
                    onChange={(e) => handleFieldChange('mrpValue', e.target.value)}
                    placeholder="e.g. 340.00"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.mrpIncludesTaxes}
                      onChange={(e) => handleFieldChange('mrpIncludesTaxes', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-0 w-4 h-4"
                    />
                    <span>Bearing statutory wording: "(Inclusive of all taxes)"</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-red-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.hasDualMrpSuspicion}
                      onChange={(e) => handleFieldChange('hasDualMrpSuspicion', e.target.checked)}
                      className="rounded text-red-600 focus:ring-0 w-4 h-4"
                    />
                    <span className="font-medium">Dual MRP / Sticker Alteration Suspicion Detected [Rule 18(2)]</span>
                  </label>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Unit Sale Price (USP) [Rule 6(1)(da) Amendment]
                    </label>
                    <span className="text-[10px] text-orange-600 font-semibold">Mandatory for ≥ 1kg/1L</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        value={form.unitSalePriceValue}
                        onChange={(e) => handleFieldChange('unitSalePriceValue', e.target.value)}
                        placeholder="e.g. 68.00"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={form.unitSalePriceUnit}
                        onChange={(e) => handleFieldChange('unitSalePriceUnit', e.target.value)}
                        placeholder="e.g. kg / g / l"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Combined text: ₹{form.unitSalePriceValue || '0.00'} / {form.unitSalePriceUnit || 'unit'}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Consumer Care Cell */}
            {activeTab === 'contacts' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Consumer Grievance Officer / Designation [Rule 6(1)(f)]
                  </label>
                  <input
                    type="text"
                    value={form.consumerCareName}
                    onChange={(e) => handleFieldChange('consumerCareName', e.target.value)}
                    placeholder="e.g. Manager, Consumer Care Cell"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Consumer Care Telephone No.
                    </label>
                    <input
                      type="text"
                      value={form.consumerCarePhone}
                      onChange={(e) => handleFieldChange('consumerCarePhone', e.target.value)}
                      placeholder="e.g. 1800-425-4444"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Consumer Care Email Address
                    </label>
                    <input
                      type="email"
                      value={form.consumerCareEmail}
                      onChange={(e) => handleFieldChange('consumerCareEmail', e.target.value)}
                      placeholder="e.g. itccares@itc.in"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Consumer Redressal Postal Address
                  </label>
                  <textarea
                    rows={2}
                    value={form.consumerCareAddress}
                    onChange={(e) => handleFieldChange('consumerCareAddress', e.target.value)}
                    placeholder="P.O. Box or corporate complaint cell address"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: Font & Legibility */}
            {activeTab === 'visuals' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estimated Numeral Font Height (mm) [Rule 9]
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.estimatedFontHeightMm || 2.5}
                      onChange={(e) => handleFieldChange('estimatedFontHeightMm', parseFloat(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estimated PDP Area (cm²)
                    </label>
                    <input
                      type="number"
                      value={form.pdpAreaSqCm || 250}
                      onChange={(e) => handleFieldChange('pdpAreaSqCm', parseFloat(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2">
                  <div className="font-semibold text-slate-900">Rule 9 Legibility Standard:</div>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <p>• Packages up to 50g/ml: Minimum 1.5mm</p>
                    <p>• Packages 50g to 200g/ml: Minimum 2.0mm</p>
                    <p>• Packages 200g to 1kg/1L: Minimum 4.0mm</p>
                    <p>• Packages &gt; 1kg/1L: Minimum 6.0mm</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleSaveCorrections}
                className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
              >
                Save Corrections
              </button>
              <button
                onClick={handleRunAudit}
                className="px-5 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-all"
              >
                <span>Run Compliance Check</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
