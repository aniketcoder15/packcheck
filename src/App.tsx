import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { NewInspectionView } from './components/NewInspectionView';
import { InspectionHistoryView } from './components/InspectionHistoryView';
import { ViolationsView } from './components/ViolationsView';
import { RuleManagementView } from './components/RuleManagementView';
import { OfficersView } from './components/OfficersView';
import { SettingsView } from './components/SettingsView';
import { StatutoryReportDocument } from './components/StatutoryReportDocument';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { ToastContainer } from './components/ToastContainer';
import { INITIAL_INSPECTIONS } from './lib/mockData';
import { InspectionRecord, LanguageCode, ToastMessage, LabelType } from './types';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedRecord, setSelectedRecord] = useState<InspectionRecord | null>(null);

  // App Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Global Quick Camera Modal
  const [isQuickCameraOpen, setIsQuickCameraOpen] = useState<boolean>(false);
  const [pendingQuickImage, setPendingQuickImage] = useState<{
    file: File;
    previewUrl: string;
    labelType: LabelType;
  } | null>(null);

  // Inspections Registry Data
  const [inspections, setInspections] = useState<InspectionRecord[]>(INITIAL_INSPECTIONS);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    type: 'success' | 'warning' | 'error' | 'info',
    title: string,
    message: string
  ) => {
    const newToast: ToastMessage = {
      id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      title,
      message,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add newly sealed inspection record
  const handleSaveInspection = (newRecord: InspectionRecord) => {
    setInspections((prev) => [newRecord, ...prev]);
    setSelectedRecord(newRecord);
  };

  // Handle Quick Camera Capture
  const handleQuickCapture = (file: File, previewUrl: string, labelType: LabelType) => {
    setIsQuickCameraOpen(false);
    setPendingQuickImage({ file, previewUrl, labelType });
    setActiveTab('new-inspection');
    showToast('success', 'Photo Captured', 'Opening New Inspection with captured photo.');
  };

  // View full statutory report for a selected record
  const handleViewInspection = (record: InspectionRecord) => {
    setSelectedRecord(record);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col lg:flex-row antialiased font-sans">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Global Quick Camera Modal */}
      <CameraCaptureModal
        isOpen={isQuickCameraOpen}
        onClose={() => setIsQuickCameraOpen(false)}
        onCapture={handleQuickCapture}
        defaultLabelType="front"
      />

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar
        activeTab={selectedRecord ? 'reports' : (activeTab === 'overview' ? 'dashboard' : (activeTab === 'violations' ? 'compliance' : activeTab))}
        onTabChange={(tab) => {
          setSelectedRecord(null);
          setActiveTab(tab === 'overview' ? 'dashboard' : (tab === 'violations' ? 'compliance' : tab));
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        language={language}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <Header
          activeTab={selectedRecord ? 'reports' : (activeTab === 'overview' ? 'dashboard' : (activeTab === 'violations' ? 'compliance' : activeTab))}
          onTabChange={(tab) => {
            setSelectedRecord(null);
            setActiveTab(tab === 'overview' ? 'dashboard' : (tab === 'violations' ? 'compliance' : tab));
          }}
          language={language}
          onLanguageChange={(l) => {
            setLanguage(l);
            showToast('info', 'Language Updated', `Display language switched.`);
          }}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={searchQuery}
          onSearchQuery={setSearchQuery}
        />

        {/* Dynamic Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Individual Report View when a record is selected */}
          {selectedRecord ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="no-print px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Inspection List</span>
              </button>

              <StatutoryReportDocument
                record={selectedRecord}
                onPrint={() => window.print()}
              />
            </div>
          ) : (
            <>
              {/* Tab: Dashboard */}
              {(activeTab === 'dashboard' || activeTab === 'overview') && (
                <DashboardView
                  inspections={inspections}
                  onStartNewInspection={() => setActiveTab('new-inspection')}
                  onViewInspection={handleViewInspection}
                  onOpenQuickCamera={() => setIsQuickCameraOpen(true)}
                  language={language}
                />
              )}

              {/* Tab: New Inspection Workflow */}
              {activeTab === 'new-inspection' && (
                <NewInspectionView
                  onSaveInspection={handleSaveInspection}
                  onCancel={() => setActiveTab('dashboard')}
                  language={language}
                  onShowToast={showToast}
                  initialCameraOpen={false}
                  initialImage={pendingQuickImage}
                  onClearInitialImage={() => setPendingQuickImage(null)}
                />
              )}

              {/* Tab: History */}
              {activeTab === 'history' && (
                <InspectionHistoryView
                  inspections={inspections}
                  onViewRecord={handleViewInspection}
                  language={language}
                />
              )}

              {/* Tab: Reports & Documents */}
              {activeTab === 'reports' && (
                <InspectionHistoryView
                  inspections={inspections}
                  onViewRecord={handleViewInspection}
                  language={language}
                />
              )}

              {/* Tab: Rule Management */}
              {activeTab === 'rules' && <RuleManagementView language={language} />}

              {/* Tab: Compliance Results */}
              {(activeTab === 'compliance' || activeTab === 'violations') && (
                <ViolationsView
                  inspections={inspections}
                  onViewRecord={handleViewInspection}
                  language={language}
                />
              )}

              {/* Tab: Officers */}
              {activeTab === 'officers' && <OfficersView language={language} />}

              {/* Tab: Settings */}
              {activeTab === 'settings' && (
                <SettingsView language={language} onShowToast={showToast} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
