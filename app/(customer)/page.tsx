'use client';
// app/(customer)/page.tsx — redesigned landing page with gradients

import Link from 'next/link';
import { Snowflake, Truck, Clock, Shield, ChevronRight, Star, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge }  from '@/components/ui/badge';
import { formatNaira } from '@/lib/utils';

const products = [
  { id: 'product-small-ice-block',       name: 'Small Ice Block',       sizeKg: 5,  price: 500,  tag: 'Popular',   gradient: 'from-sky-400 to-cyan-500' },
  { id: 'product-large-ice-block',       name: 'Large Ice Block',       sizeKg: 10, price: 1000, tag: 'Best Value', gradient: 'from-blue-500 to-indigo-600' },
  { id: 'product-extra-large-ice-block', name: 'Extra Large Ice Block', sizeKg: 25, price: 2200, tag: 'Commercial', gradient: 'from-violet-500 to-purple-600' },
];

const features = [
  { icon: Truck,  title: 'Fast Delivery',    desc: 'Same-day delivery available for orders placed before 12pm.', color: 'from-sky-500 to-blue-600' },
  { icon: Clock,  title: 'Always Fresh',     desc: 'Ice blocks produced daily for maximum quality and longevity.', color: 'from-emerald-500 to-teal-600' },
  { icon: Shield, title: 'Reliable Supply',  desc: 'Consistent production means your orders are always fulfilled.', color: 'from-violet-500 to-purple-600' },
  { icon: Zap,    title: 'Instant Booking',  desc: 'Place your order in seconds and track it in real time.', color: 'from-amber-500 to-orange-600' },
];

export default function CustomerHomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 dot-pattern opacity-25" />

        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-1.5 text-sm text-white font-medium mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Fresh ice delivered to your door
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Premium Ice Blocks,{' '}
              <span className="text-yellow-300">Delivered Fresh</span>
            </h1>

            <p className="mt-5 text-lg text-white/80 max-w-lg">
              Order high-quality ice blocks from FreezeFlow. Fast delivery,
              flexible pickup, guaranteed freshness every time.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"
                className="rounded-xl bg-white text-sky-600 hover:bg-white/90 font-bold shadow-xl hover:shadow-white/20 transition-all gap-2">
                <Link href="/products">
                  Order Now <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg"
                className="rounded-xl border-white/40 text-white hover:bg-white/15 backdrop-blur-sm font-semibold">
                <Link href="/orders">Track Order</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="ml-1 font-semibold text-white">4.9</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                200+ happy customers
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                Same-day delivery
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black">Why choose FreezeFlow?</h2>
            <p className="text-muted-foreground mt-2 text-sm">Built for businesses and homes across Nigeria</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl border border-border bg-muted/20 p-5 card-hover">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} mb-4 shadow-md`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-base mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="py-16 page-gradient">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black">Our Products</h2>
              <p className="text-muted-foreground mt-1 text-sm">Choose the right size for your needs</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 rounded-xl">
              <Link href="/products">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="group rounded-2xl overflow-hidden bg-white border border-border shadow-sm card-hover">
                {/* Gradient visual */}
                <div className={`relative h-44 bg-gradient-to-br ${product.gradient} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 dot-pattern opacity-20" />
                  <Snowflake className="h-20 w-20 text-white/40 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-full bg-white/25 backdrop-blur-sm border border-white/30 px-2.5 py-1 text-xs font-bold text-white">
                      {product.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center rounded-full bg-white/25 backdrop-blur-sm border border-white/30 px-2.5 py-1 text-xs font-semibold text-white">
                      {product.sizeKg}kg
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-base">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Premium quality ice block, ideal for cooling and preservation.
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Per block</p>
                      <p className="text-2xl font-black text-gradient">{formatNaira(product.price)}</p>
                    </div>
                    <Button asChild className="rounded-xl btn-gradient text-white border-0 shadow-md">
                      <Link href="/products">Order</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-blue-700 to-violet-700" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm text-white mb-5">
            <Zap className="h-3.5 w-3.5 text-yellow-300" />
            Get started in minutes
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">Ready to order?</h2>
          <p className="mt-3 text-white/75 max-w-md mx-auto">
            Sign up today and get your first order delivered fast. Fresh ice, every time.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg"
              className="rounded-xl bg-white text-blue-700 hover:bg-white/90 font-bold shadow-xl gap-2">
              <Link href="/customer-register">
                Create Account <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg"
              className="rounded-xl border-white/40 text-white hover:bg-white/15 font-semibold">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
