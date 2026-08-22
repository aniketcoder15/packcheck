import {
  InspectionRecord,
  LegalMetrologyRule,
  User,
  AuditLogEntry,
  ProductHistorySummary,
} from '../types';
import { DEFAULT_RULES } from './rulesEngine';
import { DEMO_USERS, getInitialSeedInspections } from './sampleData';

const KEYS = {
  INSPECTIONS: 'packcheck_inspections_v1',
  USERS: 'packcheck_users_v1',
  RULES: 'packcheck_rules_v1',
  AUTH_USER: 'packcheck_current_user_v1',
  AUDIT_LOGS: 'packcheck_audit_logs_v1',
};

// Listeners for reactive updates
type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((l) => {
    try {
      l();
    } catch (e) {
      console.error('Store subscriber error', e);
    }
  });
}

// Storage helpers with safe parsing and initial seeds
export const StorageRepository = {
  // --- AUTHENTICATION ---
  getCurrentUser(): User {
    try {
      const stored = localStorage.getItem(KEYS.AUTH_USER);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && parsed.id) {
          return {
            ...DEMO_USERS[0],
            ...parsed,
            name: parsed.name || 'Rahul Sharma',
            jurisdictionZone: parsed.jurisdictionZone || parsed.zone || 'Delhi, North Zone',
            role: parsed.role || 'inspector',
            designation: parsed.designation || 'Legal Metrology Inspector',
            badgeNumber: parsed.badgeNumber || 'LM-DL-2024-883',
          };
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Default to Inspector Rahul Sharma
    const defaultUser = DEMO_USERS[0];
    this.setCurrentUser(defaultUser);
    return defaultUser;
  },

  setCurrentUser(user: User | null) {
    if (user) {
      const sanitized: User = {
        ...user,
        name: user.name || 'Rahul Sharma',
        jurisdictionZone: user.jurisdictionZone || user.zone || 'Delhi, North Zone',
      };
      localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(sanitized));
    } else {
      localStorage.removeItem(KEYS.AUTH_USER);
    }
    notifyListeners();
  },

  // --- USERS ---
  getUsers(): User[] {
    try {
      const stored = localStorage.getItem(KEYS.USERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u: any) => ({
            ...u,
            name: u.name || 'Officer',
            jurisdictionZone: u.jurisdictionZone || u.zone || 'Central Zone',
            isActive: u.isActive !== undefined ? u.isActive : u.active !== undefined ? u.active : true,
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(DEMO_USERS));
    return DEMO_USERS;
  },

  saveUser(user: User) {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    this.logAudit(
      user.name,
      'Admin',
      'USER_SAVED',
      `User ${user.name} (${user.role}) was updated/created`
    );
    notifyListeners();
  },

  deleteUser(userId: string) {
    const users = this.getUsers().filter((u) => u.id !== userId);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    notifyListeners();
  },

  // --- RULES ---
  getRules(): LegalMetrologyRule[] {
    try {
      const stored = localStorage.getItem(KEYS.RULES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(KEYS.RULES, JSON.stringify(DEFAULT_RULES));
    return DEFAULT_RULES;
  },

  saveRule(rule: LegalMetrologyRule) {
    const rules = this.getRules();
    const idx = rules.findIndex((r) => r.id === rule.id);
    if (idx >= 0) {
      rules[idx] = { ...rule, lastUpdated: new Date().toISOString().split('T')[0] };
    } else {
      rules.push(rule);
    }
    localStorage.setItem(KEYS.RULES, JSON.stringify(rules));
    this.logAudit(
      'Admin',
      'Administrator',
      'RULE_MODIFIED',
      `Rule ${rule.ruleReference} (${rule.title}) updated. Enabled: ${rule.enabled}`
    );
    notifyListeners();
  },

  resetRulesToDefault() {
    localStorage.setItem(KEYS.RULES, JSON.stringify(DEFAULT_RULES));
    notifyListeners();
  },

  // --- INSPECTIONS ---
  getInspections(): InspectionRecord[] {
    try {
      const stored = localStorage.getItem(KEYS.INSPECTIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    const seeds = getInitialSeedInspections();
    localStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(seeds));
    return seeds;
  },

  getInspectionById(id: string): InspectionRecord | undefined {
    const inspections = this.getInspections();
    return inspections.find((i) => i.id === id);
  },

  saveInspection(inspection: InspectionRecord) {
    const inspections = this.getInspections();
    const now = new Date().toISOString();
    const recordToSave: InspectionRecord = {
      ...inspection,
      updatedAt: now,
    };

    const idx = inspections.findIndex((i) => i.id === inspection.id);
    if (idx >= 0) {
      inspections[idx] = recordToSave;
    } else {
      inspections.unshift(recordToSave);
    }

    localStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(inspections));
    this.logAudit(
      inspection.product.inspectorName || 'Inspector',
      'Inspector',
      'SAVED_INSPECTION',
      `Inspection ${inspection.referenceNumber} for ${inspection.product.productName} saved (${inspection.overallStatus}, Score: ${inspection.complianceScore}%)`
    );
    notifyListeners();
    return recordToSave;
  },

  deleteInspection(id: string) {
    const inspections = this.getInspections();
    const target = inspections.find((i) => i.id === id);
    const updated = inspections.filter((i) => i.id !== id);
    localStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(updated));
    if (target) {
      this.logAudit(
        'User',
        'Inspector',
        'DELETED_INSPECTION',
        `Inspection ${target.referenceNumber} (${target.product.productName}) was deleted.`
      );
    }
    notifyListeners();
  },

  duplicateInspection(id: string): InspectionRecord | null {
    const orig = this.getInspectionById(id);
    if (!orig) return null;

    const newId = `insp-${Date.now()}`;
    const newRef = `INSP/2026/NZ/${Math.floor(1000 + Math.random() * 9000)}`;
    const copy: InspectionRecord = {
      ...orig,
      id: newId,
      referenceNumber: newRef,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      finalizedAt: undefined,
      verifiedBy: undefined,
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: this.getCurrentUser().name,
          role: this.getCurrentUser().role,
          action: 'DUPLICATED_INSPECTION',
          details: `Duplicated from inspection ${orig.referenceNumber}`,
        },
      ],
    };

    this.saveInspection(copy);
    return copy;
  },

  resetDemoData() {
    localStorage.removeItem(KEYS.INSPECTIONS);
    localStorage.removeItem(KEYS.RULES);
    localStorage.removeItem(KEYS.USERS);
    const seeds = getInitialSeedInspections();
    localStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(seeds));
    localStorage.setItem(KEYS.RULES, JSON.stringify(DEFAULT_RULES));
    localStorage.setItem(KEYS.USERS, JSON.stringify(DEMO_USERS));
    notifyListeners();
  },

  // --- PRODUCT HISTORY ---
  getProductHistories(): ProductHistorySummary[] {
    const inspections = this.getInspections();
    const map = new Map<string, InspectionRecord[]>();

    inspections.forEach((insp) => {
      const key = `${insp.product.brand.toLowerCase()}-${insp.product.productName.toLowerCase()}`;
      const list = map.get(key) || [];
      list.push(insp);
      map.set(key, list);
    });

    const summaries: ProductHistorySummary[] = [];

    map.forEach((list) => {
      // Sort by newest
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const latest = list[0];
      const avg = Math.round(list.reduce((acc, curr) => acc + curr.complianceScore, 0) / list.length);

      summaries.push({
        brand: latest.product.brand,
        productName: latest.product.productName,
        category: latest.product.category,
        barcode: latest.product.barcode,
        totalInspections: list.length,
        averageScore: avg,
        lastInspected: latest.createdAt,
        latestStatus: latest.overallStatus,
        inspections: list,
      });
    });

    return summaries;
  },

  // --- AUDIT LOGS ---
  getAuditLogs(): AuditLogEntry[] {
    try {
      const stored = localStorage.getItem(KEYS.AUDIT_LOGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  logAudit(actor: string, role: string, action: string, details: string) {
    const logs = this.getAuditLogs();
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor,
      role,
      action,
      details,
    };
    logs.unshift(entry);
    // Keep last 150 entries
    const trimmed = logs.slice(0, 150);
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(trimmed));
  },
};
