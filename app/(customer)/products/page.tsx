// app/(customer)/products/page.tsx
import type { Metadata } from 'next';
import { Snowflake, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatNaira } from '@/lib/utils';

export const metadata: Metadata = { title: 'Products | FreezeFlow' };

const products = [
  {
    id: 'product-small-ice-block',
    name: 'Small Ice Block',
    sizeKg: 5,
    price: 500,
    isAvailable: true,
    description: 'Perfect for home use, small events, and everyday cooling. Lasts up to 12 hours in an insulated cooler.',
    uses: ['Home use', 'Small coolers', 'Drinks cooling'],
  },
  {
    id: 'product-large-ice-block',
    name: 'Large Ice Block',
    sizeKg: 10,
    price: 1000,
    isAvailable: true,
    description: 'Ideal for parties, restaurants, and commercial applications. Great value for bulk cooling needs.',
    uses: ['Parties', 'Restaurants', 'Fish preservation'],
  },
  {
    id: 'product-extra-large-ice-block',
    name: 'Extra Large Ice Block',
    sizeKg: 25,
    price: 2200,
    isAvailable: true,
    description: 'Heavy-duty ice for large-scale events, industrial use, and extended preservation requirements.',
    uses: ['Large events', 'Industrial use', 'Extended preservation'],
  },
];

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Our Ice Products</h1>
        <p className="text-muted-foreground mt-2">
          Fresh, high-quality ice blocks available for pickup or delivery.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
            {/* Visual */}
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
              <p className="text-sm text-muted-foreground mt-1 flex-1">{product.description}</p>

              {/* Use cases */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {product.uses.map((use) => (
                  <span
                    key={use}
                    className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {use}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Price per block</p>
                  <p className="text-2xl font-black text-primary">{formatNaira(product.price)}</p>
                </div>
                <Button disabled={!product.isAvailable} className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ordering info */}
      <div className="mt-12 rounded-xl bg-muted/50 p-6">
        <h3 className="font-bold text-base mb-2">How ordering works</h3>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Create an account or sign in</li>
          <li>Select your product and quantity</li>
          <li>Choose delivery or pickup</li>
          <li>Pay securely via card, bank transfer, or USSD</li>
          <li>Receive fresh ice at your doorstep or pick up from us</li>
        </ol>
      </div>
    </div>
  );
}
