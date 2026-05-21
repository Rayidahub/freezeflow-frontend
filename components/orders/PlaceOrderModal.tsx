'use client';
// components/orders/PlaceOrderModal.tsx

import { useState, useEffect } from 'react';
import { Loader2, MapPin, ShoppingBag } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { formatNaira } from '@/lib/utils';
import { Product, PlaceOrderDto } from '@/types';

interface PlaceOrderModalProps {
  open:         boolean;
  onClose:      () => void;
  onSubmit:     (data: PlaceOrderDto) => Promise<void>;
  isSubmitting: boolean;
  product:      Product | null;
  serverError?: string | null;
  defaultAddress?: string | null;
}

export function PlaceOrderModal({
  open, onClose, onSubmit, isSubmitting,
  product, serverError, defaultAddress,
}: PlaceOrderModalProps) {
  const [quantity,         setQuantity]         = useState('1');
  const [deliveryMethod,   setDeliveryMethod]   = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress,  setDeliveryAddress]  = useState('');
  const [specialNotes,     setSpecialNotes]     = useState('');
  const [validationError,  setValidationError]  = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setQuantity('1');
      setDeliveryMethod('delivery');
      setDeliveryAddress(defaultAddress ?? '');
      setSpecialNotes('');
      setValidationError(null);
    }
  }, [open, defaultAddress]);

  const qty        = Math.max(1, parseInt(quantity) || 1);
  const totalPrice = (product?.price ?? 0) * qty;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    if (qty < 1) { setValidationError('Quantity must be at least 1'); return; }
    if (deliveryMethod === 'delivery' && !deliveryAddress.trim()) {
      setValidationError('Please enter a delivery address'); return;
    }

    await onSubmit({
      productId:            product!.id,
      quantity:             qty,
      deliveryMethod,
      deliveryAddress:      deliveryMethod === 'delivery' ? deliveryAddress.trim() : undefined,
      specialInstructions:  specialNotes.trim() || undefined,
    });
  }

  const displayError = validationError || serverError;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Place Order
          </DialogTitle>
          <DialogDescription>
            {product ? `${product.name} — ${product.sizeKg}kg block` : ''}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {displayError && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
              {displayError}
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-1.5">
            <Label htmlFor="order-qty">Quantity</Label>
            <Input
              id="order-qty" type="number"
              min={1} max={999} value={quantity}
              onChange={(e) => { setQuantity(e.target.value); setValidationError(null); }}
              disabled={isSubmitting}
            />
          </div>

          {/* Delivery method toggle */}
          <div className="space-y-1.5">
            <Label>Delivery Method</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['delivery', 'pickup'] as const).map((m) => (
                <button
                  key={m} type="button"
                  onClick={() => setDeliveryMethod(m)}
                  className={`rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
                    deliveryMethod === m
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {m === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                </button>
              ))}
            </div>
          </div>

          {/* Address — only shown for delivery */}
          {deliveryMethod === 'delivery' && (
            <div className="space-y-1.5">
              <Label htmlFor="order-address" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Delivery Address
              </Label>
              <textarea
                id="order-address"
                value={deliveryAddress}
                onChange={(e) => { setDeliveryAddress(e.target.value); setValidationError(null); }}
                disabled={isSubmitting}
                placeholder="Enter your full delivery address"
                rows={2}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 resize-none"
              />
            </div>
          )}

          {/* Special instructions */}
          <div className="space-y-1.5">
            <Label htmlFor="order-notes">
              Special Instructions <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="order-notes"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. Call when arriving"
            />
          </div>

          {/* Order total preview */}
          <div className="rounded-lg bg-muted/50 border border-border p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Order Total</p>
              <p className="text-xl font-black text-primary">{formatNaira(totalPrice)}</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>{qty} × {formatNaira(product?.price ?? 0)}</p>
              <p className="mt-0.5 capitalize">{deliveryMethod}</p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !product}>
              {isSubmitting
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Placing order…</>
                : 'Confirm Order'
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
