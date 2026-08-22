import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { NewInspectionView } from './components/NewInspectionView';
import { ExtractionReviewView } from './components/ExtractionReviewView';
import { ResultsView } from './components/ResultsView';
import { ReportView } from './components/ReportView';
import { InspectionHistoryView } from './components/InspectionHistoryView';
import { ProductHistoryView } from './components/ProductHistoryView';
import { RuleManagementView } from './components/RuleManagementView';
import { AdminUsersView } from './components/AdminUsersView';
import { ToastProvider, useToast } from './components/Toast';
import {
  ExtractedDeclarations,
  InspectionRecord,
  ProductDetails,
  User,
} from './types';
import { StorageRepository, subscribeToStore } from './utils/storage';
import { runComplianceAudit } from './utils/rulesEngine';
import { DEMO_PRESETS } from './utils/sampleData';

function MainApp() {
  const { showToast } = useToast();

  // Storage & Reactive State
  const [currentUser, setCurrentUser] = useState<User>(StorageRepository.getCurrentUser());
  const [inspections, setInspections] = useState<InspectionRecord[]>(StorageRepository.getInspections());
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Active Working Inspection Flow State
  const [activeProduct, setActiveProduct] = useState<ProductDetails | null>(null);
  const [activeDeclarations, setActiveDeclarations] = useState<ExtractedDeclarations | null>(null);
  const [activeInspection, setActiveInspection] = useState<InspectionRecord | null>(null);

  // Subscribe to persistent storage events
  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      setInspections(StorageRepository.getInspections());
      setCurrentUser(StorageRepository.getCurrentUser());
    });
    return unsubscribe;
  }, []);

  // Handlers for Navigation & Workflow
  const handleSelectUser = (user: User) => {
    StorageRepository.setCurrentUser(user);
    setCurrentUser(user);
  };

  const handleStartNewInspection = () => {
    setActiveProduct(null);
    setActiveDeclarations(null);
    setActiveInspection(null);
    setActiveView('new-inspection');
    setMobileMenuOpen(false);
  };

  const handleAnalysisComplete = (product: ProductDetails, extracted: ExtractedDeclarations) => {
    setActiveProduct(product);
    setActiveDeclarations(extracted);
    setActiveView('extraction-review');
  };

  const handleProceedToAudit = (verifiedDeclarations: ExtractedDeclarations) => {
    if (!activeProduct) return;

    const activeRules = StorageRepository.getRules();
    const result = runComplianceAudit(activeProduct, verifiedDeclarations, activeRules);

    const newRecord: InspectionRecord = {
      id: `insp-${Date.now()}`,
      referenceNumber: `INSP/2026/NZ/${Math.floor(1000 + Math.random() * 9000)}`,
      product: activeProduct,
      rawExtractedDeclarations: activeDeclarations || verifiedDeclarations,
      verifiedDeclarations,
      findings: result.findings,
      overallStatus: result.overallStatus,
      complianceScore: result.complianceScore,
      summary: result.summary,
      inspectorRemarks: `Inspected by ${currentUser?.name || 'Officer'} (${currentUser?.designation || 'Inspector'}). Declarations evaluated against Legal Metrology Rules 2011.`,
      status: 'REVIEWED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: currentUser?.name || 'Authorized Officer',
          role: currentUser?.role || 'inspector',
          action: 'CREATED_INSPECTION',
          details: `Analyzed package and generated ${result.findings.length} statutory rule audits.`,
        },
      ],
    };

    StorageRepository.saveInspection(newRecord);
    setActiveInspection(newRecord);
    setActiveDeclarations(verifiedDeclarations);
    setActiveView('results');

    showToast({
      type: 'success',
      title: 'Compliance Evaluation Ready',
      message: `Score: ${result.complianceScore}% (${result.overallStatus})`,
    });
  };

  const handleViewInspection = (inspection: InspectionRecord) => {
    setActiveInspection(inspection);
    setActiveProduct(inspection.product);
    setActiveDeclarations(inspection.verifiedDeclarations);
    setActiveView('results');
    setMobileMenuOpen(false);
  };

  const handleGenerateReport = (inspection?: InspectionRecord) => {
    if (inspection) {
      setActiveInspection(inspection);
    }
    setActiveView('report');
    setMobileMenuOpen(false);
  };

  // Instant Load Preset Flow
  const handleLoadPreset = (presetId: string) => {
    const preset = DEMO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const sampleProduct: ProductDetails = {
      ...preset.productDetails,
      inspectorName: currentUser.name,
      inspectorId: currentUser.badgeNumber,
      images: [
        {
          id: `img-${preset.id}`,
          url: preset.imageSvg,
          name: `${preset.brand.toLowerCase()}_sample_pack.svg`,
          sizeBytes: 150000,
          type: 'image/svg+xml',
          uploadedAt: new Date().toISOString(),
          panelType: 'front',
        },
      ],
    };

    setActiveProduct(sampleProduct);
    setActiveDeclarations(preset.declarations);
    setActiveView('extraction-review');
    setMobileMenuOpen(false);
  };

  const pendingReviewsCount = inspections.filter((i) => i.overallStatus === 'NEEDS_REVIEW').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        onLoadPreset={handleLoadPreset}
        onOpenNewInspection={handleStartNewInspection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activeView={activeView}
      />

      {/* Body Layout */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={(view) => {
            setActiveView(view);
            setMobileMenuOpen(false);
          }}
          currentUser={currentUser}
          userRole={currentUser.role}
          pendingReviewsCount={pendingReviewsCount}
          totalInspectionsCount={inspections.length}
        />

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-md md:hidden pt-20 p-6 space-y-3 animate-in fade-in">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
              Enforcement Modules
            </div>
            {[
              { id: 'dashboard', label: 'Enforcement Dashboard' },
              { id: 'new-inspection', label: 'New Inspection' },
              { id: 'history', label: `Inspection Repository (${inspections.length})` },
              { id: 'products', label: 'Product History' },
              { id: 'rules', label: 'Legal Rule Engine' },
              { id: 'admin', label: 'Admin & Officers' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold ${
                  activeView === item.id ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto max-h-[calc(100vh-4rem)] bg-slate-50 p-4 sm:p-6 lg:p-8">
          {activeView === 'dashboard' && (
            <DashboardView
              inspections={inspections}
              currentUser={currentUser}
              onNavigateToNew={handleStartNewInspection}
              onViewInspection={handleViewInspection}
              onGenerateReport={handleGenerateReport}
              onLoadPreset={handleLoadPreset}
            />
          )}

          {activeView === 'new-inspection' && (
            <NewInspectionView
              currentUser={currentUser}
              onAnalysisComplete={handleAnalysisComplete}
            />
          )}

          {activeView === 'extraction-review' && activeProduct && activeDeclarations && (
            <ExtractionReviewView
              product={activeProduct}
              extractedDeclarations={activeDeclarations}
              onProceedToAudit={handleProceedToAudit}
              onBackToEdit={() => setActiveView('new-inspection')}
            />
          )}

          {activeView === 'results' && activeInspection && (
            <ResultsView
              inspection={activeInspection}
              currentUser={currentUser}
              onEditDeclarations={() => setActiveView('extraction-review')}
              onGenerateReport={() => handleGenerateReport(activeInspection)}
              onBackToDashboard={() => setActiveView('dashboard')}
              onUpdateInspection={(updated) => setActiveInspection(updated)}
            />
          )}

          {activeView === 'report' && activeInspection && (
            <ReportView
              inspection={activeInspection}
              onBack={() => setActiveView('results')}
            />
          )}

          {activeView === 'history' && (
            <InspectionHistoryView
              inspections={inspections}
              onViewInspection={handleViewInspection}
              onGenerateReport={handleGenerateReport}
              onNewInspection={handleStartNewInspection}
            />
          )}

          {activeView === 'products' && (
            <ProductHistoryView
              onViewInspection={handleViewInspection}
              onGenerateReport={handleGenerateReport}
            />
          )}

          {activeView === 'rules' && <RuleManagementView />}

          {activeView === 'admin' && <AdminUsersView />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
