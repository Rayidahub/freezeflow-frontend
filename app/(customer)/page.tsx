// app/(customer)/page.tsx
// Customer-facing landing/home page

import Link from 'next/link';
import { Snowflake, Truck, Clock, Shield, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNaira } from '@/lib/utils';

const products = [
  {
    id: 'product-small-ice-block',
    name: 'Small Ice Block',
    sizeKg: 5,
    price: 500,
    isAvailable: true,
    description: 'Perfect for home use, small events and everyday cooling needs.',
  },
  {
    id: 'product-large-ice-block',
    name: 'Large Ice Block',
    sizeKg: 10,
    price: 1000,
    isAvailable: true,
    description: 'Ideal for parties, restaurants, and commercial applications.',
  },
  {
    id: 'product-extra-large-ice-block',
    name: 'Extra Large Ice Block',
    sizeKg: 25,
    price: 2200,
    isAvailable: true,
    description: 'Heavy-duty ice for large-scale events and industrial use.',
  },
];

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Same-day delivery available for orders placed before 12pm.',
  },
  {
    icon: Clock,
    title: 'Always Fresh',
    description: 'Ice blocks produced daily for maximum quality and longevity.',
  },
  {
    icon: Shield,
    title: 'Reliable Supply',
    description: 'Consistent production means your orders are always fulfilled.',
  },
];

export default function CustomerHomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative ice-gradient py-20 md:py-28 overflow-hidden">
        {/* Decorative ice crystal shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-20 opacity-10">
            <Snowflake className="h-40 w-40 text-primary" />
          </div>
          <div className="absolute bottom-10 left-10 opacity-5">
            <Snowflake className="h-64 w-64 text-primary" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl">
            <Badge variant="info" className="mb-4">
              ❄️ Fresh ice delivered to your door
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight">
              Premium Ice Blocks,{' '}
              <span className="text-primary">Delivered Fresh</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Order high-quality ice blocks directly from FreezeFlow. Fast delivery,
              flexible pickup options, and guaranteed freshness every time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/products">
                  Order Now <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/orders">Track Order</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="font-medium">4.9 rating</span>
              </div>
              <div>200+ happy customers</div>
              <div>Same-day delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Our Products</h2>
              <p className="text-muted-foreground mt-1">Choose the right ice block for your needs</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/products">View All</Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {/* Ice block visual placeholder */}
                <div className="h-40 bg-gradient-to-br from-brand-100 to-ice-200 flex items-center justify-center">
                  <Snowflake className="h-16 w-16 text-brand-400 opacity-60" />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{product.sizeKg}kg block</p>
                    </div>
                    <Badge variant={product.isAvailable ? 'success' : 'destructive'}>
                      {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-black text-primary">{formatNaira(product.price)}</span>
                    <Button size="sm" disabled={!product.isAvailable}>
                      Order Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to order?</h2>
          <p className="mt-2 text-primary-foreground/80 max-w-md mx-auto">
            Sign up today and get your first order delivered fast. Fresh ice, every time.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link href="/register">Create Account</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
