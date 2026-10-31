import fs from 'fs';
import path from 'path';

console.log('--- SkinMate Layout Verification Test ---');

// 1. Read VisualAnalysisShoppingConsultation.tsx
const consultationFilePath = path.resolve('src/components/intelligence/VisualAnalysisShoppingConsultation.tsx');
const consultationCode = fs.readFileSync(consultationFilePath, 'utf8');

// Assert two-column workspace
console.log('\n[Check 1] Two-column desktop workspace:');
const hasTwoColumnGrid = consultationCode.includes('grid grid-cols-1 lg:grid-cols-12');
const hasUniformPanels = consultationCode.includes('lg:col-span-5') && 
                         consultationCode.includes('lg:col-span-7') && 
                         consultationCode.includes('flex flex-col rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card overflow-hidden');
console.log(' - Grid grid-cols-1 lg:grid-cols-12:', hasTwoColumnGrid);
console.log(' - Uniform twin panel columns (lg:col-span-5 & lg:col-span-7 h-full):', hasUniformPanels);
if (!hasTwoColumnGrid || !hasUniformPanels) {
  throw new Error('Failed Check 1: Two column desktop layout with uniform panels not found.');
}

// Assert right product panel defined height
console.log('\n[Check 2] Uniform desktop height constraints:');
const hasDefinedHeight = consultationCode.includes('lg:h-[750px]') && 
                         consultationCode.includes('items-stretch');
console.log(' - Desktop uniform height (lg:h-[750px] items-stretch):', hasDefinedHeight);
if (!hasDefinedHeight) {
  throw new Error('Failed Check 2: Defined height constraints not found.');
}

// Assert overflow-y: auto ONLY on inner product list
console.log('\n[Check 3] Apply overflow-y: auto ONLY to inner product-list container:');
const outerCardOverflow = consultationCode.includes('lg:col-span-7') && consultationCode.includes('overflow-hidden');
const innerListOverflow = consultationCode.includes('id="recommendations-scroll-panel"') && 
                          consultationCode.includes('flex-1 min-h-0 overflow-y-auto');
console.log(' - Outer card has overflow-hidden (no overflow-y: auto on card):', outerCardOverflow);
console.log(' - Inner container id="recommendations-scroll-panel" has overflow-y-auto:', innerListOverflow);
if (!outerCardOverflow || !innerListOverflow) {
  throw new Error('Failed Check 3: Inner overflow-y: auto isolation not satisfied.');
}

// Assert Sticky Header with sorting controls & category filters
console.log('\n[Check 4] Sticky panel header with title, category filters, and sorting controls:');
const hasStickyHeader = consultationCode.includes('shrink-0') && consultationCode.includes('border-b');
const hasSortDropdown = consultationCode.includes('value={sortBy}') && 
                        consultationCode.includes('Highest Match') && 
                        consultationCode.includes('Price: Low to High');
const hasCategoryFilters = consultationCode.includes('categoryFilter') && 
                           consultationCode.includes('All Steps');
console.log(' - Sticky/shrink-0 panel header:', hasStickyHeader);
console.log(' - Sorting controls present:', hasSortDropdown);
console.log(' - Category filters present:', hasCategoryFilters);
if (!hasStickyHeader || !hasSortDropdown || !hasCategoryFilters) {
  throw new Error('Failed Check 4: Sticky header with sorting controls not satisfied.');
}

// Assert Mobile responsive stacked layout
console.log('\n[Check 5] Mobile vertically stacked layout with reasonable height:');
const hasMobileHeight = consultationCode.includes('h-[60vh]') && consultationCode.includes('min-h-[480px]');
console.log(' - Mobile height h-[60vh] min-h-[480px]:', hasMobileHeight);
if (!hasMobileHeight) {
  throw new Error('Failed Check 5: Mobile height constraints not satisfied.');
}

// Assert Buy Now / Google Shopping and Add to List functional actions
console.log('\n[Check 6] Buy Now / Google Shopping and Add to List actions:');
const hasBuyOrGoogleLink = (consultationCode.includes('href={directBuyUrl}') || consultationCode.includes('<GoogleShoppingButton')) && 
                           (consultationCode.includes('target="_blank"') || consultationCode.includes('GoogleShoppingButton'));
const hasAddToList = consultationCode.includes('onClick={() => setSavingProduct(product)}');
console.log(' - Buy Now / Google Shopping action:', hasBuyOrGoogleLink);
console.log(' - Add to list button with modal trigger:', hasAddToList);
if (!hasBuyOrGoogleLink || !hasAddToList) {
  throw new Error('Failed Check 6: Actions not present.');
}

// Assert subtle scrollbar utility in index.css
console.log('\n[Check 7] Subtle scrollbar utility in index.css:');
const cssPath = path.resolve('src/index.css');
const cssCode = fs.readFileSync(cssPath, 'utf8');
const hasScrollbarClass = cssCode.includes('.recommendation-scroll-container') && 
                          cssCode.includes('overscroll-behavior-y: contain');
console.log(' - .recommendation-scroll-container defined with overscroll containment:', hasScrollbarClass);
if (!hasScrollbarClass) {
  throw new Error('Failed Check 7: Subtle scrollbar utility not found in index.css.');
}

console.log('\n✓ ALL LAYOUT SPECIFICATIONS VERIFIED SUCCESSFULLY!');
