import React, { useState, useEffect } from 'react';
import { AppTab } from './types/common';
import { UserAppearanceProfile } from './types/profile';
import { SkinAnalysisResult } from './types/skin';
import { HairAnalysisResult } from './types/hair';
import { Routine } from './types/routine';
import { Product } from './types/product';
import { SavedLook } from './types/style';

// Datasets & Services
import { DEFAULT_USER_PROFILE, INITIAL_SKIN_ANALYSIS, INITIAL_HAIR_ANALYSIS, SAMPLE_SKIN_ANALYSIS } from './data/mockAnalysis';
import { INITIAL_ROUTINES } from './data/mockRoutines';
import { MOCK_PRODUCTS } from './data/mockProducts';
import { StorageService } from './services/storage';
import { ListsStorageService } from './services/listsStorage';
import { youCamClient } from './services/youcam/client';

// Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { EditorialHome } from './components/home/EditorialHome';
import { PersonalIntelligenceHub } from './components/intelligence/PersonalIntelligenceHub';
import { ForYouView } from './components/foryou/ForYouView';
import { RoutineBuilder } from './components/routine/RoutineBuilder';
import { StyleStudio } from './components/style/StyleStudio';
import { Marketplace } from './components/marketplace/Marketplace';
import { UserProfile } from './components/profile/UserProfile';
import { ProductDetailModal } from './components/marketplace/ProductDetailModal';
import { MyListsView } from './components/lists/MyListsView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [intelligenceSubTab, setIntelligenceSubTab] = useState<'skin' | 'hair' | 'unified'>('skin');
  const [profile, setProfile] = useState<UserAppearanceProfile>(() => StorageService.getUserProfile());
  const [skinAnalysis, setSkinAnalysis] = useState<SkinAnalysisResult>(INITIAL_SKIN_ANALYSIS);
  const [hairAnalysis, setHairAnalysis] = useState<HairAnalysisResult>(INITIAL_HAIR_ANALYSIS);
  const [routines, setRoutines] = useState<Routine[]>(() => {
    const saved = StorageService.getRoutines();
    return saved.length > 0 ? saved : INITIAL_ROUTINES;
  });
  const [isMockMode, setIsMockMode] = useState<boolean>(youCamClient.getConfig().isMockMode);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  // Sync profile changes to storage
  useEffect(() => {
    StorageService.saveUserProfile(profile);
  }, [profile]);

  // Sync routines changes to storage
  useEffect(() => {
    StorageService.saveRoutines(routines);
  }, [routines]);

  // Handler for completing a new skin consultation
  const handleSkinAnalysisComplete = (newResult: SkinAnalysisResult) => {
    setSkinAnalysis(newResult);
    setProfile(prev => ({
      ...prev,
      hasCompletedSkinConsultation: true,
      skin: {
        type: newResult.skinType,
        fitzpatrick: newResult.fitzpatrick,
        colorTone: newResult.colorTone,
        primaryConcerns: Object.keys(newResult.concerns).slice(0, 3).map(k => newResult.concerns[k]?.name || k),
        allergies: prev.skin?.allergies || [],
      },
      skinHistory: [newResult, ...(prev.skinHistory || []).filter(h => h.id !== newResult.id)]
    }));
  };

  // Handler for completing a new hair consultation
  const handleHairAnalysisComplete = (newResult: HairAnalysisResult) => {
    setHairAnalysis(newResult);
    setProfile(prev => ({
      ...prev,
      hasCompletedHairConsultation: true,
      hair: {
        pattern: newResult.pattern,
        porosity: newResult.scalpProfile.porosity,
        scalpType: newResult.scalpProfile.type,
        lengthCategory: newResult.length.category,
        primaryConcerns: ['Cuticle Frizz Control', 'Scalp Barrier Balance'],
      },
      hairHistory: [newResult, ...(prev.hairHistory || []).filter(h => h.id !== newResult.id)]
    }));
  };

  // Handler for saving looks from Beauty Studio
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

  // Clear all data (PCPartPicker guest reset)
  const handleClearAllData = () => {
    StorageService.clearAllData();
    ListsStorageService.saveLists([]);
    setProfile(DEFAULT_USER_PROFILE);
    setSkinAnalysis(INITIAL_SKIN_ANALYSIS);
    setHairAnalysis(INITIAL_HAIR_ANALYSIS);
    setRoutines(INITIAL_ROUTINES);
  };

  // Direct navigation helper
  const handleNavigate = (tab: AppTab, subMode?: 'skin' | 'hair' | 'unified') => {
    if (tab === 'skin-hair' && subMode) {
      setIntelligenceSubTab(subMode);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add recommended product to compatible routine slot
  const handleAddProductToRoutine = (product: Product) => {
    setRoutines(prevRoutines => {
      return prevRoutines.map(routine => {
        // Find first empty slot that permits this product's category
        let slotFilled = false;
        const updatedSlots = routine.slots.map(slot => {
          if (!slotFilled && slot.product === null && slot.allowedCategories.includes(product.category)) {
            slotFilled = true;
            return { ...slot, product };
          }
          return slot;
        });
        return { ...routine, slots: updatedSlots };
      });
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-beauty-ivory text-beauty-charcoal selection:bg-beauty-forest selection:text-beauty-ivory">
      {/* Top Consumer Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'skin-hair') {
            setIntelligenceSubTab('skin');
          }
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        profile={profile}
        isMockMode={isMockMode}
        onToggleMockMode={handleToggleMockMode}
        savedRoutinesCount={routines.reduce((acc, r) => acc + r.slots.filter(s => s.product !== null).length, 0)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'home' && (
          <EditorialHome
            onNavigate={(tab) => handleNavigate(tab)}
            activeRoutines={routines}
            featuredProducts={MOCK_PRODUCTS.slice(0, 8)}
            onSelectProduct={(product) => setInspectingProduct(product)}
            profile={profile}
            onOpenAssessment={(type) => handleNavigate('skin-hair', type)}
          />
        )}

        {/* PILLAR 1: My Skin & Hair (Personal Intelligence Centre) */}
        {activeTab === 'skin-hair' && (
          <PersonalIntelligenceHub
            initialSubTab={intelligenceSubTab}
            skinAnalysis={skinAnalysis}
            hairAnalysis={hairAnalysis}
            profile={profile}
            onSkinAnalysisComplete={handleSkinAnalysisComplete}
            onHairAnalysisComplete={handleHairAnalysisComplete}
            onSaveProfile={(updated) => setProfile(updated)}
            onNavigate={(tab) => handleNavigate(tab)}
            onSelectProduct={(product) => setInspectingProduct(product)}
          />
        )}

        {/* PILLAR 3: For You (Personalized Recommendation Engine) */}
        {activeTab === 'for-you' && (
          <ForYouView
            profile={profile}
            skinAnalysis={skinAnalysis}
            hairAnalysis={hairAnalysis}
            activeRoutines={routines}
            onSelectProduct={(product) => setInspectingProduct(product)}
            onNavigate={(tab) => handleNavigate(tab)}
            onAddProductToRoutine={handleAddProductToRoutine}
          />
        )}

        {/* PILLAR 2: Discover & Shop (Marketplace Catalogue) */}
        {activeTab === 'shop' && (
          <Marketplace
            initialSelectedProduct={inspectingProduct}
            onSelectProduct={(product) => setInspectingProduct(product)}
          />
        )}

        {/* PILLAR 6: My Lists (Saved Appearance Regimens & Lists) */}
        {activeTab === 'lists' && (
          <MyListsView
            onSelectProduct={(product) => setInspectingProduct(product)}
            onNavigateToShop={() => handleNavigate('shop')}
          />
        )}

        {/* PILLAR 5: My Routine (Personal Care Configurator) */}
        {activeTab === 'routine' && (
          <RoutineBuilder
            initialRoutines={routines}
            onSaveRoutines={(updated) => setRoutines(updated)}
            onOpenProductDetails={(product) => setInspectingProduct(product)}
          />
        )}

        {/* PILLAR 4: Beauty Studio (Virtual Try-on & Experimentation) */}
        {activeTab === 'studio' && (
          <StyleStudio
            baseImageUrl={skinAnalysis.imageUrl}
            hasUserUploadedPhoto={profile.hasCompletedSkinConsultation || (Boolean(skinAnalysis.imageUrl) && skinAnalysis.imageUrl !== SAMPLE_SKIN_ANALYSIS.imageUrl)}
            onSaveLook={handleSaveLook}
          />
        )}

        {/* Guest Preferences & Sensitivities Controls */}
        {activeTab === 'profile' && (
          <UserProfile
            profile={profile}
            onUpdateProfile={(updated) => setProfile(updated)}
            onClearAllData={handleClearAllData}
            onStartConsultation={(type) => {
              handleNavigate('skin-hair', type === 'skin' ? 'skin' : 'hair');
            }}
          />
        )}
      </main>

      {/* Global Product Detail Inspection Modal */}
      <ProductDetailModal
        product={inspectingProduct}
        isOpen={inspectingProduct !== null}
        onClose={() => setInspectingProduct(null)}
      />

      {/* Editorial Footer */}
      <Footer
        onTabChange={(tab) => handleNavigate(tab)}
      />
    </div>
  );
};

export default App;
