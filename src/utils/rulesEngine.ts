import {
  LegalMetrologyRule,
  ComplianceFinding,
  ExtractedDeclarations,
  ProductDetails,
  CheckStatus,
  RuleSeverity,
} from '../types';

export const DEFAULT_RULES: LegalMetrologyRule[] = [
  {
    id: 'RULE_6_1_A_MFG',
    ruleReference: 'Rule 6(1)(a)',
    actSection: 'Section 36, Legal Metrology Act, 2009',
    title: 'Manufacturer / Packer / Importer Name & Address',
    description:
      'The name and complete postal address of the manufacturer or packer or importer must be clearly declared on the package.',
    category: 'Mandatory Declarations',
    applicabilityDescription:
      'Applies to all pre-packaged commodities sold in India. For imported items, importer details are mandatory.',
    severity: 'CRITICAL',
    enabled: true,
    lastUpdated: '2026-01-15',
  },
  {
    id: 'RULE_6_1_A_PIN',
    ruleReference: 'Rule 6(1)(a) Expl. I',
    actSection: 'Section 36, Legal Metrology Act, 2009',
    title: 'Address Completeness & PIN Code',
    description:
      'Address must include street/plot details, city/district, state, and a valid 6-digit Postal PIN Code for verifiable traceability.',
    category: 'Mandatory Declarations',
    applicabilityDescription:
      'Applies to manufacturer/packer/importer addresses on all commercial retail packaging.',
    severity: 'MODERATE',
    enabled: true,
    lastUpdated: '2026-01-15',
  },
  {
    id: 'RULE_6_1_B_GENERIC',
    ruleReference: 'Rule 6(1)(b)',
    actSection: 'Section 36, Legal Metrology Act, 2009',
    title: 'Generic or Common Name of Commodity',
    description:
      'The generic or common name of the commodity contained in the package must be prominently declared on the Principal Display Panel.',
    category: 'Mandatory Declarations',
    applicabilityDescription:
      'Applies to all packaged commodities to prevent deceptive or misleading packaging.',
    severity: 'CRITICAL',
    enabled: true,
    lastUpdated: '2026-01-15',
  },
  {
    id: 'RULE_6_1_C_NET_QTY',
    ruleReference: 'Rule 6(1)(c) read with Rule 12',
    actSection: 'Section 36 & 39, Legal Metrology Act, 2009',
    title: 'Net Quantity in Standard Metric Units',
    description:
      'Net quantity must be declared in standard metric units (g, kg, ml, l, m, mm, cm, or number). Non-standard units (e.g. gms, Kgs, Ltrs, pieces without count) are prohibited.',
    category: 'Quantity & Units',
    applicabilityDescription:
      'Applies to all packaged commodities. Metric unit standard symbols as per Second Schedule.',
    severity: 'CRITICAL',
    enabled: true,
    lastUpdated: '2026-01-15',
  },
  {
    id: 'RULE_6_1_E_MRP',
    ruleReference: 'Rule 6(1)(e)',
    actSection: 'Section 36(1), Legal Metrology Act, 2009',
    title: 'Maximum Retail Price (MRP) & Tax Inclusivity',
    description:
      'MRP must be declared in Indian Rupees (₹ or Rs.) along with the mandatory phrase "inclusive of all taxes" or "incl. of all taxes".',
    category: 'Pricing & MRP',
    applicabilityDescription:
      'Mandatory on all retail pre-packaged commodities offered for sale to consumers.',
    severity: 'CRITICAL',
    enabled: true,
    lastUpdated: '2026-01-15',
  },
  {
    id: 'RULE_6_1_DA_USP',
    ruleReference: 'Rule 6(1)(da) (2021/2022 Amendment)',
    actSection: 'G.S.R. 779(E) & Section 36, LM Act',
    title: 'Unit Sale Price (USP) Declaration',
    description:
      'Unit Sale Price (e.g., ₹/g, ₹/kg, ₹/ml, ₹/l, ₹/piece) must be declared where net quantity exceeds 1 kg or 1 litre, or contains more than one unit.',
    category: 'Pricing & MRP',
    applicabilityDescription:
      'Mandatory for all commodities exceeding 1 kg or 1 litre, and multi-piece packs.',
    severity: 'CRITICAL',
    enabled: true,
    lastUpdated: '2026-01-15',
  },
  {
    id: 'RULE_6_1_D_DATE',
    ruleReference: 'Rule 6(1)(d)',
    actSection: 'Section 36, Legal Metrology Act, 2009',
    title: 'Month and Year of Manufacture / Packing / Import',
    description:
      'Month and year in which commodity is manufactured, packed, or imported must be clearly indicated (e.g., MM/YYYY, Month YYYY).',
    category: 'Mandatory Declarations',
    applicabilityDescription:
      'Applies to all pre-packaged commodities to ensure freshness and shelf-life traceability.',
    severity: 'CRITICAL',
    enabled: true,
    lastUpdated: '2026-01-15',
  },
  {
    id: 'RULE_6_1_F_CONSUMER_CARE',
    ruleReference: 'Rule 6(1)(f)',
    actSection: 'Section 36, Legal Metrology Act, 2009',
    title: 'Consumer Grievance / Care Redressal Details',
    description:
      'Package must bear Name/Designation, complete postal address, working telephone number, and valid email address of the consumer care cell.',
    category: 'Consumer Grievance',
    applicabilityDescription:
      'Mandatory on all retail packaging. All 4 elements (Designation/Name, Address, Phone, Email) must be present.',
    severity: 'CRITICAL',
    enabled: true,
    lastUpdated: '2026-01-15',
  },
  {
    id: 'RULE_6_1_G_ORIGIN',
    ruleReference: 'Rule 6(1)(g)',
    actSection: 'Section 36, Legal Metrology Act, 2009',
    title: 'Country of Origin for Imported Packages',
    description:
      'For imported commodities, the package must prominently mention the Country of Origin or Country of Manufacture.',
    category: 'Import Requirements',
    applicabilityDescription:
      'Mandatory for all imported goods. For purely domestic manufactured goods, origin declaration is optional or implicit.',
    severity: 'CRITICAL',
    enabled: true,
    lastUpdated: '2026-01-15',
  },
  {
    id: 'RULE_9_FONT_LEGIBILITY',
    ruleReference: 'Rule 9 & Schedule II',
    actSection: 'Section 36, Legal Metrology Act, 2009',
    title: 'Minimum Font Height & Legibility Standards',
    description:
      'Declarations must maintain minimum numeral and font height (ranging from 1.5mm to 6.0mm depending on net quantity and PDP area) with high contrast background.',
    category: 'Legibility & Font',
    applicabilityDescription:
      'Applies to all text declarations on the principal display panel and information panels.',
    severity: 'MODERATE',
    enabled: true,
    lastUpdated: '2026-01-15',
  },
  {
    id: 'RULE_18_DUAL_PRICING',
    ruleReference: 'Rule 18(2) & 18(3)',
    actSection: 'Section 36(2), Legal Metrology Act, 2009',
    title: 'Prohibition of Dual MRP or Defaced Declarations',
    description:
      'No manufacturer, packer, or retailer shall declare dual MRPs or alter, smudge, or obliterate the price or mandatory declarations.',
    category: 'Pricing & MRP',
    applicabilityDescription:
      'Applies across all retail points of sale to protect consumers against price gouging.',
    severity: 'CRITICAL',
    enabled: true,
    lastUpdated: '2026-01-15',
  },
  {
    id: 'RULE_7_DIMENSIONS',
    ruleReference: 'Rule 7 & Rule 8',
    actSection: 'Section 36, Legal Metrology Act, 2009',
    title: 'Dimensions & Sizes Declaration',
    description:
      'Packages containing commodities sold by dimensions (such as textiles, apparel, bedsheets, soap cakes, wire, cables) must clearly state length, width, and thickness.',
    category: 'Quantity & Units',
    applicabilityDescription:
      'Applies specifically to Textiles, Apparel, Cords, Soap bars, and dimension-sensitive goods.',
    severity: 'MODERATE',
    enabled: true,
    lastUpdated: '2026-01-15',
  },
];

