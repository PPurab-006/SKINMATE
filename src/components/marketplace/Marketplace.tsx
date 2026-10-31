import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Scale, 
  X, 
  Check, 
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { Product, ProductCategory } from '../../types/product';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductCompareModal } from './ProductCompareModal';
import { Badge } from '../common/Badge';

interface MarketplaceProps {
  onSelectProduct?: (product: Product) => void;
  initialSelectedProduct?: Product | null;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  initialSelectedProduct = null
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');
  
  // Modals state
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(initialSelectedProduct);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Category tags
  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Products' },
    { id: 'cleanser', label: 'Cleansers' },
    { id: 'toner', label: 'Toners & Essences' },
    { id: 'serum', label: 'Serums' },
    { id: 'moisturizer', label: 'Moisturizers' },
    { id: 'sunscreen', label: 'Sunscreens' },
    { id: 'exfoliant', label: 'Exfoliants' },
    { id: 'haircare', label: 'Haircare' },
    { id: 'beardcare', label: 'Beard Care' },
    { id: 'makeup', label: 'Makeup' },
    { id: 'nails', label: 'Nails' },
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Skin type filter
      if (selectedSkinType !== 'all' && !product.suitableSkinTypes?.includes(selectedSkinType as any)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesActives = product.keyActives.some(a => a.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesActives) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.rating - a.rating; // recommended default
    });
  }, [selectedCategory, selectedSkinType, searchQuery, sortBy]);

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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="lime" size="sm">Vetted Cosmetics Directory</Badge>
            <span className="text-2xs font-mono text-editorial-text-muted">India-First &amp; Global Formulations</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mt-1">
            Product Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-editorial-text-secondary mt-1">
            Clinical ingredients, verifiable INR pricing, and biochemical compatibility metadata.
          </p>
        </div>

        {/* Compare Floating Button Indicator */}
        {compareList.length > 0 && (
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-editorial-lime text-black hover:bg-editorial-lime-hover shadow-lime-glow flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Scale className="w-4 h-4" />
            <span>Compare {compareList.length} Selected Formulations</span>
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-editorial-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, active ingredient (e.g. Niacinamide, Retinol, Ceramides), or name..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-editorial-surface border border-white/10 text-xs sm:text-sm text-white placeholder-editorial-text-muted focus:border-editorial-lime focus:outline-none transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none px-4 py-3 pr-8 rounded-2xl bg-editorial-surface border border-white/10 text-xs text-white focus:border-editorial-lime focus:outline-none font-medium cursor-pointer"
              >
                <option value="recommended">Sort: Highest Match</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-editorial-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-editorial-lime text-black font-semibold shadow-subtle-glow'
                  : 'bg-editorial-surface text-editorial-text-secondary border border-white/[0.08] hover:text-white hover:border-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-2xs font-mono text-editorial-text-muted">
          <span>Showing {filteredProducts.length} verified products</span>
          <span>Prices verified in Indian Rupees (INR ₹)</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-16 rounded-3xl border border-white/10 bg-editorial-surface text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-editorial-text-muted mx-auto" />
            <h4 className="font-display font-semibold text-white">No Matching Products Found</h4>
            <p className="text-xs text-editorial-text-secondary max-w-sm mx-auto">
              Try adjusting your search criteria or resetting the category filter.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 text-xs font-semibold bg-white/[0.06] hover:bg-white/10 rounded-lg text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(prod) => setInspectingProduct(prod)}
                onToggleCompare={handleToggleCompare}
                isComparing={compareList.some(p => p.id === product.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={inspectingProduct}
        isOpen={inspectingProduct !== null}
        onClose={() => setInspectingProduct(null)}
      />

      {/* Product Comparison Modal */}
      <ProductCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={compareList}
        onRemoveProduct={(id) => setCompareList(prev => prev.filter(p => p.id !== id))}
        onClearAll={() => setCompareList([])}
      />
    </div>
  );
};
