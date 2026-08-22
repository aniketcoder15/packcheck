import {
  InspectionRecord,
  ProductDetails,
  ExtractedDeclarations,
  User,
} from '../types';
import { runComplianceAudit } from './rulesEngine';

export const DEMO_USERS: User[] = [
  {
    id: 'usr-insp-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@legalmetrology.gov.in',
    role: 'inspector',
    designation: 'Legal Metrology Inspector (Field Grade I)',
    badgeNumber: 'LM-DL-2024-883',
    department: 'Department of Consumer Affairs, Delhi Circle',
    zone: 'North Zone - Sub-Division 4',
    jurisdictionZone: 'Delhi, North Zone',
    active: true,
    isActive: true,
  },
  {
    id: 'usr-sup-1',
    name: 'Priya Sen',
    email: 'priya.sen@legalmetrology.gov.in',
    role: 'supervisor',
    designation: 'Assistant Controller & Verification Officer',
    badgeNumber: 'LM-AC-2021-042',
    department: 'Directorate of Legal Metrology, HQ',
    zone: 'Northern Regional Headquarters',
    jurisdictionZone: 'National Capital Region, HQ Zone',
    active: true,
    isActive: true,
  },
  {
    id: 'usr-admin-1',
    name: 'Aniket Verma',
    email: 'admin.packcheck@legalmetrology.gov.in',
    role: 'admin',
    designation: 'Joint Director (Standards & Enforcement)',
    badgeNumber: 'LM-JD-2019-011',
    department: 'Ministry of Consumer Affairs, Food & Public Distribution',
    zone: 'Central Enforcement Directorate, New Delhi',
    jurisdictionZone: 'National Directorate, Central Zone',
    active: true,
    isActive: true,
  },
];

