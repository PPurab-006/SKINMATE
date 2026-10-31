import React, { useState, useEffect } from 'react';
import { UserProductList, SavedListItem } from '../../types/lists';
import { Product } from '../../types/product';
import { ListsStorageService } from '../../services/listsStorage';
import { 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  Plus, 
  MoveRight, 
  ShoppingBag, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProductImage } from '../common/ProductImage';
import { GoogleShoppingButton } from '../common/GoogleShoppingButton';

interface MyListsViewProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToShop?: () => void;
}

export const MyListsView: React.FC<MyListsViewProps> = ({
  onSelectProduct,
  onNavigateToShop
}) => {
  const [lists, setLists] = useState<UserProductList[]>(() => ListsStorageService.getLists());
  const [activeListId, setActiveListId] = useState<string>(() => {
    const init = ListsStorageService.getLists();
    return init.length > 0 ? init[0].id : '';
  });
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync active list when lists update
  useEffect(() => {
    if (!lists.some(l => l.id === activeListId) && lists.length > 0) {
      setActiveListId(lists[0].id);
    }
  }, [lists, activeListId]);

  const activeList = lists.find(l => l.id === activeListId) || lists[0];

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const created = ListsStorageService.createList(newListName.trim(), newListDesc.trim());
    setLists(ListsStorageService.getLists());
    setActiveListId(created.id);
    setIsCreatingList(false);
    setNewListName('');
    setNewListDesc('');
    showToast(`Created new list: "${created.name}"`);
  };

  const handleDeleteList = (listId: string, listName: string) => {
    if (lists.length <= 1) {
      alert("You must keep at least one list in your collection.");
      return;
    }
    if (confirm(`Are you sure you want to delete the list "${listName}"?`)) {
      const updated = ListsStorageService.deleteList(listId);
      setLists(updated);
      showToast(`Deleted list: "${listName}"`);
    }
  };

  const handleRemoveItem = (itemId: string, productName: string) => {
    if (!activeList) return;
    const updated = ListsStorageService.removeProductFromList(activeList.id, itemId);
    setLists(updated);
    showToast(`Removed "${productName}" from ${activeList.name}`);
  };

  const handleMoveItem = (itemId: string, targetListId: string) => {
    if (!activeList || targetListId === activeList.id) return;
    const target = lists.find(l => l.id === targetListId);
    const updated = ListsStorageService.moveProduct(activeList.id, targetListId, itemId);
    setLists(updated);
    showToast(`Moved to "${target?.name || 'Target List'}"`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalCost = activeList ? activeList.items.reduce((sum, item) => sum + (item.savedPrice ?? item.product.price ?? 0), 0) : 0;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-beauty-muted-border">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xs font-semibold uppercase tracking-widest text-beauty-forest">
              Personalized Regimens &amp; Wishlists
            </span>
            <span className="text-beauty-muted text-xs">•</span>
            <span className="text-2xs font-medium text-beauty-muted">
              Locally Persisted Storage
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-beauty-charcoal-heading">
            My Product Lists
          </h2>
          <p className="text-xs sm:text-sm text-beauty-muted mt-1 max-w-xl font-light leading-relaxed">
            Curate targeted appearance routines, calculate total regime budgets, and access verified direct retailer links saved from your AI visual consultations.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingList(true)}
          className="px-5 py-2.5 rounded-full text-xs font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-all shadow-2xs flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Named List</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-fade-in shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-2xs text-emerald-700 hover:text-emerald-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Create New List Modal / Inline Box */}
      {isCreatingList && (
        <form onSubmit={handleCreateList} className="p-6 rounded-3xl bg-beauty-cream border border-beauty-muted-border space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-semibold text-lg text-beauty-charcoal-heading">
              Create New Curated List
            </h4>
            <button
              type="button"
              onClick={() => setIsCreatingList(false)}
              className="text-xs text-beauty-muted hover:text-beauty-charcoal underline"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-2xs uppercase tracking-wider font-semibold text-beauty-muted mb-1">
                List Title *
              </label>
              <input
                type="text"
                required
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="e.g. Winter Barrier & Ceramide Protocol"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-beauty-muted-border bg-white focus:outline-none focus:ring-1 focus:ring-beauty-forest"
              />
            </div>
            <div>
              <label className="block text-2xs uppercase tracking-wider font-semibold text-beauty-muted mb-1">
                Description / Purpose
              </label>
              <input
                type="text"
                value={newListDesc}
                onChange={(e) => setNewListDesc(e.target.value)}
                placeholder="e.g. Calming redness and barrier replenishment"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-beauty-muted-border bg-white focus:outline-none focus:ring-1 focus:ring-beauty-forest"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingList(false)}
              className="px-4 py-2 rounded-full text-xs text-beauty-muted hover:text-beauty-charcoal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full text-xs font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-colors"
            >
              Create List
            </button>
          </div>
        </form>
      )}

      {/* Main Two-Column Layout: List Tabs on Left, Items on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Column: List Selector & Overview */}
        <div className="space-y-4 lg:col-span-1">
          <div className="p-4 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-2">
            <span className="text-2xs font-semibold uppercase tracking-wider text-beauty-muted px-2">
              Your Saved Regimens
            </span>
            <div className="space-y-1.5 pt-1">
              {lists.map((list) => {
                const isActive = activeList?.id === list.id;
                const count = list.items.length;
                return (
                  <button
                    key={list.id}
                    onClick={() => setActiveListId(list.id)}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-beauty-forest text-beauty-ivory font-semibold shadow-2xs'
                        : 'text-beauty-charcoal hover:bg-beauty-cream'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-serif text-sm truncate">{list.name}</div>
                      <div className={`text-2xs font-normal mt-0.5 ${isActive ? 'text-beauty-ivory/80' : 'text-beauty-muted'}`}>
                        {count} {count === 1 ? 'product' : 'products'}
                      </div>
                    </div>
                    <span className={`text-2xs px-2 py-0.5 rounded-full shrink-0 font-medium ${
                      isActive ? 'bg-beauty-ivory/20 text-beauty-ivory' : 'bg-beauty-cream text-beauty-charcoal'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* List Financial Overview Card */}
          {activeList && (
            <div className="p-6 rounded-3xl bg-beauty-cream border border-beauty-muted-border space-y-3">
              <span className="text-2xs font-semibold uppercase tracking-wider text-beauty-forest">
                Estimated Regime Investment
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-semibold text-beauty-charcoal-heading">
                  ₹{totalCost.toLocaleString('en-IN')}
                </span>
                <span className="text-2xs text-beauty-muted font-normal">
                  ({activeList.items.length} items)
                </span>
              </div>
              <p className="text-2xs text-beauty-muted leading-relaxed font-light">
                Prices calculated from verified retailer direct listings. Total estimated cost includes all items currently saved in this list.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: List Content & Product Cards */}
        <div className="lg:col-span-3 space-y-6">
          {activeList ? (
            <div className="space-y-6">
              {/* Active List Meta Banner */}
              <div className="p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-semibold text-2xl text-beauty-charcoal-heading">
                      {activeList.name}
                    </h3>
                    <Badge variant="green" size="sm">
                      {activeList.items.length} Saved
                    </Badge>
                  </div>
                  {activeList.description && (
                    <p className="text-xs text-beauty-muted mt-1 font-light">
                      {activeList.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {onNavigateToShop && (
                    <button
                      onClick={onNavigateToShop}
                      className="text-xs font-semibold text-beauty-forest hover:underline flex items-center gap-1"
                    >
                      <span>Explore catalogue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {lists.length > 1 && (
                    <button
                      onClick={() => handleDeleteList(activeList.id, activeList.name)}
                      className="p-2 rounded-full text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete this list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Items List */}
              {activeList.items.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-beauty-cream border border-dashed border-beauty-muted-border space-y-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto text-beauty-muted border border-beauty-muted-border">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="font-serif font-semibold text-lg text-beauty-charcoal-heading">
                      This list is currently empty
                    </h4>
                    <p className="text-xs text-beauty-muted leading-relaxed font-light">
                      Save products directly from your AI skin and hair visual consultations or from the curated product catalogue.
                    </p>
                  </div>
                  {onNavigateToShop && (
                    <button
                      onClick={onNavigateToShop}
                      className="px-5 py-2.5 rounded-full text-xs font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-colors"
                    >
                      Discover Products
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {activeList.items.map((item) => {
                    const p = item.product;
                    const verifiedRetailer = p.retailers?.[0];
                    const buyUrl = verifiedRetailer?.url || 'https://www.nykaa.com';

                    return (
                      <div
                        key={item.id}
                        className="p-5 sm:p-6 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card hover:border-beauty-forest/40 transition-all flex flex-col sm:flex-row gap-5 items-start"
                      >
                        {/* Product Photo with Verified Image or Neutral Unavailable State */}
                        <div
                          onClick={() => onSelectProduct(p)}
                          className="w-full sm:w-28 sm:h-28 aspect-square rounded-2xl overflow-hidden border border-beauty-muted-border bg-beauty-cream/30 shrink-0 cursor-pointer group"
                        >
                          <ProductImage
                            product={p}
                            className="w-full h-full"
                            imageClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            showAttribution={false}
                          />
                        </div>

                        {/* Product Core Details */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-2xs font-semibold uppercase tracking-wider text-beauty-forest">
                              {p.brand}
                            </span>
                            <span className="text-2xs px-2 py-0.5 rounded-full bg-beauty-cream text-beauty-charcoal border border-beauty-muted-border font-medium">
                              {p.category}
                            </span>
                            {p.verification?.verifiedIdentity && (
                              <span className="text-2xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>Verified Listing</span>
                              </span>
                            )}
                            <span className="text-[10px] text-beauty-muted font-light">
                              via {p.sourceAttribution || item.sourceAttribution || 'Open Beauty Facts'}
                            </span>
                          </div>

                          <h4
                            onClick={() => onSelectProduct(p)}
                            className="font-serif font-semibold text-base text-beauty-charcoal-heading hover:text-beauty-forest cursor-pointer transition-colors leading-snug"
                          >
                            {p.name}
                          </h4>

                          <div className="flex items-baseline gap-2 text-xs text-beauty-muted flex-wrap">
                            {p.price !== null && p.price !== undefined ? (
                              <>
                                <span className="font-serif text-lg font-semibold text-beauty-charcoal">
                                  ₹{p.price.toLocaleString('en-IN')}
                                </span>
                                <span className="text-2xs text-beauty-muted font-normal">(Ref. Price)</span>
                              </>
                            ) : (
                              <span className="font-medium text-beauty-muted italic">
                                Price on Google
                              </span>
                            )}
                            <span>•</span>
                            <span>{p.variant || p.exactVariant || p.size}</span>
                            {p.size && (p.variant || p.exactVariant) && (
                              <span>({p.size})</span>
                            )}
                            {p.barcode && (
                              <span>• GTIN: {p.barcode}</span>
                            )}
                          </div>

                          {/* Recommendation Notes & Search Query Callout */}
                          <div className="p-3 rounded-xl bg-beauty-cream/60 border border-beauty-muted-border text-2xs text-beauty-charcoal-body leading-relaxed font-light space-y-1">
                            {item.notes && (
                              <div>
                                <span className="font-semibold text-beauty-forest">Regimen Rationale: </span>
                                <span>{item.notes}</span>
                              </div>
                            )}
                            <div className="text-[11px] text-beauty-muted font-light pt-0.5 flex items-center gap-1">
                              <span className="font-medium text-beauty-charcoal">Google Search:</span>
                              <span className="font-mono text-beauty-forest">{p.googleSearchQuery || item.googleSearchQuery}</span>
                            </div>
                          </div>

                          {/* Move to another list dropdown */}
                          {lists.length > 1 && (
                            <div className="flex items-center gap-2 pt-1 text-2xs text-beauty-muted">
                              <span>Move to:</span>
                              <select
                                onChange={(e) => {
                                  if (e.target.value) handleMoveItem(item.id, e.target.value);
                                }}
                                defaultValue=""
                                className="px-2.5 py-1 text-2xs rounded-lg border border-beauty-muted-border bg-beauty-cream/40 text-beauty-charcoal focus:outline-none"
                              >
                                <option value="" disabled>Select list...</option>
                                {lists.filter(l => l.id !== activeList.id).map(l => (
                                  <option key={l.id} value={l.id}>{l.name}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                        {/* Product Action Buttons (Find on Google, Details, Remove) */}
                        <div className="flex sm:flex-col items-center gap-2.5 w-full sm:w-40 shrink-0 pt-2 sm:pt-0">
                          {/* PRIMARY: UNIVERSAL GOOGLE PRODUCT SEARCH */}
                          <GoogleShoppingButton
                            product={p}
                            variant="primary"
                            size="sm"
                            label="Find on Google"
                            className="w-full text-center"
                          />

                          {/* Quick Inspect Details */}
                          <button
                            onClick={() => onSelectProduct(p)}
                            className="px-4 py-2 rounded-full text-xs font-medium border border-beauty-muted-border hover:bg-beauty-cream text-beauty-charcoal transition-colors w-full"
                          >
                            Details
                          </button>

                          {/* Remove */}
                          <button
                            onClick={() => handleRemoveItem(item.id, p.name)}
                            className="p-2 rounded-full text-beauty-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove from this list"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
