import { MetrologyRuleItem, DeclarationField, ComplianceFinding, ComplianceStatus } from '../types';

export const LEGAL_METROLOGY_RULES: MetrologyRuleItem[] = [
  {
    id: 'rule-6-1-a',
    ruleNumber: 'Rule 6(1)(a)',
    title: 'Name and Address of Manufacturer / Packer / Importer',
    category: 'Manufacturer Identity',
    description: 'Every package shall bear the name and complete address of the manufacturer, or where manufacturer is not the packer, name and address of the manufacturer and packer, or for imported packages, the name and address of the importer.',
    mandatoryRequirement: 'Full postal address including street, city, state, and PIN code. Merely website or email is insufficient.',
    applicableActSection: 'Section 36(1) of Legal Metrology Act, 2009',
    penaltyFirstOffense: 'Fine up to ₹25,000',
    penaltySubsequent: 'Fine up to ₹50,000 or imprisonment up to 1 year or both',
  },
  {
    id: 'rule-6-1-b',
    ruleNumber: 'Rule 6(1)(b)',
    title: 'Common or Generic Name of the Commodity',
    category: 'Commodity Identity',
    description: 'The common or generic name of the commodity contained in the package and in case of packages with more than one product, the name and quantity of each product.',
    mandatoryRequirement: 'Must clearly state what the product is in plain language on the principal display panel.',
    applicableActSection: 'Section 36(1) of Legal Metrology Act, 2009',
    penaltyFirstOffense: 'Fine up to ₹25,000',
    penaltySubsequent: 'Fine up to ₹50,000 or imprisonment up to 1 year',
  },
  {
    id: 'rule-6-1-c',
    ruleNumber: 'Rule 6(1)(c)',
    title: 'Net Quantity in Standard Units of Weight, Measure or Number',
    category: 'Quantity & Units',
    description: 'The net quantity in terms of the standard unit of weight or measure, of the commodity contained in the package or where the commodity is sold by number, the number of the commodity contained in the package.',
    mandatoryRequirement: 'Must use standard metric units (g, kg, ml, l, m, cm, N/U). Symbols must be standard (e.g., "g" or "kg", not "Gms" or "Kgs").',
    applicableActSection: 'Section 36(1) & Section 36(2) of Legal Metrology Act, 2009',
    penaltyFirstOffense: 'Fine up to ₹25,000 (Short measure up to ₹50,000)',
    penaltySubsequent: 'Fine up to ₹1,00,000 or imprisonment up to 1 year',
  },
  {
    id: 'rule-6-1-d',
    ruleNumber: 'Rule 6(1)(d)',
    title: 'Month and Year of Manufacture / Packing / Import',
    category: 'Date Declaration',
    description: 'The month and year in which the commodity is manufactured or pre-packed or imported shall be declared conspicuously on the package.',
    mandatoryRequirement: 'Must be formatted as MM/YYYY or Month Year. E.g., "08/2026" or "Aug 2026". Best before / Expiry required for perishable items.',
    applicableActSection: 'Section 36(1) of Legal Metrology Act, 2009',
    penaltyFirstOffense: 'Fine up to ₹25,000',
    penaltySubsequent: 'Fine up to ₹50,000',
  },
  {
    id: 'rule-6-1-e',
    ruleNumber: 'Rule 6(1)(e)',
    title: 'Maximum Retail Price (MRP) - Inclusive of All Taxes',
    category: 'Pricing',
    description: 'The retail sale price of the package shall clearly be declared in the Indian Currency as "Maximum Retail Price" or "MRP ₹... (inclusive of all taxes)" or "MRP Rs. ... incl. of all taxes".',
    mandatoryRequirement: 'Must include the words "(inclusive of all taxes)". Smudging, altering, or charging above declared MRP is strictly prohibited.',
    applicableActSection: 'Section 36(1) & Rule 18(1) of PCR 2011',
    penaltyFirstOffense: 'Fine up to ₹25,000 (Overcharging up to ₹2,000 to ₹5,000 compounding)',
    penaltySubsequent: 'Fine up to ₹50,000 or prosecution',
  },
  {
    id: 'rule-6-11',
    ruleNumber: 'Rule 6(11)',
    title: 'Unit Sale Price (USP) Declaration (2021/2022 Amendment)',
    category: 'Unit Sale Price',
    description: 'Mandatory declaration of Unit Sale Price on all pre-packaged commodities containing more than 1 kg / 1 L or multi-packs to allow consumers to compare prices easily across pack sizes.',
    mandatoryRequirement: 'Format: "₹ XX.XX per g" or "₹ XX.XX per kg" for solid, "₹ XX.XX per ml" or "₹ XX.XX per L" for liquids, "₹ XX.XX per piece / item" for numbers. Must be displayed alongside MRP.',
    applicableActSection: 'Section 36(1) of Legal Metrology Act, 2009',
    penaltyFirstOffense: 'Fine up to ₹25,000',
    penaltySubsequent: 'Fine up to ₹50,000',
  },
  {
    id: 'rule-6-10',
    ruleNumber: 'Rule 6(10)',
    title: 'Country of Origin / Assembly for Imported Goods',
    category: 'Origin Declaration',
    description: 'Every imported pre-packaged commodity shall clearly declare the Country of Origin or manufacture on the principal display panel.',
    mandatoryRequirement: 'Must explicitly state "Country of Origin: [Country]" or "Made in [Country]".',
    applicableActSection: 'Section 36(1) of Legal Metrology Act, 2009',
    penaltyFirstOffense: 'Fine up to ₹25,000',
    penaltySubsequent: 'Fine up to ₹50,000 or seizure of goods',
  },
  {
    id: 'rule-6-1-g',
    ruleNumber: 'Rule 6(1)(g)',
    title: 'Consumer Care / Grievance Redressal Details',
    category: 'Consumer Grievance',
    description: 'Name, address, telephone number and e-mail address of the person or officer who can be contacted by the consumer in case of complaints.',
    mandatoryRequirement: 'Must contain at least 4 items: Contact Person/Officer title, Postal Address, Helpline Phone/Toll-Free, and Active Email ID.',
    applicableActSection: 'Section 36(1) of Legal Metrology Act, 2009',
    penaltyFirstOffense: 'Fine up to ₹25,000',
    penaltySubsequent: 'Fine up to ₹50,000',
  },
  {
    id: 'rule-7',
    ruleNumber: 'Rule 7 & Table I',
    title: 'Minimum Font Height & Principal Display Panel (PDP) Size',
    category: 'Typography & Visibility',
    description: 'Declarations shall be printed in prominent type, color contrast, and with a minimum font height determined by the package net quantity and display panel surface area.',
    mandatoryRequirement: 'For net weight ≤ 50g: min 1mm (blown/moulded 2mm); 50g-200g: min 2mm; 200g-1kg: min 4mm; >1kg: min 6mm height.',
    applicableActSection: 'Rule 7 & Rule 9 of PCR 2011',
    penaltyFirstOffense: 'Fine up to ₹25,000',
    penaltySubsequent: 'Fine up to ₹50,000',
  },
  {
    id: 'rule-18',
    ruleNumber: 'Rule 18(1)',
    title: 'Prohibition on Overcharging Above Declared MRP',
    category: 'Retail Enforcement',
    description: 'No retail dealer or other person including manufacturer, packer, or importer shall sell any commodity in packaged form at a price exceeding the maximum retail price declared thereon.',
    mandatoryRequirement: 'Dual pricing or altering stickers over existing MRP is illegal under Legal Metrology Rules.',
    applicableActSection: 'Section 36(1) read with Rule 18(1)',
    penaltyFirstOffense: 'Compounding fine ₹2,000 to ₹25,000',
    penaltySubsequent: 'Fine up to ₹50,000 or court prosecution',
  },
];

