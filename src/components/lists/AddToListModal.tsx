import React, { useState, useEffect } from 'react';
import { Product } from '../../types/product';
import { UserProductList } from '../../types/lists';
import { ListsStorageService } from '../../services/listsStorage';
import { Modal } from '../common/Modal';
import { Bookmark, Plus, Check, ExternalLink, Sparkles, FolderPlus } from 'lucide-react';
import { ProductImage } from '../common/ProductImage';

interface AddToListModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddedToList?: (listName: string) => void;
}

export const AddToListModal: React.FC<AddToListModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddedToList,
}) => {
  const [lists, setLists] = useState<UserProductList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [newListName, setNewListName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const existing = ListsStorageService.getLists();
      setLists(existing);
      if (existing.length > 0 && !selectedListId) {
        setSelectedListId(existing[0].id);
      }
      setFeedbackMsg(null);
      setIsCreatingNew(false);
      setNewListName('');
    }
  }, [isOpen]);

  if (!product) return null;

  const handleAdd = (targetListId: string) => {
    const res = ListsStorageService.addProductToList(
      targetListId,
      product,
      product.retailers?.[0]?.name,
      product.reasonForRecommendation
    );

    if (res.itemAlreadyExists) {
      setFeedbackMsg({
        text: `"${product.name}" is already in "${res.listName}".`,
        isError: false,
      });
    } else {
      setFeedbackMsg({
        text: `Saved to "${res.listName}"!`,
        isError: false,
      });
      if (onAddedToList) onAddedToList(res.listName);
      setTimeout(() => {
        onClose();
      }, 1100);
    }
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const created = ListsStorageService.createList(newListName.trim());
    setLists(prev => [...prev, created]);
    setSelectedListId(created.id);
    setIsCreatingNew(false);
    setNewListName('');
    handleAdd(created.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Save to My Lists"
      subtitle="Organize your personal skincare and appearance regimens"
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Product Brief */}
        <div className="p-4 rounded-2xl bg-beauty-cream/50 border border-beauty-muted-border flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl border border-beauty-muted-border bg-white shrink-0 overflow-hidden">
            <ProductImage
              product={product}
              className="w-full h-full"
              imageClassName="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-2xs font-semibold uppercase tracking-wider text-beauty-forest">
              {product.brand}
            </span>
            <h4 className="text-sm font-semibold text-beauty-charcoal-heading truncate">
              {product.name}
            </h4>
            <div className="flex items-baseline gap-2 mt-1 text-xs text-beauty-muted flex-wrap">
              {product.price !== null && product.price !== undefined ? (
                <>
                  <span className="font-serif font-semibold text-beauty-charcoal">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-2xs">(Ref. Price)</span>
                </>
              ) : (
                <span className="font-medium text-beauty-muted italic">
                  Price on Google
                </span>
              )}
              <span>•</span>
              <span>{product.variant || product.exactVariant || product.size}</span>
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 font-medium ${
              feedbackMsg.isError
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            }`}
          >
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* List Selector */}
        {!isCreatingNew ? (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-beauty-charcoal uppercase tracking-wider">
              Select Destination List
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {lists.map((list) => {
                const isSelected = selectedListId === list.id;
                const containsProduct = list.items.some(i => i.productId === product.id);

                return (
                  <button
                    key={list.id}
                    type="button"
                    onClick={() => {
                      setSelectedListId(list.id);
                      handleAdd(list.id);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-beauty-forest bg-beauty-cream/70 text-beauty-charcoal font-semibold shadow-2xs'
                        : 'border-beauty-muted-border bg-white hover:border-beauty-forest/60 text-beauty-charcoal-body'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-sm font-serif truncate">{list.name}</div>
                      <div className="text-2xs text-beauty-muted font-normal">
                        {list.items.length} {list.items.length === 1 ? 'item' : 'items'} saved
                      </div>
                    </div>
                    {containsProduct ? (
                      <span className="text-2xs px-2 py-0.5 rounded-full bg-beauty-cream text-beauty-muted font-normal shrink-0">
                        Already Saved
                      </span>
                    ) : (
                      <Bookmark className="w-4 h-4 text-beauty-muted shrink-0 group-hover:text-beauty-forest" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsCreatingNew(true)}
              className="w-full py-2.5 px-4 rounded-2xl border border-dashed border-beauty-muted-border text-xs font-semibold text-beauty-forest hover:bg-beauty-cream transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Named List</span>
            </button>
          </div>
        ) : (
          /* Create New List Inline Form */
          <form onSubmit={handleCreateAndAdd} className="space-y-3 p-4 rounded-2xl bg-white border border-beauty-muted-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-beauty-charcoal">
                Name Your New Regimen List
              </span>
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="text-2xs text-beauty-muted hover:text-beauty-charcoal underline"
              >
                Back to existing lists
              </button>
            </div>
            <input
              type="text"
              autoFocus
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="e.g. Evening Retinol Recovery Routine"
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-beauty-muted-border focus:outline-none focus:ring-1 focus:ring-beauty-forest bg-beauty-ivory"
            />
            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-3 py-1.5 rounded-full text-xs text-beauty-muted hover:text-beauty-charcoal"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newListName.trim()}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-colors disabled:opacity-50"
              >
                Create &amp; Save Product
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