export function runComplianceAudit(
  product: ProductDetails,
  declarations: ExtractedDeclarations,
  activeRules: LegalMetrologyRule[] = DEFAULT_RULES
): {
  findings: ComplianceFinding[];
  score: number;
  complianceScore: number;
  overallStatus: 'COMPLIANT' | 'POTENTIAL_NON_COMPLIANCE' | 'NEEDS_REVIEW';
  summary: string;
} {
  const findings: ComplianceFinding[] = [];

  // Helper to find bounding box by field keyword
  const getBox = (keyword: string) => {
    return declarations.boundingBoxes.find((b) =>
      b.field.toLowerCase().includes(keyword.toLowerCase()) ||
      b.label.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // 1. RULE 6(1)(a) - Manufacturer / Packer / Importer
  const ruleMfg = activeRules.find((r) => r.id === 'RULE_6_1_A_MFG');
  if (ruleMfg && ruleMfg.enabled) {
    const hasMfg =
      declarations.manufacturerName?.trim().length > 2 ||
      declarations.packerName?.trim().length > 2 ||
      declarations.importerName?.trim().length > 2;

    const mfgText =
      declarations.manufacturerName ||
      declarations.packerName ||
      declarations.importerName ||
      '';

    let status: CheckStatus = 'PASS';
    let explanation = `Manufacturer/Packer/Importer clearly identified: "${mfgText}".`;
    let expectedCondition = 'Clear identification of Manufacturer, Packer or Importer name';
    let recommendedAction = 'Maintain current declaration format.';

    if (!hasMfg) {
      status = 'FAIL';
      explanation = 'Name of manufacturer, packer, or importer was not detected on visible packaging panels.';
      expectedCondition = 'Mandatory declaration of Manufacturer, Packer, or Importer entity name.';
      recommendedAction =
        'Issue notice under Section 36 of Legal Metrology Act, 2009 for missing manufacturer identification.';
    } else if (mfgText.length < 5) {
      status = 'NEEDS_MANUAL_REVIEW';
      explanation = `Detected manufacturer name "${mfgText}" appears truncated or abbreviated. Requires verification.`;
      recommendedAction = 'Inspect physical packaging to confirm legal entity full registered trade name.';
    }

    findings.push({
      id: 'finding-mfg-name',
      ruleId: ruleMfg.id,
      ruleReference: ruleMfg.ruleReference,
      actSection: ruleMfg.actSection,
      title: ruleMfg.title,
      status,
      severity: ruleMfg.severity,
      extractedValue: mfgText || 'Not Detected',
      expectedCondition,
      explanation,
      applicabilityNote: 'Mandatory on all retail packaged goods under Rule 6(1)(a).',
      confidence: hasMfg ? 95 : 40,
      evidenceBox: getBox('manufacturer') || getBox('packer'),
      recommendedAction,
      manualReview: {
        decision: status === 'FAIL' ? 'ACCEPTED_VIOLATION' : 'PENDING',
        inspectorRemarks: '',
        reviewedBy: '',
        reviewedAt: '',
      },
    });
  }

  // 2. RULE 6(1)(a) PIN & Address Completeness
  const rulePin = activeRules.find((r) => r.id === 'RULE_6_1_A_PIN');
  if (rulePin && rulePin.enabled) {
    const address = declarations.manufacturerAddress || declarations.packerAddress || declarations.importerAddress || '';
    const pinRegex = /\b[1-9][0-9]{5}\b/;
    const hasPin = pinRegex.test(address);
    const hasAddress = address.trim().length > 10;

    let status: CheckStatus = 'PASS';
    let explanation = `Complete physical address with valid PIN code detected: "${address}".`;
    let expectedCondition = 'Complete address with street, locality, state and 6-digit PIN code.';
    let recommendedAction = 'No action required.';

    if (!hasAddress) {
      status = 'FAIL';
      explanation = 'Manufacturer address is completely missing or inadequate for consumer traceability.';
      expectedCondition = 'Complete physical address with city, state, and PIN code.';
      recommendedAction = 'Issue compounding / rectification notice for non-traceable manufacturer address.';
    } else if (!hasPin) {
      status = 'WARNING';
      explanation = `Address was detected ("${address}") but standard 6-digit postal PIN code is missing.`;
      expectedCondition = 'Postal PIN code is mandatory under Rule 6(1)(a) Explanation I.';
      recommendedAction = 'Verify whether manufacturer is located in designated municipal jurisdiction or issue advisory notice.';
    }

    findings.push({
      id: 'finding-address-pin',
      ruleId: rulePin.id,
      ruleReference: rulePin.ruleReference,
      actSection: rulePin.actSection,
      title: rulePin.title,
      status,
      severity: rulePin.severity,
      extractedValue: address || 'Incomplete / Missing',
      expectedCondition,
      explanation,
      applicabilityNote: 'Traceability requirement under Rule 6(1)(a).',
      confidence: hasAddress ? (hasPin ? 96 : 80) : 35,
      evidenceBox: getBox('address') || getBox('manufacturer'),
      recommendedAction,
      manualReview: {
        decision: status === 'FAIL' ? 'ACCEPTED_VIOLATION' : 'PENDING',
        inspectorRemarks: '',
        reviewedBy: '',
        reviewedAt: '',
      },
    });
  }

  // 3. RULE 6(1)(b) - Generic Name
  const ruleGeneric = activeRules.find((r) => r.id === 'RULE_6_1_B_GENERIC');
  if (ruleGeneric && ruleGeneric.enabled) {
    const genericName = declarations.genericProductName?.trim();
    const hasGeneric = genericName && genericName.length > 2;

    let status: CheckStatus = 'PASS';
    let explanation = `Generic/common product name "${genericName}" detected.`;
    let expectedCondition = 'Clear generic or common name of the commodity on the principal display panel.';
    let recommendedAction = 'Compliant with Rule 6(1)(b).';

    if (!hasGeneric) {
      status = 'FAIL';
      explanation = 'Generic name of the commodity was not detected on the principal display panel.';
      expectedCondition = 'Generic name must describe the true nature of the commodity (not just brand name).';
      recommendedAction = 'Issue show-cause notice for deceptive packaging under Section 36.';
    }

    findings.push({
      id: 'finding-generic-name',
      ruleId: ruleGeneric.id,
      ruleReference: ruleGeneric.ruleReference,
      actSection: ruleGeneric.actSection,
      title: ruleGeneric.title,
      status,
      severity: ruleGeneric.severity,
      extractedValue: genericName || 'Not Found',
      expectedCondition,
      explanation,
      applicabilityNote: 'Mandatory on Principal Display Panel for all commodities.',
      confidence: hasGeneric ? 92 : 45,
      evidenceBox: getBox('generic') || getBox('product'),
      recommendedAction,
      manualReview: {
        decision: status === 'FAIL' ? 'ACCEPTED_VIOLATION' : 'PENDING',
        inspectorRemarks: '',
        reviewedBy: '',
        reviewedAt: '',
      },
    });
  }

  // 4. RULE 6(1)(c) - Net Quantity & Units
  const ruleNetQty = activeRules.find((r) => r.id === 'RULE_6_1_C_NET_QTY');
  if (ruleNetQty && ruleNetQty.enabled) {
    const qtyVal = declarations.netQuantityValue?.trim();
    const qtyUnit = declarations.netQuantityUnit?.trim().toLowerCase();
    const rawQty = declarations.netQuantityRawText?.trim();

    const standardUnits = ['g', 'kg', 'ml', 'l', 'm', 'cm', 'mm', 'n', 'no', 'nos', 'number', 'units'];
    const nonStandardMap: Record<string, string> = {
      gms: 'g',
      gm: 'g',
      'g.': 'g',
      kgs: 'kg',
      'kg.': 'kg',
      'kgs.': 'kg',
      ltr: 'l',
      ltrs: 'l',
      'l.': 'l',
      mlt: 'ml',
      'ml.': 'ml',
    };

    let status: CheckStatus = 'PASS';
    let explanation = `Net quantity "${qtyVal} ${qtyUnit}" detected in compliant metric standard format.`;
    let expectedCondition = 'Net quantity in standard metric units: g, kg, ml, l, or number.';
    let recommendedAction = 'Compliant with Rule 6(1)(c) and Rule 12.';

    if (!qtyVal || !qtyUnit) {
      status = 'FAIL';
      explanation = 'Net quantity declaration is missing or completely illegible on packaging.';
      expectedCondition = 'Net quantity is mandatory on Principal Display Panel.';
      recommendedAction = 'Seize sample and initiate proceedings under Section 36(1).';
    } else if (nonStandardMap[qtyUnit] || !standardUnits.includes(qtyUnit)) {
      status = 'WARNING';
      explanation = `Non-standard unit symbol "${qtyUnit}" used instead of prescribed statutory symbol "${nonStandardMap[qtyUnit] || 'standard metric unit'}".`;
      expectedCondition = 'Second Schedule prohibits non-standard abbreviations like "gms" or "Ltrs".';
      recommendedAction = 'Direct manufacturer to rectify unit symbol in subsequent production batches.';
    }

    findings.push({
      id: 'finding-net-qty',
      ruleId: ruleNetQty.id,
      ruleReference: ruleNetQty.ruleReference,
      actSection: ruleNetQty.actSection,
      title: ruleNetQty.title,
      status,
      severity: ruleNetQty.severity,
      extractedValue: rawQty || `${qtyVal} ${qtyUnit}`,
      expectedCondition,
      explanation,
      applicabilityNote: 'Rule 12 specifies strict metric units for all packaged commodities.',
      confidence: qtyVal ? 94 : 30,
      evidenceBox: getBox('quantity') || getBox('net'),
      recommendedAction,
      manualReview: {
        decision: status === 'FAIL' ? 'ACCEPTED_VIOLATION' : 'PENDING',
        inspectorRemarks: '',
        reviewedBy: '',
        reviewedAt: '',
      },
    });
  }

  // 5. RULE 6(1)(e) - MRP & Tax Inclusivity
  const ruleMrp = activeRules.find((r) => r.id === 'RULE_6_1_E_MRP');
  if (ruleMrp && ruleMrp.enabled) {
    const mrpVal = declarations.mrpValue?.trim();
    const hasTaxIncl = declarations.mrpIncludesTaxes;
    const rawMrp = declarations.mrpRawText?.trim();

    let status: CheckStatus = 'PASS';
    let explanation = `MRP ₹${mrpVal} declared with statutory tax-inclusive phrase.`;
    let expectedCondition = 'MRP in format "₹ XX.XX (inclusive of all taxes)" or "MRP Rs. XX.XX (incl. of all taxes)".';
    let recommendedAction = 'Compliant with Rule 6(1)(e).';

    if (!mrpVal || parseFloat(mrpVal.replace(/[^0-9.]/g, '')) <= 0) {
      status = 'FAIL';
      explanation = 'Maximum Retail Price (MRP) declaration is missing or obscured.';
      expectedCondition = 'MRP is mandatory on all retail packaged goods.';
      recommendedAction = 'Seize retail stock and issue compounding notice under Section 36.';
    } else if (!hasTaxIncl && !rawMrp?.toLowerCase().includes('tax')) {
      status = 'FAIL';
      explanation = `MRP ₹${mrpVal} is declared without mandatory statutory wording "(inclusive of all taxes)".`;
      expectedCondition = 'Statutory mandate requires explicit mention that MRP includes all taxes.';
      recommendedAction = 'Issue notice under Rule 6(1)(e) for misleading price declaration.';
    }

    findings.push({
      id: 'finding-mrp',
      ruleId: ruleMrp.id,
      ruleReference: ruleMrp.ruleReference,
      actSection: ruleMrp.actSection,
      title: ruleMrp.title,
      status,
      severity: ruleMrp.severity,
      extractedValue: rawMrp || `₹${mrpVal} ${hasTaxIncl ? '(incl. of all taxes)' : ''}`,
      expectedCondition,
      explanation,
      applicabilityNote: 'Mandatory for all consumer retail packages under Rule 6(1)(e).',
      confidence: mrpVal ? 95 : 35,
      evidenceBox: getBox('mrp') || getBox('price'),
      recommendedAction,
      manualReview: {
        decision: status === 'FAIL' ? 'ACCEPTED_VIOLATION' : 'PENDING',
        inspectorRemarks: '',
        reviewedBy: '',
        reviewedAt: '',
      },
    });
  }

  // 6. RULE 6(1)(da) - Unit Sale Price (USP)
  const ruleUsp = activeRules.find((r) => r.id === 'RULE_6_1_DA_USP');
  if (ruleUsp && ruleUsp.enabled) {
    // Check if package net quantity > 1kg or > 1L or multiple units
    const numQty = parseFloat(declarations.netQuantityValue?.replace(/[^0-9.]/g, '') || '0');
    const unit = declarations.netQuantityUnit?.toLowerCase();
    const isOverThreshold =
      (unit === 'kg' && numQty >= 1) ||
      (unit === 'l' && numQty >= 1) ||
      (unit === 'g' && numQty >= 1000) ||
      (unit === 'ml' && numQty >= 1000) ||
      product.category === 'Food & Beverages' ||
      product.category === 'Edible Oils & Fats' ||
      product.category === 'Detergents & Cleaning';

    const hasUsp = declarations.unitSalePriceValue?.trim().length > 0;
    const rawUsp = declarations.unitSalePriceRawText?.trim();

    let status: CheckStatus = 'PASS';
    let explanation = `Unit Sale Price "${rawUsp || `₹${declarations.unitSalePriceValue}/${declarations.unitSalePriceUnit}`}" declared as per 2021 amendment.`;
    let expectedCondition = 'Unit Sale Price mandatory when net quantity is 1kg/1L or greater (e.g., ₹/g, ₹/kg, ₹/ml).';
    let recommendedAction = 'Compliant with G.S.R. 779(E).';

    if (isOverThreshold && !hasUsp) {
      status = 'FAIL';
      explanation = `Net quantity is ${numQty} ${unit}, which exceeds threshold, but mandatory Unit Sale Price (USP) declaration is absent.`;
      expectedCondition = 'Under G.S.R. 779(E) (effective 2022), USP declaration is mandatory.';
      recommendedAction = 'Issue statutory violation notice under Rule 6(1)(da) for missing Unit Sale Price.';
    } else if (!isOverThreshold && !hasUsp) {
      status = 'NOT_APPLICABLE';
      explanation = `Package net quantity is under 1kg/1L (${numQty} ${unit}). Unit Sale Price declaration is optional.`;
      recommendedAction = 'No action required.';
    }

    findings.push({
      id: 'finding-usp',
      ruleId: ruleUsp.id,
      ruleReference: ruleUsp.ruleReference,
      actSection: ruleUsp.actSection,
      title: ruleUsp.title,
      status,
      severity: ruleUsp.severity,
      extractedValue: rawUsp || (hasUsp ? `₹${declarations.unitSalePriceValue}/${declarations.unitSalePriceUnit}` : 'Not Detected'),
      expectedCondition,
      explanation,
      applicabilityNote: isOverThreshold
        ? 'Mandatory: Package net quantity is ≥ 1 kg or 1 L under G.S.R. 779(E).'
        : 'Optional for small pack sizes (< 1 kg / 1 L).',
      confidence: hasUsp ? 93 : (isOverThreshold ? 88 : 99),
      evidenceBox: getBox('usp') || getBox('unit sale price'),
      recommendedAction,
      manualReview: {
        decision: status === 'FAIL' ? 'ACCEPTED_VIOLATION' : 'PENDING',
        inspectorRemarks: '',
        reviewedBy: '',
        reviewedAt: '',
      },
    });
  }

  // 7. RULE 6(1)(d) - Date of Mfg / Packing / Import
  const ruleDate = activeRules.find((r) => r.id === 'RULE_6_1_D_DATE');
  if (ruleDate && ruleDate.enabled) {
    const mfgDate = declarations.manufactureMonthYear || declarations.packingMonthYear || declarations.importMonthYear;
    const hasDate = mfgDate && mfgDate.trim().length >= 4;

    let status: CheckStatus = 'PASS';
    let explanation = `Manufacturing/packing date "${mfgDate}" detected in valid Month/Year format.`;
    let expectedCondition = 'Month and year of manufacture or pre-packing in standard MM/YYYY or Month YYYY format.';
    let recommendedAction = 'Compliant with Rule 6(1)(d).';

    if (!hasDate) {
      status = 'FAIL';
      explanation = 'Date of manufacture or pre-packing was not detected on packaging.';
      expectedCondition = 'Month and Year of packing/mfg is a mandatory consumer protection declaration.';
      recommendedAction = 'Issue notice under Rule 6(1)(d). Check physical batch stamp.';
    }

    findings.push({
      id: 'finding-date',
      ruleId: ruleDate.id,
      ruleReference: ruleDate.ruleReference,
      actSection: ruleDate.actSection,
      title: ruleDate.title,
      status,
      severity: ruleDate.severity,
      extractedValue: mfgDate || declarations.dateRawText || 'Not Found',
      expectedCondition,
      explanation,
      applicabilityNote: 'Mandatory under Rule 6(1)(d) for shelf-life and vintage verification.',
      confidence: hasDate ? 91 : 40,
      evidenceBox: getBox('date') || getBox('mfg') || getBox('pkd'),
      recommendedAction,
      manualReview: {
        decision: status === 'FAIL' ? 'ACCEPTED_VIOLATION' : 'PENDING',
        inspectorRemarks: '',
        reviewedBy: '',
        reviewedAt: '',
      },
    });
  }

  // 8. RULE 6(1)(f) - Consumer Care Details
  const ruleCare = activeRules.find((r) => r.id === 'RULE_6_1_F_CONSUMER_CARE');
  if (ruleCare && ruleCare.enabled) {
    const hasEmail = declarations.consumerCareEmail?.includes('@');
    const hasPhone = declarations.consumerCarePhone?.replace(/[^0-9]/g, '').length >= 8;
    const hasCareAddress = declarations.consumerCareAddress?.trim().length > 5;
    const hasName = declarations.consumerCareName?.trim().length > 2;

    const allPresent = hasEmail && hasPhone && hasCareAddress;
    const somePresent = hasEmail || hasPhone || hasCareAddress || hasName;

    let status: CheckStatus = 'PASS';
    let explanation = `Consumer care cell complete: Tel: ${declarations.consumerCarePhone || 'Detected'}, Email: ${declarations.consumerCareEmail || 'Detected'}.`;
    let expectedCondition = 'All 4 components: Officer Designation, Postal Address, Phone Number, and Email.';
    let recommendedAction = 'Compliant with Rule 6(1)(f).';

    if (!somePresent) {
      status = 'FAIL';
      explanation = 'Consumer care grievance contact information is completely missing.';
      expectedCondition = 'Mandatory declaration of consumer care telephone and email address.';
      recommendedAction = 'Issue immediate Section 36 notice for violation of consumer grievance mandate.';
    } else if (!hasEmail || !hasPhone) {
      status = 'FAIL';
      const missingItems: string[] = [];
      if (!hasEmail) missingItems.push('Email address');
      if (!hasPhone) missingItems.push('Telephone number');
      if (!hasCareAddress) missingItems.push('Grievance postal address');
      explanation = `Consumer care declaration is incomplete. Missing: ${missingItems.join(', ')}.`;
      expectedCondition = 'Both working phone number AND email address are statutorily mandatory under Rule 6(1)(f).';
      recommendedAction = 'Issue compounding notice for incomplete consumer care particulars.';
    }

    findings.push({
      id: 'finding-consumer-care',
      ruleId: ruleCare.id,
      ruleReference: ruleCare.ruleReference,
      actSection: ruleCare.actSection,
      title: ruleCare.title,
      status,
      severity: ruleCare.severity,
      extractedValue:
        declarations.consumerCareRawText ||
        `Tel: ${declarations.consumerCarePhone || 'N/A'}, Email: ${declarations.consumerCareEmail || 'N/A'}`,
      expectedCondition,
      explanation,
      applicabilityNote: 'Mandatory on all retail packaging under Rule 6(1)(f).',
      confidence: allPresent ? 96 : 70,
      evidenceBox: getBox('consumer') || getBox('care') || getBox('feedback'),
      recommendedAction,
      manualReview: {
        decision: status === 'FAIL' ? 'ACCEPTED_VIOLATION' : 'PENDING',
        inspectorRemarks: '',
        reviewedBy: '',
        reviewedAt: '',
      },
    });
  }

  // 9. RULE 6(1)(g) - Country of Origin
  const ruleOrigin = activeRules.find((r) => r.id === 'RULE_6_1_G_ORIGIN');
  if (ruleOrigin && ruleOrigin.enabled) {
    const isImported = product.isImported;
    const origin = declarations.countryOfOrigin?.trim();
    const hasOrigin = origin && origin.length > 2;

    let status: CheckStatus = 'PASS';
    let explanation = `Country of Origin "${origin || 'India'}" detected.`;
    let expectedCondition = 'Country of origin is mandatory for imported products; strongly recommended for all.';
    let recommendedAction = 'Compliant with Rule 6(1)(g).';

    if (isImported && !hasOrigin) {
      status = 'FAIL';
      explanation = 'Product is classified as imported, but Country of Origin declaration was not detected.';
      expectedCondition = 'Rule 6(1)(g) strictly requires Country of Origin on all imported packaged commodities.';
      recommendedAction = 'Detain imported consignment and issue notice to registered importer.';
    } else if (!isImported && !hasOrigin) {
      status = 'PASS';
      explanation = 'Domestic manufacture. Domestic origin is established via Indian manufacturer address.';
      expectedCondition = 'Domestic origin established via manufacturer PIN and state.';
      recommendedAction = 'Compliant.';
    }

    findings.push({
      id: 'finding-origin',
      ruleId: ruleOrigin.id,
      ruleReference: ruleOrigin.ruleReference,
      actSection: ruleOrigin.actSection,
      title: ruleOrigin.title,
      status,
      severity: ruleOrigin.severity,
      extractedValue: origin || (isImported ? 'Missing' : 'India (Domestic)'),
      expectedCondition,
      explanation,
      applicabilityNote: isImported
        ? 'Mandatory for all imported commodities under Rule 6(1)(g).'
        : 'Domestic product: Verified via Indian registered manufacturing address.',
      confidence: hasOrigin ? 95 : 85,
      evidenceBox: getBox('origin') || getBox('country'),
      recommendedAction,
      manualReview: {
        decision: status === 'FAIL' ? 'ACCEPTED_VIOLATION' : 'PENDING',
        inspectorRemarks: '',
        reviewedBy: '',
        reviewedAt: '',
      },
    });
  }

  // 10. RULE 9 - Minimum Font Height & Legibility
  const ruleFont = activeRules.find((r) => r.id === 'RULE_9_FONT_LEGIBILITY');
  if (ruleFont && ruleFont.enabled) {
    const fontHeight = declarations.estimatedFontHeightMm || 2.5;
    const contrastOk = declarations.contrastAdequate !== false;

    let status: CheckStatus = 'PASS';
    let explanation = `Estimated numeral/letter height is approx ${fontHeight.toFixed(1)}mm with adequate visual contrast.`;
    let expectedCondition = 'Minimum 1.5mm to 6.0mm depending on package volume and PDP area (Rule 9 Table I).';
    let recommendedAction = 'Visually compliant. Physical verification with gauge recommended during field inspection.';

    if (fontHeight < 1.5) {
      status = 'FAIL';
      explanation = `Estimated numeral height (~${fontHeight.toFixed(1)}mm) is below statutory minimum threshold of 1.5mm.`;
      expectedCondition = 'Rule 9 prescribes absolute minimum 1.5mm numeral height for smallest packages.';
      recommendedAction = 'Perform physical measurement using optical scale. Issue advisory/notice if below threshold.';
    } else if (fontHeight < 2.0) {
      status = 'NEEDS_MANUAL_REVIEW';
      explanation = `Font height (~${fontHeight.toFixed(1)}mm) is close to boundary threshold. Requires physical verification with gauge.`;
      recommendedAction = 'Use standard calibrated Legal Metrology magnifier to measure letter height.';
    }

    findings.push({
      id: 'finding-font-legibility',
      ruleId: ruleFont.id,
      ruleReference: ruleFont.ruleReference,
      actSection: ruleFont.actSection,
      title: ruleFont.title,
      status,
      severity: ruleFont.severity,
      extractedValue: `~${fontHeight.toFixed(1)} mm estimated height (Contrast: ${contrastOk ? 'Adequate' : 'Poor'})`,
      expectedCondition,
      explanation,
      applicabilityNote: 'Rule 9 Schedule II table of minimum font heights.',
      confidence: 75,
      evidenceBox: getBox('quantity') || getBox('mrp'),
      recommendedAction,
      manualReview: {
        decision: status === 'NEEDS_MANUAL_REVIEW' ? 'PENDING' : 'PENDING',
        inspectorRemarks: '',
        reviewedBy: '',
        reviewedAt: '',
      },
    });
  }

  // 11. RULE 18 - Dual Pricing / Discrepancies
  const ruleDual = activeRules.find((r) => r.id === 'RULE_18_DUAL_PRICING');
  if (ruleDual && ruleDual.enabled) {
    const hasDualSuspicion = declarations.hasDualMrpSuspicion;

    let status: CheckStatus = 'PASS';
    let explanation = 'Single consistent MRP detected without smudging or sticker alteration.';
    let expectedCondition = 'No multiple contradictory MRP declarations or defacement.';
    let recommendedAction = 'No violation detected.';

    if (hasDualSuspicion) {
      status = 'FAIL';
      explanation = 'Multiple divergent prices detected on package, or apparent sticker over-printing detected.';
      expectedCondition = 'Rule 18(2) strictly prohibits dual pricing and defacement of declared MRP.';
      recommendedAction = 'Inspect packaging physically for sticker pasting. Seize sample if dual pricing verified.';
    }

    findings.push({
      id: 'finding-dual-price',
      ruleId: ruleDual.id,
      ruleReference: ruleDual.ruleReference,
      actSection: ruleDual.actSection,
      title: ruleDual.title,
      status,
      severity: ruleDual.severity,
      extractedValue: hasDualSuspicion ? 'Potential Dual MRP / Sticker Detected' : 'Single Consistent MRP',
      expectedCondition,
      explanation,
      applicabilityNote: 'Rule 18 prohibits dual MRP across all retail channels.',
      confidence: 90,
      evidenceBox: getBox('mrp'),
      recommendedAction,
      manualReview: {
        decision: status === 'FAIL' ? 'ACCEPTED_VIOLATION' : 'PENDING',
        inspectorRemarks: '',
        reviewedBy: '',
        reviewedAt: '',
      },
    });
  }

  // 12. RULE 7 - Dimensions (Textiles / Soap / Specific commodities)
  const ruleDim = activeRules.find((r) => r.id === 'RULE_7_DIMENSIONS');
  if (ruleDim && ruleDim.enabled) {
    const isDimensionCommodity =
      product.category === 'Textiles & Apparel' ||
      product.commodityType?.toLowerCase().includes('sheet') ||
      product.commodityType?.toLowerCase().includes('cord') ||
      product.commodityType?.toLowerCase().includes('wire') ||
      product.commodityType?.toLowerCase().includes('soap');

    const hasDim = declarations.dimensions?.trim().length > 0;

    let status: CheckStatus = 'NOT_APPLICABLE';
    let explanation = `Commodity (${product.category}) is sold by weight/volume, dimension declaration is optional.`;
    let expectedCondition = 'Dimensions mandatory only for commodities sold by length/area/size.';
    let recommendedAction = 'No action needed.';

    if (isDimensionCommodity) {
      if (hasDim) {
        status = 'PASS';
        explanation = `Dimensions "${declarations.dimensions}" declared as required by Rule 7.`;
        recommendedAction = 'Compliant.';
      } else {
        status = 'WARNING';
        explanation = 'Dimension-specific commodity, but length/width/size specification was not detected.';
        expectedCondition = 'Textiles, sheets, and dimension-sensitive products must declare size.';
        recommendedAction = 'Verify package for dimension stamp.';
      }
    }

    findings.push({
      id: 'finding-dimensions',
      ruleId: ruleDim.id,
      ruleReference: ruleDim.ruleReference,
      actSection: ruleDim.actSection,
      ruleTitle: ruleDim.title,
      title: ruleDim.title,
      status,
      severity: ruleDim.severity || 'MINOR',
      extractedValue: declarations.dimensions || (isDimensionCommodity ? 'Missing' : 'N/A'),
      extractedEvidence: declarations.dimensions || (isDimensionCommodity ? 'Missing' : 'N/A'),
      expectedCondition,
      explanation,
      legalExplanation: explanation,
      applicabilityNote: isDimensionCommodity
        ? 'Mandatory for textiles, bedsheets, soap cakes, cords under Rule 7.'
        : 'Not applicable for weight/volume packaged goods.',
      confidence: 95,
      evidenceBox: getBox('dimension'),
      recommendedAction,
      manualReview: {
        decision: (status as string) === 'FAIL' ? 'ACCEPTED_VIOLATION' : 'PENDING',
        inspectorRemarks: '',
        reviewedBy: '',
        reviewedAt: '',
      },
    });
  }

  // Normalize findings to ensure ruleTitle, legalExplanation, extractedEvidence are always present
  const normalizedFindings: ComplianceFinding[] = findings.map((f) => ({
    ...f,
    ruleTitle: f.ruleTitle || f.title || 'Statutory Declaration Rule',
    title: f.title || f.ruleTitle || 'Statutory Declaration Rule',
    legalExplanation: f.legalExplanation || f.explanation || '',
    explanation: f.explanation || f.legalExplanation || '',
    extractedEvidence: f.extractedEvidence || f.extractedValue || '',
    extractedValue: f.extractedValue || f.extractedEvidence || '',
  }));

  // Calculate Overall Compliance Score
  const applicableFindings = normalizedFindings.filter((f) => f.status !== 'NOT_APPLICABLE');
  const total = applicableFindings.length;
  const passed = applicableFindings.filter((f) => f.status === 'PASS').length;
  const warnings = applicableFindings.filter((f) => f.status === 'WARNING').length;
  const fails = applicableFindings.filter((f) => f.status === 'FAIL').length;
  const needsReview = applicableFindings.filter((f) => f.status === 'NEEDS_MANUAL_REVIEW').length;

  // Score formula: 100 * (passed + 0.6 * warnings + 0.5 * needsReview) / total
  const score = total > 0 ? Math.round(((passed + warnings * 0.6 + needsReview * 0.5) / total) * 100) : 100;

  let overallStatus: 'COMPLIANT' | 'POTENTIAL_NON_COMPLIANCE' | 'NEEDS_REVIEW' = 'COMPLIANT';
  if (fails > 0) {
    overallStatus = 'POTENTIAL_NON_COMPLIANCE';
  } else if (warnings > 0 || needsReview > 0 || score < 85) {
    overallStatus = 'NEEDS_REVIEW';
  }

  return {
    findings: normalizedFindings,
    score,
    complianceScore: score,
    overallStatus,
    summary: `${passed} of ${total} rules passed (${score}% compliance). ${fails} potential statutory non-compliances identified.`,
  };
}