// Helper to create high-res SVG mockup labels for demo packages
export function generatePackageSvg(
  brand: string,
  productName: string,
  category: string,
  netQty: string,
  mrp: string,
  mrpInclusive: boolean,
  mfgText: string,
  dateText: string,
  careText: string,
  uspText?: string,
  originText?: string,
  accentColor = '#1e3a8a',
  dualMrpWarning = false
): string {
  const cleanSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%" style="background:#f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <linearGradient id="grad-${brand.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentColor}" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Package Outer Box -->
  <rect x="40" y="40" width="720" height="920" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="url(#shadow)"/>

  <!-- Top Header Banner -->
  <path d="M 40 56 Q 40 40 56 40 L 744 40 Q 760 40 760 56 L 760 200 L 40 200 Z" fill="url(#grad-${brand.replace(/\s+/g, '')})"/>
  
  <text x="70" y="90" fill="#f8fafc" font-size="16" font-weight="600" letter-spacing="2">PACKAGED COMMODITY • COMPLIANCE SAMPLE</text>
  <text x="70" y="145" fill="#ffffff" font-size="34" font-weight="800">${brand}</text>
  <text x="70" y="180" fill="#93c5fd" font-size="20" font-weight="500">${productName}</text>

  <!-- Category & Green/Red Veg Indicator -->
  <rect x="680" y="65" width="40" height="40" rx="6" fill="#ffffff" stroke="#16a34a" stroke-width="3"/>
  <circle cx="700" cy="85" r="10" fill="#16a34a"/>

  <!-- Principal Display Panel (PDP) Section -->
  <rect x="70" y="225" width="660" height="230" rx="10" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6,4"/>
  <text x="90" y="255" fill="#475569" font-size="13" font-weight="700" letter-spacing="1">PRINCIPAL DISPLAY PANEL (PDP)</text>
  
  <text x="90" y="300" fill="#0f172a" font-size="28" font-weight="800">${productName}</text>
  <text x="90" y="330" fill="#64748b" font-size="16">Category: ${category}</text>

  <!-- Net Quantity Box (Rule 6(1)(c)) -->
  <rect x="90" y="355" width="280" height="75" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
  <text x="110" y="380" fill="#0369a1" font-size="13" font-weight="600">NET QUANTITY / WEIGHT</text>
  <text x="110" y="415" fill="#0c4a6e" font-size="26" font-weight="800">${netQty}</text>

  <!-- Barcode Representation -->
  <g transform="translate(420, 360)">
    <rect x="0" y="0" width="220" height="65" fill="#ffffff" stroke="#e2e8f0"/>
    <path d="M 15 10 L 15 50 M 20 10 L 20 50 M 28 10 L 28 50 M 35 10 L 35 50 M 42 10 L 42 50 M 48 10 L 48 50 M 58 10 L 58 50 M 65 10 L 65 50 M 75 10 L 75 50 M 85 10 L 85 50 M 98 10 L 98 50 M 110 10 L 110 50 M 125 10 L 125 50 M 140 10 L 140 50 M 155 10 L 155 50 M 170 10 L 170 50 M 185 10 L 185 50 M 200 10 L 200 50" stroke="#0f172a" stroke-width="3"/>
    <text x="50" y="60" fill="#0f172a" font-size="10" font-family="monospace">8 901234 567890</text>
  </g>

  <!-- Mandatory Declarations Panel -->
  <rect x="70" y="475" width="660" height="455" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <rect x="70" y="475" width="660" height="35" rx="10" fill="#f8fafc"/>
  <text x="90" y="498" fill="#334155" font-size="14" font-weight="700">MANDATORY STATUTORY DECLARATIONS [LEGAL METROLOGY RULES, 2011]</text>

  <!-- Price & MRP Box (Rule 6(1)(e)) -->
  <g transform="translate(90, 525)">
    <rect x="0" y="0" width="310" height="95" rx="8" fill="#fefce8" stroke="#ca8a04" stroke-width="1.5"/>
    <text x="15" y="24" fill="#854d0e" font-size="12" font-weight="700">MAXIMUM RETAIL PRICE (MRP)</text>
    <text x="15" y="55" fill="#713f12" font-size="24" font-weight="800">${mrp}</text>
    <text x="15" y="78" fill="#854d0e" font-size="13">${mrpInclusive ? '(Inclusive of all taxes)' : '(Taxes extra)'}</text>
    ${dualMrpWarning ? '<rect x="180" y="10" width="120" height="75" rx="4" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5"/><text x="190" y="35" fill="#991b1b" font-size="11" font-weight="700">STICKER MRP</text><text x="190" y="60" fill="#b91c1c" font-size="18" font-weight="800">₹230.00</text>' : ''}
  </g>

  <!-- Unit Sale Price (USP) Box (Rule 6(1)(da)) -->
  <g transform="translate(420, 525)">
    <rect x="0" y="0" width="290" height="95" rx="8" fill="${uspText ? '#f0fdf4' : '#fff1f2'}" stroke="${uspText ? '#16a34a' : '#f43f5e'}" stroke-width="1.5"/>
    <text x="15" y="24" fill="${uspText ? '#15803d' : '#be123c'}" font-size="12" font-weight="700">UNIT SALE PRICE (USP)</text>
    <text x="15" y="55" fill="${uspText ? '#14532d' : '#881337'}" font-size="20" font-weight="800">${uspText || 'NOT DECLARED'}</text>
    <text x="15" y="78" fill="${uspText ? '#166534' : '#9f1239'}" font-size="12">${uspText ? 'Compliant with Rule 6(1)(da)' : 'Missing mandatory USP'}</text>
  </g>

  <!-- Dates & Batch (Rule 6(1)(d)) -->
  <g transform="translate(90, 635)">
    <text x="0" y="16" fill="#475569" font-size="13" font-weight="700">DATE OF PACKING / MFG:</text>
    <text x="190" y="16" fill="#0f172a" font-size="14" font-weight="600">${dateText}</text>
    
    <text x="360" y="16" fill="#475569" font-size="13" font-weight="700">BATCH / LOT NO:</text>
    <text x="490" y="16" fill="#0f172a" font-size="14" font-weight="600">B-2026/089X</text>
  </g>

  <line x1="90" y1="665" x2="710" y2="665" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Manufacturer Details (Rule 6(1)(a)) -->
  <g transform="translate(90, 685)">
    <text x="0" y="16" fill="#475569" font-size="13" font-weight="700">MANUFACTURED & PACKED BY:</text>
    <text x="0" y="38" fill="#1e293b" font-size="14" font-weight="500">${mfgText}</text>
    ${originText ? `<text x="0" y="65" fill="#0369a1" font-size="13" font-weight="700">COUNTRY OF ORIGIN: ${originText}</text>` : ''}
  </g>

  <line x1="90" y1="770" x2="710" y2="770" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Consumer Care Redressal (Rule 6(1)(f)) -->
  <g transform="translate(90, 790)">
    <text x="0" y="16" fill="#475569" font-size="13" font-weight="700">FOR CONSUMER COMPLAINTS / FEEDBACK:</text>
    <text x="0" y="40" fill="#334155" font-size="13">${careText}</text>
  </g>

  <!-- Legal Metrology Assurances Footer -->
  <rect x="70" y="880" width="660" height="40" rx="6" fill="#f8fafc"/>
  <text x="90" y="905" fill="#64748b" font-size="11">Standard packaged commodity verified as per Legal Metrology (Packaged Commodities) Rules, 2011</text>
</svg>
`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
}

export interface DemoSamplePreset {
  id: string;
  name: string;
  brand: string;
  category: any;
  commodityType: string;
  isImported: boolean;
  expectedStatus: 'COMPLIANT' | 'POTENTIAL_NON_COMPLIANCE' | 'NEEDS_REVIEW';
  summary: string;
  imageSvg: string;
  productDetails: ProductDetails;
  declarations: ExtractedDeclarations;
}

export const DEMO_PRESETS: DemoSamplePreset[] = [
  {
    id: 'sample-atta-5kg',
    name: 'Select Sharbati Whole Wheat Atta (5 kg)',
    brand: 'Aashirwad',
    category: 'Food & Beverages',
    commodityType: 'Wheat Flour / Atta',
    isImported: false,
    expectedStatus: 'COMPLIANT',
    summary: 'Fully compliant sample with all mandatory statutory declarations, correct metric units, valid USP, complete address with PIN, and complete consumer care cell.',
    imageSvg: generatePackageSvg(
      'Aashirwad',
      'Select Sharbati Whole Wheat Atta',
      'Food & Beverages',
      '5 kg',
      '₹340.00',
      true,
      'ITC Limited, 37 J.L. Nehru Road, Kolkata - 700071, West Bengal, India',
      '02/2026',
      'Contact Manager, ITC Consumer Care Cell, P.O. Box 592, Bengaluru - 560001 | Tel: 1800-425-4444 | Email: itccares@itc.in',
      '₹68.00 / kg',
      'India',
      '#b45309'
    ),
    productDetails: {
      productName: 'Select Sharbati Whole Wheat Atta',
      brand: 'Aashirwad',
      category: 'Food & Beverages',
      commodityType: 'Wheat Flour',
      isImported: false,
      batchNumber: 'B-2026/089X',
      barcode: '8901030829104',
      inspectionLocation: 'BigBasket Fulfillment Hub, Okhla Phase III, New Delhi',
      storeName: 'BigBasket Superstore Central',
      inspectorName: 'Rahul Sharma',
      inspectorId: 'LM-DL-2024-883',
      inspectionDate: '2026-08-20',
      inspectionTime: '10:30 AM',
      notes: 'Routine scheduled retail compliance audit of packaged staples.',
      images: [
        {
          id: 'img-atta-1',
          url: '',
          name: 'aashirwad_atta_front_panel.svg',
          sizeBytes: 184200,
          type: 'image/svg+xml',
          uploadedAt: '2026-08-20T10:31:00Z',
          panelType: 'front',
        },
      ],
    },
    declarations: {
      manufacturerName: 'ITC Limited',
      manufacturerAddress: '37 J.L. Nehru Road, Kolkata - 700071, West Bengal, India',
      countryOfOrigin: 'India',
      genericProductName: 'Whole Wheat Atta',
      netQuantityValue: '5',
      netQuantityUnit: 'kg',
      netQuantityRawText: '5 kg',
      mrpValue: '340.00',
      mrpRawText: 'MRP ₹340.00 (Inclusive of all taxes)',
      mrpIncludesTaxes: true,
      hasDualMrpSuspicion: false,
      unitSalePriceValue: '68.00',
      unitSalePriceUnit: 'kg',
      unitSalePriceRawText: '₹68.00 / kg',
      manufactureMonthYear: '02/2026',
      packingMonthYear: '02/2026',
      dateRawText: 'Pkd 02/2026',
      bestBeforeDate: 'Best Before 6 Months from Packaging',
      consumerCareName: 'Manager, ITC Consumer Care Cell',
      consumerCareAddress: 'P.O. Box 592, Bengaluru - 560001, Karnataka',
      consumerCarePhone: '1800-425-4444',
      consumerCareEmail: 'itccares@itc.in',
      consumerCareRawText: 'Manager, ITC Care, P.O. Box 592, Bengaluru - 560001. Tel: 1800-425-4444, Email: itccares@itc.in',
      estimatedFontHeightMm: 4.8,
      pdpAreaSqCm: 320,
      contrastAdequate: true,
      declarationsGrouped: true,
      overallOcrConfidence: 97,
      analysisTimestamp: '2026-08-20T10:32:00Z',
      engineUsed: 'Gemini 3.7 Vision OCR',
      boundingBoxes: [
        { id: 'b1', field: 'netQuantity', label: 'Net Quantity (5 kg)', ymin: 35, xmin: 11, ymax: 43, xmax: 45, confidence: 98, text: 'NET QUANTITY: 5 kg', imageIndex: 0 },
        { id: 'b2', field: 'mrp', label: 'MRP (₹340.00 incl. taxes)', ymin: 52, xmin: 11, ymax: 62, xmax: 48, confidence: 97, text: 'MRP ₹340.00 (Inclusive of all taxes)', imageIndex: 0 },
        { id: 'b3', field: 'usp', label: 'Unit Sale Price (₹68.00/kg)', ymin: 52, xmin: 52, ymax: 62, xmax: 90, confidence: 96, text: 'UNIT SALE PRICE: ₹68.00 / kg', imageIndex: 0 },
        { id: 'b4', field: 'manufacturer', label: 'Manufacturer & Address', ymin: 68, xmin: 11, ymax: 76, xmax: 90, confidence: 97, text: 'ITC Limited, 37 J.L. Nehru Road, Kolkata - 700071', imageIndex: 0 },
        { id: 'b5', field: 'consumerCare', label: 'Consumer Care Cell', ymin: 79, xmin: 11, ymax: 87, xmax: 90, confidence: 96, text: 'Manager, ITC Care, Tel: 1800-425-4444, Email: itccares@itc.in', imageIndex: 0 },
        { id: 'b6', field: 'date', label: 'Date of Packing', ymin: 63, xmin: 11, ymax: 67, xmax: 45, confidence: 95, text: '02/2026', imageIndex: 0 },
      ],
    },
  },
  {
    id: 'sample-rice-1kg',
    name: 'Royal Delight Golden Basmati Rice (1 kg)',
    brand: 'Royal Delight',
    category: 'Food & Beverages',
    commodityType: 'Basmati Rice',
    isImported: false,
    expectedStatus: 'POTENTIAL_NON_COMPLIANCE',
    summary: 'Non-compliant: Missing mandatory Unit Sale Price (USP) under Rule 6(1)(da) (package is 1kg), and consumer care email is missing (Rule 6(1)(f)).',
    imageSvg: generatePackageSvg(
      'Royal Delight',
      'Golden Aged Basmati Rice',
      'Food & Beverages',
      '1 kg',
      '₹165.00',
      true,
      'Royal Foods Agro Ltd, GT Karnal Road, Kundli, Sonepat - 131028, Haryana',
      '01/2026',
      'Consumer Cell: Royal Foods, GT Karnal Road, Kundli. Phone: 011-28491029 (Email not provided)',
      undefined, // Missing USP
      'India',
      '#1e3a8a'
    ),
    productDetails: {
      productName: 'Golden Aged Basmati Rice',
      brand: 'Royal Delight',
      category: 'Food & Beverages',
      commodityType: 'Rice',
      isImported: false,
      batchNumber: 'RD-RICE-2601',
      barcode: '8904092100231',
      inspectionLocation: 'Reliance Smart Bazaar, Rohini Sector 10, Delhi',
      storeName: 'Reliance Retail Store #412',
      inspectorName: 'Rahul Sharma',
      inspectorId: 'LM-DL-2024-883',
      inspectionDate: '2026-08-19',
      inspectionTime: '02:15 PM',
      notes: 'Sample picked up during surprise market surveillance.',
      images: [
        {
          id: 'img-rice-1',
          url: '',
          name: 'royal_rice_sample_pack.svg',
          sizeBytes: 172000,
          type: 'image/svg+xml',
          uploadedAt: '2026-08-19T14:16:00Z',
          panelType: 'front',
        },
      ],
    },
    declarations: {
      manufacturerName: 'Royal Foods Agro Ltd',
      manufacturerAddress: 'GT Karnal Road, Kundli, Sonepat - 131028, Haryana',
      countryOfOrigin: 'India',
      genericProductName: 'Basmati Rice',
      netQuantityValue: '1',
      netQuantityUnit: 'kg',
      netQuantityRawText: '1 kg',
      mrpValue: '165.00',
      mrpRawText: 'MRP ₹165.00 (Inclusive of all taxes)',
      mrpIncludesTaxes: true,
      hasDualMrpSuspicion: false,
      unitSalePriceValue: '',
      unitSalePriceUnit: '',
      unitSalePriceRawText: '',
      manufactureMonthYear: '01/2026',
      packingMonthYear: '01/2026',
      dateRawText: 'Packed Jan 2026',
      consumerCareName: 'Consumer Cell, Royal Foods',
      consumerCareAddress: 'GT Karnal Road, Kundli, Sonepat',
      consumerCarePhone: '011-28491029',
      consumerCareEmail: '', // Missing
      consumerCareRawText: 'Consumer Cell: Royal Foods. Phone: 011-28491029',
      estimatedFontHeightMm: 3.5,
      pdpAreaSqCm: 250,
      contrastAdequate: true,
      declarationsGrouped: true,
      overallOcrConfidence: 94,
      analysisTimestamp: '2026-08-19T14:20:00Z',
      engineUsed: 'Gemini 3.7 Vision OCR',
      boundingBoxes: [
        { id: 'b-r1', field: 'netQuantity', label: 'Net Quantity (1 kg)', ymin: 35, xmin: 11, ymax: 43, xmax: 45, confidence: 97, text: 'NET QUANTITY: 1 kg', imageIndex: 0 },
        { id: 'b-r2', field: 'mrp', label: 'MRP (₹165.00)', ymin: 52, xmin: 11, ymax: 62, xmax: 48, confidence: 96, text: 'MRP ₹165.00 (Inclusive of all taxes)', imageIndex: 0 },
        { id: 'b-r3', field: 'manufacturer', label: 'Manufacturer', ymin: 68, xmin: 11, ymax: 76, xmax: 90, confidence: 95, text: 'Royal Foods Agro Ltd, Sonepat - 131028', imageIndex: 0 },
        { id: 'b-r4', field: 'consumerCare', label: 'Consumer Cell (Missing Email)', ymin: 79, xmin: 11, ymax: 87, xmax: 90, confidence: 93, text: 'Consumer Cell: Phone 011-28491029', imageIndex: 0 },
      ],
    },
  },
  {
    id: 'sample-oil-1l',
    name: 'SunGold Kachi Ghani Mustard Oil (1 L)',
    brand: 'SunGold',
    category: 'Edible Oils & Fats',
    commodityType: 'Mustard Oil',
    isImported: false,
    expectedStatus: 'POTENTIAL_NON_COMPLIANCE',
    summary: 'Potential Violation: Dual MRP sticker alteration detected on retail pack (Rule 18(2)) and packaging date smudged/illegible.',
    imageSvg: generatePackageSvg(
      'SunGold',
      'Kachi Ghani Pure Mustard Oil',
      'Edible Oils & Fats',
      '1 l',
      '₹210.00',
      true,
      'SunGold Edibles Pvt Ltd, Industrial Area Phase II, Alwar - 301030, Rajasthan',
      '12/2025 (Smudged)',
      'Customer Grievance Officer, SunGold Edibles, Alwar - 301030 | Tel: 0144-2891900 | Email: support@sungoldoil.com',
      '₹210.00 / l',
      'India',
      '#ca8a04',
      true // Dual MRP
    ),
    productDetails: {
      productName: 'Kachi Ghani Pure Mustard Oil',
      brand: 'SunGold',
      category: 'Edible Oils & Fats',
      commodityType: 'Edible Oil',
      isImported: false,
      batchNumber: 'SG-MO-2512',
      barcode: '8906012489012',
      inspectionLocation: 'Gupta Kirana & General Store, Model Town, Delhi',
      storeName: 'Gupta Kirana Store',
      inspectorName: 'Rahul Sharma',
      inspectorId: 'LM-DL-2024-883',
      inspectionDate: '2026-08-18',
      inspectionTime: '11:45 AM',
      notes: 'Consumer complaint received regarding overcharging on printed MRP via sticker overpaste.',
      images: [
        {
          id: 'img-oil-1',
          url: '',
          name: 'sungold_oil_dual_mrp.svg',
          sizeBytes: 191000,
          type: 'image/svg+xml',
          uploadedAt: '2026-08-18T11:46:00Z',
          panelType: 'front',
        },
      ],
    },
    declarations: {
      manufacturerName: 'SunGold Edibles Pvt Ltd',
      manufacturerAddress: 'Industrial Area Phase II, Alwar - 301030, Rajasthan',
      countryOfOrigin: 'India',
      genericProductName: 'Mustard Oil',
      netQuantityValue: '1',
      netQuantityUnit: 'l',
      netQuantityRawText: '1 l',
      mrpValue: '210.00',
      mrpRawText: 'Original MRP ₹210.00 / Secondary Sticker ₹230.00',
      mrpIncludesTaxes: true,
      hasDualMrpSuspicion: true, // Violation flag
      unitSalePriceValue: '210.00',
      unitSalePriceUnit: 'l',
      unitSalePriceRawText: '₹210.00 / l',
      manufactureMonthYear: '12/2025',
      packingMonthYear: '12/2025',
      dateRawText: '12/2025 (Partially smudged)',
      consumerCareName: 'Customer Grievance Officer',
      consumerCareAddress: 'SunGold Edibles, Alwar - 301030',
      consumerCarePhone: '0144-2891900',
      consumerCareEmail: 'support@sungoldoil.com',
      consumerCareRawText: 'Grievance Officer, Tel: 0144-2891900, Email: support@sungoldoil.com',
      estimatedFontHeightMm: 3.2,
      pdpAreaSqCm: 280,
      contrastAdequate: true,
      declarationsGrouped: true,
      overallOcrConfidence: 89,
      analysisTimestamp: '2026-08-18T11:50:00Z',
      engineUsed: 'Gemini 3.7 Vision OCR',
      boundingBoxes: [
        { id: 'b-o1', field: 'mrp', label: 'Dual MRP Overpaste (₹210 / ₹230)', ymin: 52, xmin: 11, ymax: 62, xmax: 48, confidence: 92, text: 'Dual MRP Sticker Detected', imageIndex: 0 },
        { id: 'b-o2', field: 'netQuantity', label: 'Net Quantity (1 l)', ymin: 35, xmin: 11, ymax: 43, xmax: 45, confidence: 95, text: '1 l', imageIndex: 0 },
        { id: 'b-o3', field: 'date', label: 'Smudged Packing Date', ymin: 63, xmin: 11, ymax: 67, xmax: 45, confidence: 78, text: '12/2025 (Smudged)', imageIndex: 0 },
      ],
    },
  },
  {
    id: 'sample-detergent-2l',
    name: 'Sparkle Ultra Liquid Detergent (2 L)',
    brand: 'Sparkle Clean',
    category: 'Detergents & Cleaning',
    commodityType: 'Liquid Detergent',
    isImported: false,
    expectedStatus: 'NEEDS_REVIEW',
    summary: 'Requires verification: Font size on declarations is borderline (~1.8mm vs recommended 2.0mm for 2L bottle area) but otherwise fully compliant.',
    imageSvg: generatePackageSvg(
      'Sparkle Clean',
      'Ultra Concentrated Liquid Detergent',
      'Detergents & Cleaning',
      '2 l',
      '₹385.00',
      true,
      'Sparkle Clean Home Care Pvt Ltd, Peenya Industrial Area, Bengaluru - 560058, Karnataka',
      '02/2026',
      'Consumer Relationship Cell, Sparkle Clean, Peenya, Bengaluru - 560058 | Tel: 1800-890-7711 | Email: help@sparkleclean.co.in',
      '₹192.50 / l',
      'India',
      '#059669'
    ),
    productDetails: {
      productName: 'Ultra Concentrated Liquid Detergent',
      brand: 'Sparkle Clean',
      category: 'Detergents & Cleaning',
      commodityType: 'Cleaning Detergent',
      isImported: false,
      batchNumber: 'SC-LD-2602',
      barcode: '8907812903415',
      inspectionLocation: 'DMart Megastore, Sector 14, Gurugram, Haryana',
      storeName: 'Avenue Supermarts DMart #18',
      inspectorName: 'Rahul Sharma',
      inspectorId: 'LM-DL-2024-883',
      inspectionDate: '2026-08-17',
      inspectionTime: '04:30 PM',
      notes: 'Routine audit of non-food cleaning commodities.',
      images: [
        {
          id: 'img-det-1',
          url: '',
          name: 'sparkle_detergent_pack.svg',
          sizeBytes: 188000,
          type: 'image/svg+xml',
          uploadedAt: '2026-08-17T16:31:00Z',
          panelType: 'front',
        },
      ],
    },
    declarations: {
      manufacturerName: 'Sparkle Clean Home Care Pvt Ltd',
      manufacturerAddress: 'Peenya Industrial Area, Bengaluru - 560058, Karnataka',
      countryOfOrigin: 'India',
      genericProductName: 'Liquid Detergent',
      netQuantityValue: '2',
      netQuantityUnit: 'l',
      netQuantityRawText: '2 l',
      mrpValue: '385.00',
      mrpRawText: 'MRP ₹385.00 (Inclusive of all taxes)',
      mrpIncludesTaxes: true,
      hasDualMrpSuspicion: false,
      unitSalePriceValue: '192.50',
      unitSalePriceUnit: 'l',
      unitSalePriceRawText: '₹192.50 / l',
      manufactureMonthYear: '02/2026',
      packingMonthYear: '02/2026',
      dateRawText: '02/2026',
      consumerCareName: 'Consumer Relationship Cell',
      consumerCareAddress: 'Peenya Industrial Area, Bengaluru - 560058',
      consumerCarePhone: '1800-890-7711',
      consumerCareEmail: 'help@sparkleclean.co.in',
      consumerCareRawText: 'Care Cell: Tel 1800-890-7711, help@sparkleclean.co.in',
      estimatedFontHeightMm: 1.8, // Borderline
      pdpAreaSqCm: 380,
      contrastAdequate: true,
      declarationsGrouped: true,
      overallOcrConfidence: 95,
      analysisTimestamp: '2026-08-17T16:35:00Z',
      engineUsed: 'Gemini 3.7 Vision OCR',
      boundingBoxes: [
        { id: 'b-d1', field: 'netQuantity', label: 'Net Quantity (2 l)', ymin: 35, xmin: 11, ymax: 43, xmax: 45, confidence: 97, text: '2 l', imageIndex: 0 },
        { id: 'b-d2', field: 'mrp', label: 'MRP & USP', ymin: 52, xmin: 11, ymax: 62, xmax: 90, confidence: 96, text: 'MRP ₹385.00 (USP ₹192.50/l)', imageIndex: 0 },
      ],
    },
  },
  {
    id: 'sample-cookies-200g',
    name: 'Alpine Crunch Imported Hazelnut Cookies (200 g)',
    brand: 'Alpine Crunch',
    category: 'Food & Beverages',
    commodityType: 'Bakery / Cookies',
    isImported: true,
    expectedStatus: 'POTENTIAL_NON_COMPLIANCE',
    summary: 'Critical Non-compliance: Imported commodity missing mandatory Country of Origin (Rule 6(1)(g)) and MRP lacks statutory tax-inclusive phrase.',
    imageSvg: generatePackageSvg(
      'Alpine Crunch',
      'Swiss Recipe Hazelnut Cookies',
      'Food & Beverages',
      '200 g',
      '₹250.00',
      false, // Missing tax inclusive
      'Imported & Marketed by: Global Gourmet Imports, Andheri East, Mumbai - 400069',
      '11/2025',
      'For feedback: Global Gourmet Imports, Mumbai. Phone: 022-67890123',
      undefined,
      undefined, // Missing origin on imported pack
      '#7c2d12'
    ),
    productDetails: {
      productName: 'Swiss Recipe Hazelnut Cookies',
      brand: 'Alpine Crunch',
      category: 'Food & Beverages',
      commodityType: 'Confectionery / Cookies',
      isImported: true,
      batchNumber: 'AC-HZ-991',
      barcode: '7612345009812',
      inspectionLocation: 'Nature Basket Gourmet Store, Defence Colony, New Delhi',
      storeName: 'Nature Basket Store #104',
      inspectorName: 'Rahul Sharma',
      inspectorId: 'LM-DL-2024-883',
      inspectionDate: '2026-08-16',
      inspectionTime: '01:10 PM',
      notes: 'Customs port warehouse and retail imported shelf inspection.',
      images: [
        {
          id: 'img-cook-1',
          url: '',
          name: 'alpine_cookies_import.svg',
          sizeBytes: 176000,
          type: 'image/svg+xml',
          uploadedAt: '2026-08-16T13:11:00Z',
          panelType: 'front',
        },
      ],
    },
    declarations: {
      manufacturerName: '',
      manufacturerAddress: '',
      importerName: 'Global Gourmet Imports',
      importerAddress: 'Andheri East, Mumbai - 400069, Maharashtra',
      countryOfOrigin: '', // Missing!
      genericProductName: 'Hazelnut Cookies',
      netQuantityValue: '200',
      netQuantityUnit: 'g',
      netQuantityRawText: '200 g',
      mrpValue: '250.00',
      mrpRawText: 'MRP Rs. 250.00',
      mrpIncludesTaxes: false, // Missing tax inclusive text!
      hasDualMrpSuspicion: false,
      unitSalePriceValue: '',
      unitSalePriceUnit: '',
      unitSalePriceRawText: '',
      manufactureMonthYear: '11/2025',
      packingMonthYear: '11/2025',
      dateRawText: '11/2025',
      consumerCareName: 'Global Gourmet Imports Helpdesk',
      consumerCareAddress: 'Andheri East, Mumbai - 400069',
      consumerCarePhone: '022-67890123',
      consumerCareEmail: '', // Missing
      consumerCareRawText: 'Feedback: Phone 022-67890123',
      estimatedFontHeightMm: 2.2,
      pdpAreaSqCm: 160,
      contrastAdequate: true,
      declarationsGrouped: true,
      overallOcrConfidence: 91,
      analysisTimestamp: '2026-08-16T13:15:00Z',
      engineUsed: 'Gemini 3.7 Vision OCR',
      boundingBoxes: [
        { id: 'b-c1', field: 'mrp', label: 'MRP (Missing Tax Inclusive)', ymin: 52, xmin: 11, ymax: 62, xmax: 48, confidence: 93, text: 'MRP Rs. 250.00', imageIndex: 0 },
        { id: 'b-c2', field: 'importer', label: 'Importer Details', ymin: 68, xmin: 11, ymax: 76, xmax: 90, confidence: 94, text: 'Global Gourmet Imports, Mumbai - 400069', imageIndex: 0 },
      ],
    },
  },
];

// Generate initial database of inspection records
export function getInitialSeedInspections(): InspectionRecord[] {
  return DEMO_PRESETS.map((preset, index) => {
    // Fill image URL with the generated SVG data URL
    const product: ProductDetails = {
      ...preset.productDetails,
      images: preset.productDetails.images.map((img) => ({
        ...img,
        url: preset.imageSvg,
      })),
    };

    const audit = runComplianceAudit(product, preset.declarations);

    const record: InspectionRecord = {
      id: `insp-${preset.id}`,
      referenceNumber: `INSP/2026/NZ/048${index + 1}`,
      product,
      extractedDeclarations: preset.declarations,
      verifiedDeclarations: preset.declarations,
      findings: audit.findings,
      complianceScore: audit.score,
      overallStatus: audit.overallStatus,
      status: index === 0 ? 'FINALIZED' : index === 1 ? 'REVIEWED' : 'ANALYZED',
      inspectorRemarks:
        audit.overallStatus === 'COMPLIANT'
          ? 'All statutory declarations found strictly aligned with Legal Metrology (Packaged Commodities) Rules, 2011.'
          : 'Potential non-compliances flagged. Inspector review recommended for verification before notice issuance.',
      supervisorRemarks:
        index === 0
          ? 'Verification completed. Sample approved as compliant.'
          : undefined,
      verifiedBy: index === 0 ? 'Priya Sen (Assistant Controller)' : undefined,
      createdAt: product.inspectionDate + 'T10:00:00Z',
      updatedAt: product.inspectionDate + 'T11:00:00Z',
      finalizedAt: index === 0 ? product.inspectionDate + 'T11:30:00Z' : undefined,
      auditTrail: [
        {
          id: `aud-${index}-1`,
          timestamp: product.inspectionDate + 'T10:00:00Z',
          actor: product.inspectorName,
          role: 'Inspector',
          action: 'CREATED_INSPECTION',
          details: `Package uploaded from ${product.storeName}`,
        },
        {
          id: `aud-${index}-2`,
          timestamp: product.inspectionDate + 'T10:05:00Z',
          actor: 'System OCR & Rules Engine',
          role: 'AI Engine',
          action: 'ANALYZED_PACKAGE',
          details: `Extracted declarations and computed score ${audit.score}% (${audit.overallStatus})`,
        },
      ],
    };

    return record;
  });
}
