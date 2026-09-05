import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import VerifyModal from './components/VerifyModal';
import TamperModal from './components/TamperModal';
import DemoGuideModal from './components/DemoGuideModal';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LandRecordsPage from './pages/LandRecordsPage';
import AddRecordPage from './pages/AddRecordPage';
import RecordDetailsPage from './pages/RecordDetailsPage';
import BlockchainExplorerPage from './pages/BlockchainExplorerPage';
import AuditLogsPage from './pages/AuditLogsPage';
import UsersPage from './pages/UsersPage';

export default function App() {
  const { user, loading, login, logout } = useAuth();

  // Navigation state
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'app'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  // Stats state for Navbar
  const [stats, setStats] = useState(null);

  // Modals state
  const [verifyResult, setVerifyResult] = useState(null);
  const [tamperingRecord, setTamperingRecord] = useState(null);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);

  // Refresh stats periodically
  const loadGlobalStats = async () => {
    try {
      if (user) {
        const data = await api.getDashboardStats();
        if (data.success) {
          setStats(data.stats);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (user) {
      setCurrentView('app');
      loadGlobalStats();
    } else {
      if (currentView === 'app') {
        setCurrentView('landing');
      }
    }
  }, [user]);

  // Global verification trigger
  const handleVerify = async (recordIdOrSurvey) => {
    try {
      const res = await api.verifyLandRecord(recordIdOrSurvey);
      setVerifyResult(res);
      loadGlobalStats();
    } catch (err) {
      alert(err.message || 'Verification failed');
    }
  };

  // Global tamper simulation trigger
  const handleSimulateTamper = async (recordId, data) => {
    try {
      await api.simulateTampering(recordId, data);
      loadGlobalStats();
      // If currently viewing record details, refresh
      if (selectedRecordId === recordId) {
        setSelectedRecordId(null);
        setTimeout(() => setSelectedRecordId(recordId), 50);
      }
    } catch (err) {
      alert(err.message || 'Tamper simulation failed');
    }
  };

  // Global restore record trigger
  const handleRestoreRecord = async (recordId) => {
    try {
      await api.restoreRecord(recordId);
      loadGlobalStats();
      if (selectedRecordId === recordId) {
        setSelectedRecordId(null);
        setTimeout(() => setSelectedRecordId(recordId), 50);
      }
    } catch (err) {
      alert(err.message || 'Restore failed');
    }
  };

  // Switch persona from Demo Guide
  const handleSelectPersona = async (email, pass) => {
    try {
      await login(email, pass);
      setCurrentView('app');
    } catch (err) {
      alert(err.message || 'Persona switch failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070d] flex items-center justify-center text-slate-400 text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xl animate-pulse">
            ⛓
          </div>
          <span>Synchronizing LANDCHAIN Cryptographic Environment...</span>
        </div>
      </div>
    );
  }

  // 1. Landing Page View (unauthenticated or public view)
  if (!user && currentView === 'landing') {
    return (
      <>
        <LandingPage
          onGoToLogin={() => setCurrentView('login')}
          onSelectRecord={(id) => {
            setSelectedRecordId(id);
            setCurrentView('login');
          }}
        />
        <DemoGuideModal
          isOpen={isDemoGuideOpen}
          onClose={() => setIsDemoGuideOpen(false)}
          onSelectPersona={handleSelectPersona}
        />
      </>
    );
  }

  // 2. Login View
  if (!user && currentView === 'login') {
    return (
      <>
        <LoginPage onBackToLanding={() => setCurrentView('landing')} />
        <DemoGuideModal
          isOpen={isDemoGuideOpen}
          onClose={() => setIsDemoGuideOpen(false)}
          onSelectPersona={handleSelectPersona}
        />
      </>
    );
  }

  // 3. Authenticated App Layout
  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col font-['Inter',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        stats={stats}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'landing') {
              setCurrentView('landing');
            } else {
              setSelectedRecordId(null);
              setActiveTab(tab);
            }
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#060913] relative">
          <div className="glow-spot-blue top-10 right-10" />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Record Details View */}
            {selectedRecordId ? (
              <RecordDetailsPage
                recordId={selectedRecordId}
                onBack={() => setSelectedRecordId(null)}
                onVerifyRecord={handleVerify}
                onOpenExplorer={() => {
                  setSelectedRecordId(null);
                  setActiveTab('blockchain');
                }}
                onSimulateTamper={(rec) => setTamperingRecord(rec)}
                onRestoreRecord={handleRestoreRecord}
              />
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <DashboardPage
                    onNavigate={(tab) => setActiveTab(tab)}
                    onVerifyRecord={handleVerify}
                  />
                )}

                {activeTab === 'records' && (
                  <LandRecordsPage
                    onSelectRecord={(id) => setSelectedRecordId(id)}
                    onVerifyRecord={handleVerify}
                    onOpenAdd={() => setActiveTab('add-record')}
                    onSimulateTamper={(rec) => setTamperingRecord(rec)}
                  />
                )}

                {activeTab === 'add-record' && (
                  <AddRecordPage
                    onNavigate={(tab) => setActiveTab(tab)}
                    onRecordCreated={() => loadGlobalStats()}
                  />
                )}

                {activeTab === 'blockchain' && (
                  <BlockchainExplorerPage />
                )}

                {activeTab === 'audit-logs' && (
                  <AuditLogsPage />
                )}

                {activeTab === 'users' && (
                  <UsersPage />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Verification Modal (Shown whenever Verify is executed) */}
      {verifyResult && (
        <VerifyModal
          result={verifyResult}
          onClose={() => setVerifyResult(null)}
          onOpenExplorer={() => {
            setSelectedRecordId(null);
            setActiveTab('blockchain');
          }}
        />
      )}

      {/* Tamper Simulation Modal (Admin Only) */}
      {tamperingRecord && (
        <TamperModal
          record={tamperingRecord}
          onClose={() => setTamperingRecord(null)}
          onSimulate={handleSimulateTamper}
          onRestore={handleRestoreRecord}
        />
      )}

      {/* Demo Guide Modal */}
      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onSelectPersona={handleSelectPersona}
      />
    </div>
  );
}
