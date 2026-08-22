import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Trash2,
  Sparkles,
  AlertCircle,
  FileCheck2,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  Info,
  ArrowRight,
  Eye,
  Sliders,
  Scan,
} from 'lucide-react';
import {
  CommodityCategory,
  PackageImage,
  ProductDetails,
  User,
  ExtractedDeclarations,
} from '../types';
import { DEMO_PRESETS } from '../utils/sampleData';
import { analyzePackageImages, AnalysisProgressStep } from '../utils/ocrService';
import { useToast } from './Toast';

interface NewInspectionViewProps {
  currentUser: User;
  onAnalysisComplete: (product: ProductDetails, declarations: ExtractedDeclarations) => void;
  initialPresetId?: string;
}

const CATEGORIES: CommodityCategory[] = [
  'Food & Beverages',
  'Edible Oils & Fats',
  'Cosmetics & Toiletries',
  'Detergents & Cleaning',
  'Electronics & Appliances',
  'Textiles & Apparel',
  'General Consumer Goods',
  'Pharmaceuticals & Health',
];

export const NewInspectionView: React.FC<NewInspectionViewProps> = ({
  currentUser,
  onAnalysisComplete,
  initialPresetId,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<CommodityCategory>('Food & Beverages');
  const [commodityType, setCommodityType] = useState('');
  const [isImported, setIsImported] = useState(false);
  const [batchNumber, setBatchNumber] = useState(`B-${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`);
  const [barcode, setBarcode] = useState(`890${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  const [storeName, setStoreName] = useState('Metro Cash & Carry Hub');
  const [inspectionLocation, setInspectionLocation] = useState('Netaji Subhash Place, Pitampura, New Delhi - 110034');
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [inspectionTime, setInspectionTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [notes, setNotes] = useState('Regular market surveillance & consumer price monitoring under Legal Metrology Act 2009.');

  // Images state
  const [images, setImages] = useState<PackageImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Analysis Loading state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<AnalysisProgressStep | null>(null);

  // Load preset if selected
  const applyPreset = (presetId: string) => {
    const p = DEMO_PRESETS.find((x) => x.id === presetId);
    if (!p) return;

    setProductName(p.productDetails.productName);
    setBrand(p.productDetails.brand);
    setCategory(p.productDetails.category);
    setCommodityType(p.productDetails.commodityType);
    setIsImported(p.productDetails.isImported);
    setBatchNumber(p.productDetails.batchNumber);
    setBarcode(p.productDetails.barcode || '');
    setStoreName(p.productDetails.storeName);
    setInspectionLocation(p.productDetails.inspectionLocation);
    setNotes(p.productDetails.notes || '');

    // Set sample package image
    const sampleImg: PackageImage = {
      id: `img-${Date.now()}`,
      url: p.imageSvg,
      name: `${p.brand.toLowerCase()}_sample_pack.svg`,
      sizeBytes: 180000,
      type: 'image/svg+xml',
      uploadedAt: new Date().toISOString(),
      panelType: 'front',
    };
    setImages([sampleImg]);

    showToast({
      type: 'info',
      title: 'Sample Data Loaded',
      message: `Populated fields for "${p.name}". Click "Analyze Package" to run OCR.`,
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (fileList: File[]) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];

    fileList.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        showToast({
          type: 'error',
          title: 'Unsupported File Format',
          message: `${file.name} is not a supported image format. Please upload JPG, PNG, WEBP or SVG.`,
        });
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        showToast({
          type: 'warning',
          title: 'File Too Large',
          message: `${file.name} exceeds 15MB. Please upload a compressed image.`,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newImage: PackageImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          url,
          name: file.name,
          sizeBytes: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          panelType: images.length === 0 ? 'front' : 'back',
        };
        setImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handlePanelTypeChange = (id: string, panelType: PackageImage['panelType']) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, panelType } : img))
    );
  };

  // Run Analysis Workflow
  const handleAnalyze = async () => {
    if (images.length === 0) {
      showToast({
        type: 'warning',
        title: 'Package Image Required',
        message: 'Please upload at least one photograph of the packaged commodity or select a demo sample.',
      });
      return;
    }

    if (!productName.trim()) {
      showToast({
        type: 'warning',
        title: 'Product Name Required',
        message: 'Please provide the commodity name before initiating inspection analysis.',
      });
      return;
    }

    setIsAnalyzing(true);
    const productPayload: ProductDetails = {
      productName: productName.trim(),
      brand: brand.trim() || 'Generic Brand',
      category,
      commodityType: commodityType.trim() || productName,
      isImported,
      batchNumber,
      barcode,
      storeName,
      inspectionLocation,
      inspectorName: currentUser.name,
      inspectorId: currentUser.badgeNumber,
      inspectionDate,
      inspectionTime,
      notes,
      images,
    };

    try {
      const extracted = await analyzePackageImages(images, productPayload, (p) => {
        setProgress(p);
      });

      setIsAnalyzing(false);
      showToast({
        type: 'success',
        title: 'OCR & Vision Analysis Complete',
        message: `Extracted declarations successfully via ${extracted.engineUsed}.`,
      });

      onAnalysisComplete(productPayload, extracted);
    } catch (err: any) {
      setIsAnalyzing(false);
      showToast({
        type: 'error',
        title: 'Analysis Failed',
        message: err.message || 'Could not complete package OCR analysis. Please try again.',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Scan className="w-4 h-4" />
            <span>Statutory Package Inspection Memo</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">New Package Inspection</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload package label photographs to run automated OCR, extract declarations, and verify compliance with Legal Metrology Rules 2011.
          </p>
        </div>

        {/* Quick Sample Loader */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-lg shrink-0">
          <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
          <span className="text-xs text-slate-600 font-semibold">Preset:</span>
          <select
            onChange={(e) => {
              if (e.target.value) applyPreset(e.target.value);
            }}
            defaultValue=""
            className="bg-white text-xs text-slate-800 border border-slate-300 rounded-md px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="" disabled>Choose Sample...</option>
            {DEMO_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Product & Commodity Details */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-bold">1</span>
              <span>Product &amp; Commodity Particulars</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product / Commodity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Select Sharbati Whole Wheat Atta"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aashirwad / Royal Delight"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Commodity Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CommodityCategory)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Commodity Type</label>
                <input
                  type="text"
                  placeholder="e.g. Wheat Flour / Basmati Rice / Mustard Oil"
                  value={commodityType}
                  onChange={(e) => setCommodityType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Origin Classification</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="origin"
                      checked={!isImported}
                      onChange={() => setIsImported(false)}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span>Domestic Manufacture</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="origin"
                      checked={isImported}
                      onChange={() => setIsImported(true)}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span className="text-orange-600 font-semibold">Imported Commodity</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Batch / Lot Number</label>
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">EAN / Barcode (Optional)</label>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Inspection Location & Inspector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-bold">2</span>
              <span>Field Inspection Location &amp; Schedule</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Retail Store / Establishment Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location &amp; Address</label>
                <input
                  type="text"
                  value={inspectionLocation}
                  onChange={(e) => setInspectionLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inspection Officer</label>
                <input
                  type="text"
                  disabled
                  value={`${currentUser.name} (${currentUser.badgeNumber})`}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={inspectionTime}
                    onChange={(e) => setInspectionTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inspector Notes &amp; Context</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Image Upload & Preview */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-bold">3</span>
                <span>Package Photographs ({images.length})</span>
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                multiple
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-800">Click or drag package label images</div>
                <div className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP, SVG up to 15MB</div>
              </div>
            </div>

            {/* Uploaded Images List */}
            {images.length > 0 ? (
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Uploaded Evidence Photographs:
                </div>
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                    >
                      <img
                        src={img.url}
                        alt="Preview"
                        className="w-14 h-14 object-cover rounded-md bg-white border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{img.name}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{(img.sizeBytes / 1024).toFixed(0)} KB</span>
                          <span>•</span>
                          <select
                            value={img.panelType}
                            onChange={(e) =>
                              handlePanelTypeChange(img.id, e.target.value as PackageImage['panelType'])
                            }
                            className="bg-white text-[10px] text-slate-700 rounded border border-slate-300 px-1.5 py-0.5 focus:outline-none"
                          >
                            <option value="front">Front PDP</option>
                            <option value="back">Back Info Panel</option>
                            <option value="side">Side Panel</option>
                            <option value="top">Top Flap</option>
                            <option value="bottom">Bottom Panel</option>
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(img.id);
                        }}
                        className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-600 text-slate-400 transition-colors"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-[11px] text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Tip: You can select a test preset from the top dropdown to automatically load high-resolution package label artwork.</span>
              </div>
            )}

            {/* Analyze CTA */}
            <div className="pt-2">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || images.length === 0 || !productName.trim()}
                className={`w-full py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                  isAnalyzing || images.length === 0 || !productName.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                    : 'bg-[#1e3a8a] hover:bg-[#1e40af] text-white'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing Package Declarations...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Analyze Package (OCR &amp; Vision AI)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Analysis Progress Modal */}
      {isAnalyzing && progress && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 max-w-md w-full rounded-2xl p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping"></div>
              <div className="w-14 h-14 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white shadow-lg">
                <Scan className="w-7 h-7 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
                Step {progress.step} of {progress.total}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{progress.label}</h3>
              <p className="text-xs text-slate-500 mt-1">{progress.detail}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-blue-600 transition-all duration-500 rounded-full"
                style={{ width: `${(progress.step / progress.total) * 100}%` }}
              />
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Extracting mandatory clauses under Rule 6(1) of Packaged Commodities Rules 2011
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