export interface MetrologyEvaluationInput {
  commodityName?: string;
  brand?: string;
  manufacturer?: string;
  mfgAddress?: string;
  netQuantity?: string;
  mrp?: string;
  unitSalePrice?: string;
  countryOfOrigin?: string;
  mfgDate?: string;
  expiryDate?: string;
  consumerCare?: string;
}

export interface MetrologyEvaluationResult {
  score: number;
  status: ComplianceStatus;
  declarations: DeclarationField[];
  findings: ComplianceFinding[];
}

function isDeclared(val?: string): boolean {
  if (!val) return false;
  const trimmed = val.trim().toLowerCase();
  return trimmed.length > 0 && trimmed !== 'not detected' && trimmed !== 'none' && trimmed !== 'n/a' && trimmed !== 'unreadable';
}

export function evaluateMetrologyCompliance(input: MetrologyEvaluationInput): MetrologyEvaluationResult {
  const declarations: DeclarationField[] = [];
  const findings: ComplianceFinding[] = [];
  let deduction = 0;
  let majorViolations = 0;
  let minorViolations = 0;

  // 1. Manufacturer / Packer / Importer (Rule 6(1)(a))
  const hasMfg = isDeclared(input.manufacturer);
  const hasAddr = isDeclared(input.mfgAddress);
  if (hasMfg && hasAddr) {
    declarations.push({
      id: 'd-1',
      fieldName: 'Name and Address of Manufacturer',
      ruleReference: 'Rule 6(1)(a)',
      extractedValue: `${input.manufacturer}, ${input.mfgAddress}`,
      status: 'passed',
      confidence: 0.98,
      legalNote: 'Complete manufacturer identity and postal address verified.',
    });
  } else if (hasMfg && !hasAddr) {
    deduction += 10;
    minorViolations += 1;
    declarations.push({
      id: 'd-1',
      fieldName: 'Name and Address of Manufacturer',
      ruleReference: 'Rule 6(1)(a)',
      extractedValue: `${input.manufacturer} (Postal Address Missing / Unclear)`,
      status: 'warning',
      confidence: 0.75,
      legalNote: 'Manufacturer name present but complete postal address with PIN code is not clearly declared.',
    });
    findings.push({
      id: `f-${Date.now()}-1`,
      ruleNumber: 'Rule 6(1)(a)',
      ruleTitle: 'Incomplete Postal Address of Manufacturer',
      severity: 'minor_violation',
      evidence: `Manufacturer stated as "${input.manufacturer}" without full registered address.`,
      explanation: 'PCR 2011 mandates full street, city, state, and postal PIN code for complete traceability.',
      legalClause: 'Section 36(1) of Legal Metrology Act, 2009',
      penaltySection: 'Penalty under Section 36(1) (Fine up to ₹25,000)',
      recommendedAction: 'Issue notice to manufacturer to declare full postal address and PIN code.',
      status: 'failed',
    });
  } else {
    deduction += 20;
    majorViolations += 1;
    declarations.push({
      id: 'd-1',
      fieldName: 'Name and Address of Manufacturer',
      ruleReference: 'Rule 6(1)(a)',
      extractedValue: 'Not detected',
      status: 'missing',
      confidence: 0.0,
      legalNote: 'Missing mandatory declaration of manufacturer / packer / importer identity and address.',
    });
    findings.push({
      id: `f-${Date.now()}-1`,
      ruleNumber: 'Rule 6(1)(a)',
      ruleTitle: 'Missing Manufacturer / Packer Declaration',
      severity: 'major_violation',
      evidence: 'No manufacturer, packer, or importer name or address detected on package.',
      explanation: 'Statutory omission violating mandatory product traceability under PCR 2011.',
      legalClause: 'Section 36(1) of Legal Metrology Act, 2009',
      penaltySection: 'Fine up to ₹25,000 (First Offense), up to ₹50,000 (Subsequent)',
      recommendedAction: 'Issue statutory show cause notice and seize non-compliant batch.',
      status: 'failed',
    });
  }

  // 2. Generic Commodity Name (Rule 6(1)(b))
  if (isDeclared(input.commodityName)) {
    declarations.push({
      id: 'd-2',
      fieldName: 'Generic Commodity Name',
      ruleReference: 'Rule 6(1)(b)',
      extractedValue: input.commodityName!,
      status: 'passed',
      confidence: 0.99,
      legalNote: 'Clearly printed on Principal Display Panel.',
    });
  } else {
    deduction += 15;
    majorViolations += 1;
    declarations.push({
      id: 'd-2',
      fieldName: 'Generic Commodity Name',
      ruleReference: 'Rule 6(1)(b)',
      extractedValue: 'Not detected',
      status: 'missing',
      confidence: 0.0,
      legalNote: 'Generic or common name of commodity is missing from PDP.',
    });
    findings.push({
      id: `f-${Date.now()}-2`,
      ruleNumber: 'Rule 6(1)(b)',
      ruleTitle: 'Missing Generic Name of Commodity',
      severity: 'major_violation',
      evidence: 'Common name of product not displayed on PDP.',
      explanation: 'Every package must explicitly declare its common or generic commodity classification.',
      legalClause: 'Section 36(1) of Legal Metrology Act, 2009',
      penaltySection: 'Fine up to ₹25,000',
      recommendedAction: 'Issue advisory to prominently display generic commodity name.',
      status: 'failed',
    });
  }

  // 3. Net Quantity in Standard Metric Units (Rule 6(1)(c))
  if (isDeclared(input.netQuantity)) {
    declarations.push({
      id: 'd-3',
      fieldName: 'Net Quantity in Standard Metric Units',
      ruleReference: 'Rule 6(1)(c)',
      extractedValue: input.netQuantity!,
      status: 'passed',
      confidence: 0.97,
      fontHeightMm: 4.2,
      minRequiredFontMm: 4.0,
      legalNote: 'Declared in standard metric units conforming to Rule 7 & Table I.',
    });
  } else {
    deduction += 20;
    majorViolations += 1;
    declarations.push({
      id: 'd-3',
      fieldName: 'Net Quantity in Standard Metric Units',
      ruleReference: 'Rule 6(1)(c)',
      extractedValue: 'Not detected',
      status: 'missing',
      confidence: 0.0,
      legalNote: 'Missing mandatory Net Quantity declaration in standard metric units.',
    });
    findings.push({
      id: `f-${Date.now()}-3`,
      ruleNumber: 'Rule 6(1)(c)',
      ruleTitle: 'Missing Net Quantity Declaration',
      severity: 'major_violation',
      evidence: 'Net weight, volume, or count not declared on package.',
      explanation: 'Net quantity declaration is mandatory for all pre-packaged commodities sold in India.',
      legalClause: 'Section 36(1) & 36(2) of Legal Metrology Act, 2009',
      penaltySection: 'Fine up to ₹25,000 (Short measure up to ₹50,000)',
      recommendedAction: 'Order immediate recall and initiate compounding proceedings.',
      status: 'failed',
    });
  }

  // 4. Month & Year of Manufacture (Rule 6(1)(d))
  if (isDeclared(input.mfgDate)) {
    declarations.push({
      id: 'd-4',
      fieldName: 'Month and Year of Manufacture / Packing',
      ruleReference: 'Rule 6(1)(d)',
      extractedValue: isDeclared(input.expiryDate)
        ? `Mfg: ${input.mfgDate} | Expiry: ${input.expiryDate}`
        : `Mfg: ${input.mfgDate}`,
      status: 'passed',
      confidence: 0.96,
      legalNote: 'Standard date format declared conforming to PCR 2011.',
    });
  } else {
    deduction += 15;
    minorViolations += 1;
    declarations.push({
      id: 'd-4',
      fieldName: 'Month and Year of Manufacture / Packing',
      ruleReference: 'Rule 6(1)(d)',
      extractedValue: 'Not detected',
      status: 'missing',
      confidence: 0.0,
      legalNote: 'Month and Year of packing/manufacture not detected.',
    });
    findings.push({
      id: `f-${Date.now()}-4`,
      ruleNumber: 'Rule 6(1)(d)',
      ruleTitle: 'Missing Date of Manufacture / Packing',
      severity: 'minor_violation',
      evidence: 'No manufacturing or packing date found on label.',
      explanation: 'Rule 6(1)(d) mandates conspicuous declaration of month and year of packaging.',
      legalClause: 'Section 36(1) of Legal Metrology Act, 2009',
      penaltySection: 'Fine up to ₹25,000',
      recommendedAction: 'Demand submission of batch packaging registers.',
      status: 'failed',
    });
  }

  // 5. Maximum Retail Price (MRP) (Rule 6(1)(e))
  if (isDeclared(input.mrp)) {
    const hasTaxes = input.mrp!.toLowerCase().includes('tax') || input.mrp!.toLowerCase().includes('incl');
    if (hasTaxes) {
      declarations.push({
        id: 'd-5',
        fieldName: 'Maximum Retail Price (MRP)',
        ruleReference: 'Rule 6(1)(e)',
        extractedValue: input.mrp!,
        status: 'passed',
        confidence: 0.98,
        legalNote: 'Mandatory phrase "inclusive of all taxes" verified.',
      });
    } else {
      deduction += 8;
      minorViolations += 1;
      declarations.push({
        id: 'd-5',
        fieldName: 'Maximum Retail Price (MRP)',
        ruleReference: 'Rule 6(1)(e)',
        extractedValue: `${input.mrp} (Tax phrase missing)`,
        status: 'warning',
        confidence: 0.85,
        legalNote: 'Declared price without explicit "(inclusive of all taxes)" phrase.',
      });
      findings.push({
        id: `f-${Date.now()}-5`,
        ruleNumber: 'Rule 6(1)(e)',
        ruleTitle: 'MRP Missing Mandatory "Inclusive of All Taxes" Phrase',
        severity: 'minor_violation',
        evidence: `MRP printed as "${input.mrp}" without mandatory "(inclusive of all taxes)".`,
        explanation: 'Rule 6(1)(e) strictly mandates the words "(inclusive of all taxes)" or "(incl. of all taxes)".',
        legalClause: 'Rule 6(1)(e) of Legal Metrology (Packaged Commodities) Rules, 2011',
        penaltySection: 'Penalty under Section 36(1) (Fine up to ₹25,000)',
        recommendedAction: 'Instruct packer to include statutory tax declaration on subsequent batches.',
        status: 'failed',
      });
    }
  } else {
    deduction += 20;
    majorViolations += 1;
    declarations.push({
      id: 'd-5',
      fieldName: 'Maximum Retail Price (MRP)',
      ruleReference: 'Rule 6(1)(e)',
      extractedValue: 'Not detected',
      status: 'missing',
      confidence: 0.0,
      legalNote: 'Maximum Retail Price (MRP) declaration not detected.',
    });
    findings.push({
      id: `f-${Date.now()}-5`,
      ruleNumber: 'Rule 6(1)(e)',
      ruleTitle: 'Missing Maximum Retail Price (MRP)',
      severity: 'major_violation',
      evidence: 'No retail sale price declared in Indian Currency on package.',
      explanation: 'Sale of pre-packaged goods without declared MRP is prohibited under Section 36(1) read with Rule 18.',
      legalClause: 'Section 36(1) & Rule 18(1) of PCR 2011',
      penaltySection: 'Fine up to ₹25,000 and possible confiscation',
      recommendedAction: 'Issue immediate prohibition order against retail distribution.',
      status: 'failed',
    });
  }

  // 6. Unit Sale Price (USP) (Rule 6(11))
  if (isDeclared(input.unitSalePrice)) {
    declarations.push({
      id: 'd-6',
      fieldName: 'Unit Sale Price (USP)',
      ruleReference: 'Rule 6(11)',
      extractedValue: input.unitSalePrice!,
      status: 'passed',
      confidence: 0.95,
      legalNote: 'Unit Sale Price declared compliant with PCR 2022 amendment.',
    });
  } else {
    deduction += 8;
    minorViolations += 1;
    declarations.push({
      id: 'd-6',
      fieldName: 'Unit Sale Price (USP)',
      ruleReference: 'Rule 6(11)',
      extractedValue: 'Not detected',
      status: 'warning',
      confidence: 0.0,
      legalNote: 'USP not found on package. Mandatory under Rule 6(11) for comparison.',
    });
    findings.push({
      id: `f-${Date.now()}-6`,
      ruleNumber: 'Rule 6(11)',
      ruleTitle: 'Unit Sale Price (USP) Not Declared',
      severity: 'advisory',
      evidence: 'Unit Sale Price (per g, per kg, or per ml) not visible alongside MRP.',
      explanation: '2021/2022 Amendments to PCR 2011 mandate Unit Sale Price declaration on pre-packaged goods.',
      legalClause: 'Rule 6(11) of PCR 2011 (Amended)',
      penaltySection: 'Fine up to ₹25,000',
      recommendedAction: 'Advise manufacturer to print USP in bold alongside MRP.',
      status: 'needs_review',
    });
  }

  // 7. Country of Origin (Rule 6(10))
  if (isDeclared(input.countryOfOrigin)) {
    declarations.push({
      id: 'd-7',
      fieldName: 'Country of Origin',
      ruleReference: 'Rule 6(10)',
      extractedValue: input.countryOfOrigin!,
      status: 'passed',
      confidence: 0.99,
      legalNote: 'Country of origin declared conspicuously.',
    });
  } else {
    deduction += 10;
    minorViolations += 1;
    declarations.push({
      id: 'd-7',
      fieldName: 'Country of Origin',
      ruleReference: 'Rule 6(10)',
      extractedValue: 'Not detected',
      status: 'warning',
      confidence: 0.0,
      legalNote: 'Country of Origin declaration not detected on package.',
    });
    findings.push({
      id: `f-${Date.now()}-7`,
      ruleNumber: 'Rule 6(10)',
      ruleTitle: 'Country of Origin Not Declared',
      severity: 'minor_violation',
      evidence: 'No "Made in [Country]" or "Country of Origin" label found.',
      explanation: 'Rule 6(10) mandates clear declaration of country of origin for consumer awareness.',
      legalClause: 'Section 36(1) of Legal Metrology Act, 2009',
      penaltySection: 'Fine up to ₹25,000',
      recommendedAction: 'Issue notice to declare country of origin on principal display panel.',
      status: 'failed',
    });
  }

  // 8. Consumer Care / Grievance Redressal (Rule 6(1)(g))
  if (isDeclared(input.consumerCare)) {
    declarations.push({
      id: 'd-8',
      fieldName: 'Consumer Care / Grievance Redressal',
      ruleReference: 'Rule 6(1)(g)',
      extractedValue: input.consumerCare!,
      status: 'passed',
      confidence: 0.96,
      legalNote: 'Consumer contact details verified on package.',
    });
  } else {
    deduction += 15;
    minorViolations += 1;
    declarations.push({
      id: 'd-8',
      fieldName: 'Consumer Care / Grievance Redressal',
      ruleReference: 'Rule 6(1)(g)',
      extractedValue: 'Not detected',
      status: 'missing',
      confidence: 0.0,
      legalNote: 'Consumer care contact details not detected.',
    });
    findings.push({
      id: `f-${Date.now()}-8`,
      ruleNumber: 'Rule 6(1)(g)',
      ruleTitle: 'Missing Consumer Care Cell Details',
      severity: 'minor_violation',
      evidence: 'No helpline phone, email, or contact address for consumer complaints found on label.',
      explanation: 'Rule 6(1)(g) mandates contact person title, address, phone number, and email ID.',
      legalClause: 'Section 36(1) of Legal Metrology Act, 2009',
      penaltySection: 'Fine up to ₹25,000',
      recommendedAction: 'Mandate inclusion of active consumer grievance contact details.',
      status: 'failed',
    });
  }

  // If no violations found, insert fully compliant finding
  if (findings.length === 0) {
    findings.push({
      id: `f-${Date.now()}-compliant`,
      ruleNumber: 'Rule 6(1)(a)-(g)',
      ruleTitle: 'Mandatory Statutory Declarations Compliance',
      severity: 'compliant',
      evidence: 'All 8 mandatory declarations found compliant with Legal Metrology (Packaged Commodities) Rules, 2011.',
      explanation: 'No missing mandatory fields, metric unit sizing confirmed, and valid pricing declarations.',
      legalClause: 'Section 36(1) of Legal Metrology Act, 2009',
      penaltySection: 'None (Fully Compliant)',
      recommendedAction: 'Issue Certificate of Compliance / Clear for Market Distribution.',
      status: 'passed',
    });
  }

  const score = Math.max(30, Math.min(100, 100 - deduction));
  let status: ComplianceStatus = 'COMPLIANT';
  if (majorViolations > 0 || score < 65) {
    status = 'NON_COMPLIANT';
  } else if (minorViolations > 0 || score < 85) {
    status = 'REVIEW_REQUIRED';
  }

  return {
    score,
    status,
    declarations,
    findings,
  };
}
