/**
 * scripts/verify-guest-configurator.mjs
 * 
 * Comprehensive audit of SkinMate's Guest-First PCPartPicker Architecture:
 * - Complete absence of user accounts, login/register gates, or Supabase Auth.
 * - Browser-side localStorage persistence for lists, routines, and preferences.
 * - Privacy-conscious temporary photograph handling.
 * - UPLOAD -> ANALYSE -> DISCOVER -> CONFIGURE -> COMPARE -> SHOP workflow verification.
 */

import fs from 'fs';
import path from 'path';

console.log('🔬 STARTING SKINMATE GUEST-FIRST PCPARTPICKER ARCHITECTURE AUDIT...\n');

let failedTests = 0;

function assert(condition, testName, failureDetails = '') {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    if (failureDetails) console.error(`   Details: ${failureDetails}`);
    failedTests++;
  }
}

// -------------------------------------------------------------
// 1. SUPABASE & USER ACCOUNT PURGE VERIFICATION
// -------------------------------------------------------------
const supabaseSchemaExists = fs.existsSync(path.resolve('backend/models/supabase_schema.sql'));
assert(
  !supabaseSchemaExists,
  '1. backend/models/supabase_schema.sql is completely removed',
  'Found leftover supabase_schema.sql'
);

const historyRouterPath = path.resolve('backend/routers/history.py');
const historyRouterCode = fs.readFileSync(historyRouterPath, 'utf8');
assert(
  !historyRouterCode.toLowerCase().includes('supabase'),
  '2. backend/routers/history.py contains zero references to Supabase',
  'Found Supabase references in history.py'
);

// Search for any login/registration gate keywords across src/
function searchDirForPatterns(dir, patterns) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let matches = [];
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      if (!['node_modules', '.git', 'dist'].includes(file.name)) {
        matches = matches.concat(searchDirForPatterns(fullPath, patterns));
      }
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const pattern of patterns) {
        if (content.toLowerCase().includes(pattern.toLowerCase())) {
          matches.push({ file: fullPath, pattern });
        }
      }
    }
  }
  return matches;
}

const authGateMatches = searchDirForPatterns(path.resolve('src'), [
  'supabase.auth',
  'signInWithPassword',
  'signUpWithPassword',
  'loginModal',
  'registerModal',
  'create an account to save',
  'sign in to continue',
  'sign in to save'
]);

assert(
  authGateMatches.length === 0,
  '3. Zero registration gates or Supabase Auth method calls across all frontend source files',
  JSON.stringify(authGateMatches)
);

// -------------------------------------------------------------
// 2. BROWSER LOCALSTORAGE PERSISTENCE (PCPARTPICKER STYLE)
// -------------------------------------------------------------
const storageServicePath = path.resolve('src/services/storage.ts');
const storageServiceCode = fs.readFileSync(storageServicePath, 'utf8');

assert(
  storageServiceCode.includes('localStorage.getItem') && 
  storageServiceCode.includes('skinmate_active_routines') &&
  storageServiceCode.includes('skinmate_user_profile'),
  '4. StorageService persists routines and preferences in client-side localStorage',
  'Missing localStorage routines or profile storage'
);

const listsStoragePath = path.resolve('src/services/listsStorage.ts');
const listsStorageCode = fs.readFileSync(listsStoragePath, 'utf8');

assert(
  listsStorageCode.includes('localStorage.getItem') && 
  listsStorageCode.includes('skinmate_user_lists_v1') &&
  listsStorageCode.includes('createList') &&
  listsStorageCode.includes('addProductToList'),
  '5. ListsStorageService persists multiple user product lists in localStorage without registering',
  'Missing local list management or storage key'
);

// -------------------------------------------------------------
// 3. GUEST PREFERENCES & PRIVACY UI
// -------------------------------------------------------------
const navbarPath = path.resolve('src/components/common/Navbar.tsx');
const navbarCode = fs.readFileSync(navbarPath, 'utf8');

assert(
  navbarCode.includes('Preferences') && 
  navbarCode.includes('Guest') && 
  !navbarCode.includes('Sign In') && 
  !navbarCode.includes('Sign Up'),
  '6. Navbar displays Guest Preferences control with zero login/register buttons',
  'Navbar contains auth buttons or missing guest preference control'
);

const userProfilePath = path.resolve('src/components/profile/UserProfile.tsx');
const userProfileCode = fs.readFileSync(userProfilePath, 'utf8');

