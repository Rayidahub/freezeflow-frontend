// app/(customer)/products/page.tsx
// Live products fetched from API. Authenticated customers can place orders.
'use client';

import { useState, useEffect } from 'react';
import { Snowflake, ShoppingCart, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge }  from '@/components/ui/badge';
import { PlaceOrderModal } from '@/components/orders/PlaceOrderModal';
import { useToast } from '@/components/ui/toast';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useOrderMutations } from '@/hooks/useOrders';
import { productsApi } from '@/lib/api';
import { formatNaira } from '@/lib/utils';
import { Product, PlaceOrderDto } from '@/types';
import Link from 'next/link';

export default function ProductsPage() {
  const { isAuthenticated, customer } = useCustomerAuth();
  const { toast } = useToast();
  const { placeOrder, isSubmitting, error: orderError, setError } = useOrderMutations();

  const [products,       setProducts]       = useState<Product[]>([]);
  const [isLoading,      setIsLoading]      = useState(true);
  const [loadError,      setLoadError]      = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen,      setModalOpen]      = useState(false);

  useEffect(() => {
    productsApi.getAll()
      .then((res) => { if (res.data) setProducts(res.data); })
      .catch(() => setLoadError('Failed to load products. Please try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  function handleOrderClick(product: Product) {
    if (!isAuthenticated) {
      toast('Please sign in to place an order', 'info');
      return;
    }
    setSelectedProduct(product);
    setError(null);
    setModalOpen(true);
  }

  async function handlePlaceOrder(data: PlaceOrderDto) {
    const order = await placeOrder(data);
    if (order) {
      toast('Order placed successfully! 🎉', 'success');
      setModalOpen(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Our Ice Products</h1>
        <p className="text-muted-foreground mt-2">
          Fresh, high-quality ice blocks available for pickup or delivery.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {loadError && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
          {loadError}
        </div>
      )}

      {!isLoading && !loadError && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-brand-100 via-ice-100 to-brand-200 flex items-center justify-center relative">
                <Snowflake className="h-20 w-20 text-brand-400/60" />
                <div className="absolute top-3 right-3">
                  <Badge variant={product.isAvailable ? 'success' : 'destructive'}>
                    {product.isAvailable ? '✓ In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary">{product.sizeKg}kg</Badge>
                </div>
              </div>

              <CardContent className="p-5 flex flex-col flex-1">
                <h2 className="font-bold text-lg">{product.name}</h2>
                <p className="text-sm text-muted-foreground mt-1 flex-1">
                  Premium quality ice block, ideal for cooling and preservation.
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Price per block</p>
                    <p className="text-2xl font-black text-primary">{formatNaira(product.price)}</p>
                  </div>
                  <Button
                    disabled={!product.isAvailable || isSubmitting}
                    onClick={() => handleOrderClick(product)}
                    className="gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isAuthenticated && !isLoading && (
        <div className="mt-10 rounded-xl bg-muted/50 border border-border p-6 text-center">
          <p className="font-medium">Want to place an order?</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create an account or sign in to get started.
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/customer-login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/customer-register">Create Account</Link>
            </Button>
          </div>
        </div>
      )}

      <PlaceOrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handlePlaceOrder}
        isSubmitting={isSubmitting}
        product={selectedProduct}
        serverError={orderError}
        defaultAddress={customer?.deliveryAddress}
      />
    </div>
  );
}
