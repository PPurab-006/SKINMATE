import React, { useState, useEffect } from 'react';
import { AppTab } from './types/common';
import { UserAppearanceProfile } from './types/profile';
import { SkinAnalysisResult } from './types/skin';
import { HairAnalysisResult } from './types/hair';
import { Routine } from './types/routine';
import { Product } from './types/product';
import { SavedLook } from './types/style';

// Datasets & Services
import { DEFAULT_USER_PROFILE, INITIAL_SKIN_ANALYSIS, INITIAL_HAIR_ANALYSIS } from './data/mockAnalysis';
import { INITIAL_ROUTINES } from './data/mockRoutines';
import { MOCK_PRODUCTS } from './data/mockProducts';
import { StorageService } from './services/storage';
import { youCamClient } from './services/youcam/client';

// Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { PersonalDashboard } from './components/dashboard/PersonalDashboard';
import { SkinLab } from './components/skin/SkinLab';
import { HairLab } from './components/hair/HairLab';
import { StyleStudio } from './components/style/StyleStudio';
import { RoutineBuilder } from './components/routine/RoutineBuilder';
import { Marketplace } from './components/marketplace/Marketplace';
import { UserProfile } from './components/profile/UserProfile';
import { ProductDetailModal } from './components/marketplace/ProductDetailModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [profile, setProfile] = useState<UserAppearanceProfile>(() => StorageService.getUserProfile());
  const [skinAnalysis, setSkinAnalysis] = useState<SkinAnalysisResult>(INITIAL_SKIN_ANALYSIS);
  const [hairAnalysis, setHairAnalysis] = useState<HairAnalysisResult>(INITIAL_HAIR_ANALYSIS);
  const [routines, setRoutines] = useState<Routine[]>(INITIAL_ROUTINES);
  const [isMockMode, setIsMockMode] = useState<boolean>(youCamClient.getConfig().isMockMode);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  // Sync profile changes to storage
  useEffect(() => {
    StorageService.saveUserProfile(profile);
  }, [profile]);

  // Handler for completing a new skin analysis
  const handleSkinAnalysisComplete = (newResult: SkinAnalysisResult) => {
    setSkinAnalysis(newResult);
    setProfile(prev => ({
      ...prev,
      skin: {
        ...prev.skin,
        type: newResult.skinType,
        fitzpatrick: newResult.fitzpatrick,
        colorTone: newResult.colorTone,
      },
      skinHistory: [newResult, ...(prev.skinHistory || [])]
    }));
  };

  // Handler for completing a new hair analysis
  const handleHairAnalysisComplete = (newResult: HairAnalysisResult) => {
    setHairAnalysis(newResult);
    setProfile(prev => ({
      ...prev,
      hair: {
        ...prev.hair,
        pattern: newResult.pattern,
        porosity: newResult.scalpProfile.porosity,
        scalpType: newResult.scalpProfile.type,
      },
      hairHistory: [newResult, ...(prev.hairHistory || [])]
    }));
  };

  // Handler for saving looks from Style Studio
  const handleSaveLook = (newLook: SavedLook) => {
    setProfile(prev => ({
      ...prev,
      savedLooks: [newLook, ...(prev.savedLooks || [])]
    }));
  };

  // Handler for toggling mock/live mode
  const handleToggleMockMode = (enabled: boolean) => {
    youCamClient.setMockMode(enabled);
    setIsMockMode(enabled);
  };

  // Clear all data
  const handleClearAllData = () => {
    setProfile(DEFAULT_USER_PROFILE);
    setSkinAnalysis(INITIAL_SKIN_ANALYSIS);
    setHairAnalysis(INITIAL_HAIR_ANALYSIS);
    setRoutines(INITIAL_ROUTINES);
  };

  return (
    <div className="min-h-screen flex flex-col bg-editorial-bg text-editorial-text-primary selection:bg-editorial-lime selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        profile={profile}
        isMockMode={isMockMode}
        onToggleMockMode={handleToggleMockMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'dashboard' && (
          <PersonalDashboard
            profile={profile}
            skinAnalysis={skinAnalysis}
            hairAnalysis={hairAnalysis}
            activeRoutines={routines}
            recommendedProducts={MOCK_PRODUCTS}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={(product) => setInspectingProduct(product)}
          />
        )}

        {activeTab === 'skin-lab' && (
          <SkinLab
            currentAnalysis={skinAnalysis}
            onAnalysisComplete={handleSkinAnalysisComplete}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={(product) => setInspectingProduct(product)}
          />
        )}

        {activeTab === 'hair-lab' && (
          <HairLab
            currentAnalysis={hairAnalysis}
            onAnalysisComplete={handleHairAnalysisComplete}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={(product) => setInspectingProduct(product)}
          />
        )}

        {activeTab === 'style-studio' && (
          <StyleStudio
            baseImageUrl={skinAnalysis.imageUrl}
            onSaveLook={handleSaveLook}
          />
        )}

        {activeTab === 'routine-builder' && (
          <RoutineBuilder
            initialRoutines={routines}
            onSaveRoutines={(updated) => setRoutines(updated)}
            onOpenProductDetails={(product) => setInspectingProduct(product)}
          />
        )}

        {activeTab === 'marketplace' && (
          <Marketplace
            initialSelectedProduct={inspectingProduct}
            onSelectProduct={(product) => setInspectingProduct(product)}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfile
            profile={profile}
            onUpdateProfile={(updated) => setProfile(updated)}
            onClearAllData={handleClearAllData}
          />
        )}
      </main>

      {/* Global Product Detail Modal */}
      <ProductDetailModal
        product={inspectingProduct}
        isOpen={inspectingProduct !== null}
        onClose={() => setInspectingProduct(null)}
      />

      {/* Application Footer */}
      <Footer
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default App;