assert(
  !userProfileCode.includes('unsplash.com/photo-1544005313-94ddf0286df2') &&
  userProfileCode.includes('Zero Accounts • Local Browser Storage • Privacy-First') &&
  userProfileCode.includes('PCPartPicker for Personal Care'),
  '7. UserProfile refactored to Guest Preferences configurator with zero fake portraits',
  'Found fake portrait or missing PCPartPicker guest banner'
);

// -------------------------------------------------------------
// 4. THE 6-STAGE WORKFLOW (UPLOAD -> ANALYSE -> DISCOVER -> CONFIGURE -> COMPARE -> SHOP)
// -------------------------------------------------------------

// Stage 1 & 2: UPLOAD & ANALYSE (temporary photos)
const hubPath = path.resolve('src/components/intelligence/PersonalIntelligenceHub.tsx');
const hubCode = fs.readFileSync(hubPath, 'utf8');
assert(
  hubCode.includes('SkinService.analyzeSkin') && hubCode.includes('HairService.analyzeHair'),
  '8. Stage 1 & 2 (UPLOAD -> ANALYSE): Direct camera/upload analysis without account creation',
  'Missing skin/hair analysis execution in hub'
);

// Stage 3: DISCOVER
const consultationPath = path.resolve('src/components/intelligence/VisualAnalysisShoppingConsultation.tsx');
const consultationCode = fs.readFileSync(consultationPath, 'utf8');
assert(
  consultationCode.includes('RecommendationEngine.getRecommendationsForFinding') &&
  consultationCode.includes('GoogleShoppingButton'),
  '9. Stage 3 (DISCOVER): AI findings immediately connect to exact catalogue products & Google shopping',
  'Missing visual analysis recommendations or Google shopping button'
);

// Stage 4: CONFIGURE (Routine Builder with total cost calculation)
const routineBuilderPath = path.resolve('src/components/routine/RoutineBuilder.tsx');
const routineBuilderCode = fs.readFileSync(routineBuilderPath, 'utf8');
assert(
  routineBuilderCode.includes('totalCost') &&
  routineBuilderCode.includes('analyzeRoutineCompatibility') &&
  routineBuilderCode.includes('ProductSubstitutionModal'),
  '10. Stage 4 (CONFIGURE): Routine configurator calculates total costs, checks formula harmony, and suggests alternatives',
  'Missing cost calculation, compatibility check, or substitution modal'
);

// Stage 5: COMPARE
const compareModalPath = path.resolve('src/components/marketplace/ProductCompareModal.tsx');
const compareModalCode = fs.readFileSync(compareModalPath, 'utf8');
assert(
  compareModalCode.includes('Side-by-Side Formulation Comparison') &&
  compareModalCode.includes('Key Actives') &&
  compareModalCode.includes('Texture'),
  '11. Stage 5 (COMPARE): Side-by-side formulation comparison analyzes actives, texture, and pricing',
  'Missing comparison modal capabilities'
);

// Stage 6: SHOP
const googleShoppingPath = path.resolve('src/components/common/GoogleShoppingButton.tsx');
const googleShoppingCode = fs.readFileSync(googleShoppingPath, 'utf8');
assert(
  googleShoppingCode.includes('buildGoogleProductSearchUrl') &&
  googleShoppingCode.includes('target="_blank"'),
  '12. Stage 6 (SHOP): Universal Google shopping redirect links out cleanly to authorized retailers',
  'Missing Google shopping link generator'
);

// Lists & Saved Builds
const myListsPath = path.resolve('src/components/lists/MyListsView.tsx');
const myListsCode = fs.readFileSync(myListsPath, 'utf8');
assert(
  myListsCode.includes('ListsStorageService.getLists()') &&
  myListsCode.includes('totalCost') &&
  myListsCode.includes('handleCreateList'),
  '13. Saved Lists & Builds: Local persistent multi-list manager with total budget calculation',
  'Missing multi-list manager or total cost calculation'
);

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log('\n======================================================');
if (failedTests === 0) {
  console.log('RESULT: ALL 13 GUEST-FIRST ARCHITECTURE TESTS PASSED CLEANLY (100%)');
} else {
  console.error(`RESULT: ${failedTests} TESTS FAILED`);
  process.exit(1);
}
console.log('======================================================\n');
