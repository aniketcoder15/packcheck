export type UserRole = 'inspector' | 'supervisor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  badgeNumber: string;
  department?: string;
  zone?: string;
  jurisdictionZone?: string;
  avatarUrl?: string;
  active?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export type CommodityCategory =
  | 'Food & Beverages'
  | 'Edible Oils & Fats'
  | 'Cosmetics & Toiletries'
  | 'Detergents & Cleaning'
  | 'Electronics & Appliances'
  | 'Textiles & Apparel'
  | 'General Consumer Goods'
  | 'Pharmaceuticals & Health';

export interface ProductDetails {
  productName: string;
  brand: string;
  category: CommodityCategory;
  commodityType: string;
  isImported: boolean;
  batchNumber: string;
  barcode?: string;
  inspectionLocation: string;
  storeName: string;
  retailerAddress?: string;
  inspectorName: string;
  inspectorId: string;
  inspectionDate: string;
  inspectionTime: string;
  notes?: string;
  images: PackageImage[];
}

export interface PackageImage {
  id: string;
  url: string;
  name: string;
  sizeBytes: number;
  type: string;
  uploadedAt: string;
  panelType: 'front' | 'back' | 'side' | 'top' | 'bottom' | 'pdp' | 'general';
}

export interface BoundingBox {
  id: string;
  field: string;
  label: string;
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
  confidence: number;
  text: string;
  imageIndex?: number;
}

export interface ExtractedDeclarations {
  // Rule 6(1)(a) - Manufacturer / Packer / Importer
  manufacturerName: string;
  manufacturerAddress: string;
  packerName?: string;
  packerAddress?: string;
  importerName?: string;
  importerAddress?: string;

  // Rule 6(1)(g) - Country of Origin
  countryOfOrigin: string;

  // Rule 6(1)(b) - Generic Name
  genericProductName: string;

  // Rule 6(1)(c) - Net Quantity
  netQuantityValue: string;
  netQuantityUnit: string;
  netQuantityRawText: string;

  // Rule 6(1)(e) - MRP
  mrpValue: string;
  mrpRawText: string;
  mrpIncludesTaxes: boolean;
  hasDualMrpSuspicion: boolean;

  // Rule 6(1)(da) - Unit Sale Price (Mandatory >1kg/1L)
  unitSalePriceValue: string;
  unitSalePriceUnit: string;
  unitSalePriceRawText: string;

  // Rule 6(1)(d) - Date of Manufacture / Packing / Import
  manufactureMonthYear: string;
  packingMonthYear: string;
  importMonthYear?: string;
  dateRawText: string;

  // Best Before / Expiry
  bestBeforeDate?: string;
  expiryDate?: string;

  // Rule 6(1)(f) - Consumer Care Details
  consumerCareName: string;
  consumerCareAddress: string;
  consumerCarePhone: string;
  consumerCareEmail: string;
  consumerCareRawText: string;

  // Dimensions / Sizes (where applicable)
  dimensions?: string;
  grossWeight?: string;

  // Visual/readability assessment
  estimatedFontHeightMm?: number;
  pdpAreaSqCm?: number;
  contrastAdequate?: boolean;
  declarationsGrouped?: boolean;

  // Metadata
  overallOcrConfidence: number;
  boundingBoxes: BoundingBox[];
  analysisTimestamp?: string;
  engineUsed: string;
}

export type FindingStatus =
  | 'PASS'
  | 'WARNING'
  | 'FAIL'
  | 'NOT_APPLICABLE'
  | 'NEEDS_MANUAL_REVIEW';

export type CheckStatus = FindingStatus;

export type Severity = 'CRITICAL' | 'MODERATE' | 'MINOR';
export type RuleSeverity = Severity;

export interface LegalMetrologyRule {
  id: string;
  ruleReference: string;
  actSection?: string;
  title: string;
  description: string;
  category: string;
  applicabilityDescription?: string;
  severity?: RuleSeverity;
  defaultSeverity?: RuleSeverity;
  enabled: boolean;
  legalExplanation?: string;
  lastUpdated?: string;
}

export interface ManualReviewState {
  decision: 'ACCEPTED_VIOLATION' | 'REJECTED_COMPLIANT' | 'NEEDS_LAB_VERIFICATION' | 'PENDING';
  inspectorRemarks: string;
  reviewedBy: string;
  reviewedAt: string;
}

export interface ComplianceFinding {
  id: string;
  ruleId: string;
  ruleReference: string;
  actSection?: string;
  ruleTitle?: string;
  title?: string;
  status: FindingStatus;
  severity: Severity;
  extractedValue?: string;
  extractedEvidence?: string;
  expectedCondition?: string;
  legalExplanation?: string;
  explanation?: string;
  applicabilityNote?: string;
  confidence?: number;
  evidenceBox?: BoundingBox;
  recommendedAction?: string;
  manualReview?: ManualReviewState;
  manualReviewNotes?: string;
  manualReviewBy?: string;
  manualReviewTimestamp?: string;
}

export type InspectionOverallStatus =
  | 'COMPLIANT'
  | 'POTENTIAL_NON_COMPLIANCE'
  | 'NEEDS_REVIEW';

export interface InspectionRecord {
  id: string;
  referenceNumber: string;
  product: ProductDetails;
  rawExtractedDeclarations?: ExtractedDeclarations;
  extractedDeclarations?: ExtractedDeclarations;
  verifiedDeclarations: ExtractedDeclarations;
  findings: ComplianceFinding[];
  complianceScore: number;
  overallStatus: InspectionOverallStatus;
  status: 'DRAFT' | 'ANALYZED' | 'REVIEWED' | 'FINALIZED';
  summary?: string;
  inspectorRemarks: string;
  supervisorRemarks?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
  finalizedAt?: string;
  auditTrail: AuditLogEntry[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
}

export interface ProductHistorySummary {
  brand: string;
  productName: string;
  category: CommodityCategory;
  barcode?: string;
  totalInspections: number;
  averageScore: number;
  lastInspected: string;
  latestStatus: InspectionOverallStatus;
  inspections: InspectionRecord[];
}
