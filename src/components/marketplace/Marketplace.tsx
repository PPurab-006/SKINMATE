import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Scale, 
  ArrowUpDown,
  Sparkles,
  Check,
  X,
  SlidersHorizontal,
  ShieldCheck
} from 'lucide-react';
import { Product, ProductCategory, ProductDepartment } from '../../types/product';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductCompareModal } from './ProductCompareModal';
import { CatalogueImageAuditModal } from './CatalogueImageAuditModal';
import { AddToListModal } from '../lists/AddToListModal';
import { Badge } from '../common/Badge';

interface MarketplaceProps {
  onSelectProduct?: (product: Product) => void;
  initialSelectedProduct?: Product | null;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  initialSelectedProduct = null
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<'all' | ProductDepartment>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('all');
  const [selectedHairType, setSelectedHairType] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<'all' | 'under-500' | '500-1500' | '1500-3000' | 'above-3000'>('all');
  const [fragranceFreeOnly, setFragranceFreeOnly] = useState(false);
  const [veganOnly, setVeganOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');
  
  // Modals state
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(initialSelectedProduct);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [addToListProduct, setAddToListProduct] = useState<Product | null>(null);

  // Department definitions
  const departments: { id: 'all' | ProductDepartment; label: string }[] = [
    { id: 'all', label: 'All Departments' },
    { id: 'skincare', label: 'Skincare' },
    { id: 'haircare', label: 'Haircare' },
    { id: 'grooming', label: 'Grooming' },
    { id: 'beauty', label: 'Beauty & Cosmetics' },
  ];

  // Dynamic subcategories per department
  const subcategoryMap: Record<string, { id: string; label: string }[]> = {
    all: [
      { id: 'all', label: 'All Categories' }
    ],
    skincare: [
      { id: 'all', label: 'All Skincare' },
      { id: 'cleanser', label: 'Cleansers' },
      { id: 'toner', label: 'Toners & Essences' },
      { id: 'serum', label: 'Serums' },
      { id: 'moisturizer', label: 'Moisturizers' },
      { id: 'sunscreen', label: 'Sunscreens (SPF)' },
      { id: 'exfoliant', label: 'Exfoliants' },
      { id: 'treatment', label: 'Treatments' }
    ],
    haircare: [
      { id: 'all', label: 'All Haircare' },
      { id: 'shampoo', label: 'Shampoos' },
      { id: 'conditioner', label: 'Conditioners' },
      { id: 'hair-mask', label: 'Hair Masks' },
      { id: 'hair-oil', label: 'Hair Oils' },
      { id: 'hair-styling', label: 'Styling Products' },
      { id: 'hair-treatment', label: 'Hair Treatments' }
    ],
    grooming: [
      { id: 'all', label: 'All Grooming' },
      { id: 'beard-oil', label: 'Beard Oils' },
      { id: 'beard-wash', label: 'Beard Washes' },
      { id: 'shaving', label: 'Shaving Products' },
      { id: 'grooming-accessory', label: 'Grooming Accessories' }
    ],
    beauty: [
      { id: 'all', label: 'All Beauty' },
      { id: 'makeup', label: 'Makeup' },
      { id: 'nails', label: 'Nail Products' },
      { id: 'cosmetics', label: 'Cosmetics' }
    ]
  };

  const currentSubcategories = subcategoryMap[selectedDepartment] || subcategoryMap.all;

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Department filter
      if (selectedDepartment !== 'all') {
        const prodDept = product.department || 
          (['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'exfoliant', 'treatment'].includes(product.category) ? 'skincare' :
           ['haircare', 'shampoo', 'conditioner', 'hair-mask', 'hair-oil', 'hair-styling', 'hair-treatment'].includes(product.category) ? 'haircare' :
           ['beardcare', 'beard-oil', 'beard-wash', 'shaving', 'grooming-accessory'].includes(product.category) ? 'grooming' : 'beauty');

        if (prodDept !== selectedDepartment) return false;
      }

      // Subcategory filter
      if (selectedCategory !== 'all') {
        if (product.category !== selectedCategory) {
          // Check for legacy categorization mapping
          if (selectedCategory === 'hair-mask' && product.category === 'haircare' && product.subcategory?.includes('Mask')) return true;
          if (selectedCategory === 'beard-oil' && product.category === 'beardcare' && product.subcategory?.includes('Oil')) return true;
          if (selectedCategory === 'beard-wash' && product.category === 'beardcare' && product.subcategory?.includes('Wash')) return true;
          return false;
        }
      }

      // Skin type filter
      if (selectedSkinType !== 'all' && !product.suitableSkinTypes?.includes(selectedSkinType as any)) {
        return false;
      }

      // Hair type filter
      if (selectedHairType !== 'all' && !product.suitableHairTypes?.includes(selectedHairType as any)) {
        return false;
      }

      // Certifications
      if (fragranceFreeOnly && !product.isFragranceFree) return false;
      if (veganOnly && !product.isVegan) return false;

      // Price range
      if (selectedPriceRange !== 'all') {
        if (product.price === null) return false;
        if (selectedPriceRange === 'under-500' && product.price >= 500) return false;
        if (selectedPriceRange === '500-1500' && (product.price < 500 || product.price > 1500)) return false;
        if (selectedPriceRange === '1500-3000' && (product.price < 1500 || product.price > 3000)) return false;
        if (selectedPriceRange === 'above-3000' && product.price <= 3000) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesActives = product.keyActives.some(a => a.toLowerCase().includes(q));
        const matchesCategory = product.category.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesActives && !matchesCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price ?? 999999) - (b.price ?? 999999);
      if (sortBy === 'price-desc') return (b.price ?? -1) - (a.price ?? -1);
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.rating - a.rating; // default to top rated
    });
  }, [selectedDepartment, selectedCategory, selectedSkinType, selectedHairType, selectedPriceRange, fragranceFreeOnly, veganOnly, searchQuery, sortBy]);

  const handleToggleCompare = (product: Product) => {
    setCompareList(prev => {
      if (prev.some(p => p.id === product.id)) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 products simultaneously.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleDepartmentChange = (dept: 'all' | ProductDepartment) => {
    setSelectedDepartment(dept);
    setSelectedCategory('all');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* 1. Header & Compare Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-beauty-muted-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-beauty-forest" />
            <span className="text-2xs font-semibold uppercase tracking-widest text-beauty-forest font-sans">
              Pillar 2: The Product Catalogue Marketplace
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-beauty-charcoal-heading font-normal tracking-tight">
            Discover &amp; Shop
          </h1>
          <p className="text-sm text-beauty-muted mt-2 max-w-xl font-light">
            Verified skincare, haircare, grooming, and cosmetics catalogue. Transparent ingredient lists, suitability matrices, and live retailer availability in India.
          </p>
        </div>

        {/* Action Controls: Audit & Compare */}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setIsAuditModalOpen(true)}
            className="px-4 py-2.5 rounded-full border border-beauty-muted-border bg-white hover:bg-beauty-cream/70 text-beauty-forest text-xs font-medium transition-all shadow-2xs flex items-center gap-2"
            title="Inspect 3-tier image source hierarchy & typographic fallbacks"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Catalogue Image Audit</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Audit
            </span>
          </button>

          {/* Compare Floating Button Indicator */}
          {compareList.length > 0 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-5 py-2.5 rounded-full font-medium text-xs bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover shadow-beauty-card flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Scale className="w-4 h-4 text-beauty-lime" />
              <span>Compare ({compareList.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top-Level Department Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-beauty-muted-border">
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => handleDepartmentChange(dept.id)}
            className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 -mb-px whitespace-nowrap ${
              selectedDepartment === dept.id
                ? 'border-beauty-forest text-beauty-forest'
                : 'border-transparent text-beauty-muted hover:text-beauty-charcoal'
            }`}
          >
            {dept.label}
          </button>
        ))}
      </div>

      {/* 3. Search Bar and Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-beauty-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, product name, or key active (e.g. Niacinamide, Salicylic, Argan, Retinol)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-beauty-muted-border text-sm text-beauty-charcoal placeholder-beauty-muted focus:border-beauty-forest focus:outline-none transition-colors shadow-beauty-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-beauty-muted hover:text-beauty-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-4 py-3 rounded-2xl border text-xs font-medium flex items-center gap-2 shadow-beauty-sm transition-all ${
                showAdvancedFilters
                  ? 'bg-beauty-forest text-beauty-ivory border-beauty-forest'
                  : 'bg-white text-beauty-charcoal border-beauty-muted-border hover:bg-beauty-cream'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none px-4 py-3 pr-9 rounded-2xl bg-white border border-beauty-muted-border text-xs text-beauty-charcoal focus:border-beauty-forest focus:outline-none font-medium cursor-pointer shadow-beauty-sm"
              >
                <option value="recommended">Sort: Curated Favorites</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ArrowUpDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-beauty-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Dynamic Subcategories Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {currentSubcategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-beauty-forest text-beauty-ivory shadow-beauty-sm font-semibold'
                  : 'bg-white text-beauty-charcoal border border-beauty-muted-border hover:bg-beauty-cream'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Collapsible Advanced Multi-Attribute Filters Drawer */}
        {showAdvancedFilters && (
          <div className="p-6 rounded-3xl bg-beauty-cream/70 border border-beauty-muted-border space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-beauty-muted-border pb-3">
              <h4 className="font-serif font-semibold text-sm text-beauty-charcoal">
                Refine by Suitability &amp; Attributes
              </h4>
              <button
                onClick={() => {
                  setSelectedSkinType('all');
                  setSelectedHairType('all');
                  setSelectedPriceRange('all');
                  setFragranceFreeOnly(false);
                  setVeganOnly(false);
                }}
                className="text-xs text-beauty-forest hover:underline font-medium"
              >
                Clear all filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {/* Skin Suitability */}
              <div className="space-y-1.5">
                <label className="font-semibold text-beauty-charcoal">Skin Type Compatibility</label>
                <select
                  value={selectedSkinType}
                  onChange={(e) => setSelectedSkinType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-beauty-muted-border text-xs text-beauty-charcoal focus:outline-none"
                >
                  <option value="all">Any Skin Type</option>
                  <option value="Dry">Dry Skin</option>
                  <option value="Normal">Normal Skin</option>
                  <option value="Combination">Combination Skin</option>
                  <option value="Oily">Oily Skin</option>
                  <option value="Sensitive">Sensitive Skin</option>
                </select>
              </div>

              {/* Hair Suitability */}
              <div className="space-y-1.5">
                <label className="font-semibold text-beauty-charcoal">Hair Type Compatibility</label>
                <select
                  value={selectedHairType}
                  onChange={(e) => setSelectedHairType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-beauty-muted-border text-xs text-beauty-charcoal focus:outline-none"
                >
                  <option value="all">Any Hair Pattern</option>
                  <option value="Straight">Straight (Type 1)</option>
                  <option value="Wavy">Wavy (Type 2)</option>
                  <option value="Curly">Curly (Type 3)</option>
                  <option value="Coily">Coily (Type 4)</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-1.5">
                <label className="font-semibold text-beauty-charcoal">Price Tier</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-white border border-beauty-muted-border text-xs text-beauty-charcoal focus:outline-none"
                >
                  <option value="all">Any Price</option>
                  <option value="under-500">Under ₹500 (Affordable)</option>
                  <option value="500-1500">₹500 - ₹1,500 (Mid-Range)</option>
                  <option value="1500-3000">₹1,500 - ₹3,000 (Premium)</option>
                  <option value="above-3000">Above ₹3,000 (Luxury)</option>
                </select>
              </div>

              {/* Ethical Certifications */}
              <div className="space-y-2 pt-1">
                <label className="font-semibold text-beauty-charcoal block">Certifications</label>
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-beauty-charcoal">
                    <input
                      type="checkbox"
                      checked={fragranceFreeOnly}
                      onChange={(e) => setFragranceFreeOnly(e.target.checked)}
                      className="rounded accent-beauty-forest"
                    />
                    <span>100% Fragrance-Free Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-beauty-charcoal">
                    <input
                      type="checkbox"
                      checked={veganOnly}
                      onChange={(e) => setVeganOnly(e.target.checked)}
                      className="rounded accent-beauty-forest"
                    />
                    <span>100% Vegan Only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Product Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-beauty-muted">
          <span>Showing {filteredProducts.length} verified products in catalogue</span>
          <span>Authentic INR (₹) retail prices with verified INCI lists</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-16 rounded-3xl border border-beauty-muted-border bg-white text-center space-y-3 shadow-beauty-sm">
            <ShoppingBag className="w-10 h-10 text-beauty-muted mx-auto" />
            <h3 className="font-serif text-lg font-medium text-beauty-charcoal">No Matching Products Found</h3>
            <p className="text-xs text-beauty-muted max-w-sm mx-auto">
              Try adjusting your search keywords or resetting your department and category filters to explore the full collection.
            </p>
            <button
              onClick={() => {
                setSelectedDepartment('all');
                setSelectedCategory('all');
                setSearchQuery('');
                setSelectedSkinType('all');
                setSelectedHairType('all');
                setSelectedPriceRange('all');
              }}
              className="px-5 py-2.5 text-xs font-semibold bg-beauty-cream hover:bg-beauty-forest hover:text-beauty-ivory rounded-full text-beauty-forest transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(prod) => setInspectingProduct(prod)}
                onToggleCompare={handleToggleCompare}
                isComparing={compareList.some(p => p.id === product.id)}
                onAddToList={(prod) => setAddToListProduct(prod)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Product Detail Modal */}
      <ProductDetailModal
        product={inspectingProduct}
        isOpen={inspectingProduct !== null}
        onClose={() => setInspectingProduct(null)}
      />

      {/* 6. Product Comparison Modal */}
      <ProductCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={compareList}
        onRemoveProduct={(id) => setCompareList(prev => prev.filter(p => p.id !== id))}
        onClearAll={() => setCompareList([])}
      />

      {/* 7. Catalogue Image Integrity Audit Modal */}
      <CatalogueImageAuditModal
        products={MOCK_PRODUCTS}
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      {/* 8. Add to List Modal */}
      <AddToListModal
        product={addToListProduct}
        isOpen={addToListProduct !== null}
        onClose={() => setAddToListProduct(null)}
      />
    </div>
  );
};
