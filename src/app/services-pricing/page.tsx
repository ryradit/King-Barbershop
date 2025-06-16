
// src/app/services-pricing/page.tsx
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Scissors, ShoppingBag, Tag, ChevronRight, Star, Palette, Sparkles, Wind, Waves } from 'lucide-react';
import Link from 'next/link';

interface ServiceOrProductItem {
  id: string;
  nameKey: { en: string; id: string };
  descriptionKey: { en: string; id: string };
  priceKey: { en: string; id: string };
  icon?: React.ReactNode;
  isRecommended?: boolean;
}

const groomingServices: ServiceOrProductItem[] = [
  {
    id: 'hc_basic',
    nameKey: { en: 'Basic Package', id: 'Paket Basic' },
    descriptionKey: { 
      en: 'Includes: Hair Cut, Shaving.', 
      id: 'Termasuk: Potong Rambut, Cukur.' 
    },
    priceKey: { en: 'Rp 35,000', id: 'Rp 35.000' },
    icon: <Scissors className="h-6 w-6 text-primary" />
  },
  {
    id: 'hc_senior',
    nameKey: { en: 'Senior Package', id: 'Paket Senior' },
    descriptionKey: { 
      en: 'Includes: Hair Cut, Shaving, Hair Wash, Hair Tonic, Styling Pomade.', 
      id: 'Termasuk: Potong Rambut, Cukur, Cuci Rambut, Hair Tonic, Styling Pomade.' 
    },
    priceKey: { en: 'Rp 40,000', id: 'Rp 40.000' },
    icon: <Scissors className="h-6 w-6 text-primary" />
  },
  {
    id: 'hc_executive',
    nameKey: { en: 'Executive Package', id: 'Paket Executive' },
    descriptionKey: { 
      en: 'Includes: Hair Cut, Shaving, Hair Wash, Hair Tonic, Styling Pomade, Head Massage.', 
      id: 'Termasuk: Potong Rambut, Cukur, Cuci Rambut, Hair Tonic, Styling Pomade, Pijat Kepala.' 
    },
    priceKey: { en: 'Rp 45,000', id: 'Rp 45.000' },
    icon: <Scissors className="h-6 w-6 text-primary" />,
    isRecommended: true,
  },
  {
    id: 'shaving_only',
    nameKey: { en: 'Shaving', id: 'Cukur' },
    descriptionKey: { 
      en: 'Clean and precise shaving for face, mustache, and beard.', 
      id: 'Layanan cukur bersih dan presisi untuk wajah, kumis, dan jenggot.' 
    },
    priceKey: { en: 'Rp 25,000', id: 'Rp 25.000' },
    icon: <Sparkles className="h-6 w-6 text-primary" />
  },
  {
    id: 'head_massage_wash',
    nameKey: { en: 'Head Massage + Wash', id: 'Pijat Kepala + Cuci' },
    descriptionKey: { 
      en: 'Relaxing head massage followed by a refreshing hair wash.', 
      id: 'Pijat kepala yang menenangkan diikuti dengan cuci rambut yang menyegarkan.' 
    },
    priceKey: { en: 'Rp 30,000', id: 'Rp 30.000' },
    icon: <Wind className="h-6 w-6 text-primary" />
  },
  {
    id: 'hair_colour_black',
    nameKey: { en: 'Hair Colouring - Black', id: 'Pewarnaan Rambut - Hitam' },
    descriptionKey: { 
      en: 'Professional black hair colouring service.', 
      id: 'Layanan pewarnaan rambut hitam profesional.' 
    },
    priceKey: { en: 'Rp 95,000', id: 'Rp 95.000' },
    icon: <Palette className="h-6 w-6 text-primary" />
  },
  {
    id: 'hair_colour_bleaching',
    nameKey: { en: 'Hair Colouring - Bleaching', id: 'Pewarnaan Rambut - Bleaching' },
    descriptionKey: { 
      en: 'Hair bleaching process for lighter tones or pre-colouring.', 
      id: 'Proses bleaching rambut untuk warna lebih terang atau sebelum pewarnaan.' 
    },
    priceKey: { en: 'Rp 215,000', id: 'Rp 215.000' },
    icon: <Palette className="h-6 w-6 text-primary" />
  },
  {
    id: 'hair_colour_full',
    nameKey: { en: 'Hair Colouring - Full Colouring', id: 'Pewarnaan Rambut - Full Colour' },
    descriptionKey: { 
      en: 'Complete hair colouring with your choice of fashion colors.', 
      id: 'Pewarnaan rambut lengkap dengan pilihan warna fashion Anda.' 
    },
    priceKey: { en: 'Rp 300,000', id: 'Rp 300.000' },
    icon: <Palette className="h-6 w-6 text-primary" />
  },
  {
    id: 'perming',
    nameKey: { en: 'Perming', id: 'Perming (Keriting Rambut)' },
    descriptionKey: { 
      en: 'Chemical hair perming service to create curls or waves. Includes Hair Cut.', 
      id: 'Layanan keriting rambut kimiawi untuk menciptakan ikal atau gelombang. Termasuk Potong Rambut.' 
    },
    priceKey: { en: 'Rp 250,000', id: 'Rp 250.000' },
    icon: <Waves className="h-6 w-6 text-primary" />
  },
];

const groomingProducts: ServiceOrProductItem[] = [
  {
    id: 'prod_clay_small',
    nameKey: { en: 'Clay King Barbershop (Small)', id: 'Clay King Barbershop (Kecil)' },
    descriptionKey: {
      en: 'Styling clay for a strong hold and matte finish. Small size.',
      id: 'Clay penata rambut untuk pegangan kuat dan hasil matte. Ukuran kecil.',
    },
    priceKey: { en: 'Rp 35,000', id: 'Rp 35.000' },
    icon: <ShoppingBag className="h-6 w-6 text-primary" />,
  },
  {
    id: 'prod_hair_tonic_kb', 
    nameKey: { en: 'Hair Tonic King Barbershop', id: 'Hair Tonic King Barbershop' },
    descriptionKey: {
      en: 'Nourishing hair tonic to promote healthy scalp and hair.',
      id: 'Hair tonic menutrisi untuk meningkatkan kesehatan kulit kepala dan rambut.',
    },
    priceKey: { en: 'Rp 50,000', id: 'Rp 50.000' },
    icon: <ShoppingBag className="h-6 w-6 text-primary" />,
  },
  {
    id: 'prod_hair_powder',
    nameKey: { en: 'Hair Powder King Barbershop', id: 'Hair Powder King Barbershop' },
    descriptionKey: {
      en: 'Styling powder for volume, texture, and a natural look.',
      id: 'Bubuk penata rambut untuk volume, tekstur, dan tampilan alami.',
    },
    priceKey: { en: 'Rp 35,000', id: 'Rp 35.000' },
    icon: <ShoppingBag className="h-6 w-6 text-primary" />,
  },
];


export default function ServicesPricingPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in-0 duration-500">
      <section className="text-center py-8 bg-card rounded-lg shadow-lg animate-in fade-in-0 delay-100 duration-700">
        <h1 className="font-headline text-4xl font-bold text-primary">
          {t({ en: 'Our Services & Pricing', id: 'Layanan & Harga Kami' })}
        </h1>
        <p className="text-foreground/80 mt-2 max-w-2xl mx-auto">
          {t({ 
            en: 'Explore our range of professional barbering services and products. All prices are subject to change.', 
            id: 'Jelajahi berbagai layanan barber profesional dan produk kami. Semua harga dapat berubah sewaktu-waktu.' 
          })}
        </p>
      </section>

      {/* Grooming Services Section */}
      <section className="animate-in fade-in-0 slide-in-from-bottom-10 delay-200 duration-700">
        <h2 className="font-headline text-3xl font-bold text-center mb-8 text-primary">
          {t({ en: 'Grooming Services', id: 'Layanan Perawatan' })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groomingServices.map((service) => (
            <Card key={service.id} className="bg-card shadow-md hover:shadow-primary/20 transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3 mb-1">
                    {service.icon}
                    <CardTitle className="font-headline text-xl text-foreground">{t(service.nameKey)}</CardTitle>
                  </div>
                  {service.isRecommended && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/20 dark:bg-amber-400/10 px-2 py-0.5 rounded-full shrink-0">
                      <Star className="h-3.5 w-3.5 fill-amber-600 dark:fill-amber-400" />
                      <span>{t({ en: "Recommended", id: "Populer" })}</span>
                    </div>
                  )}
                </div>
                <CardDescription className="text-sm">{t(service.descriptionKey)}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <p className="font-semibold text-lg text-primary mt-2">{t(service.priceKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Men's Grooming Products Section */}
      <section className="animate-in fade-in-0 slide-in-from-bottom-10 delay-300 duration-700">
        <h2 className="font-headline text-3xl font-bold text-center mb-8 text-primary">
          {t({ en: "Men's Grooming Products", id: "Produk Perawatan Pria" })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groomingProducts.map((product) => (
            <Card key={product.id} className="bg-card shadow-md hover:shadow-primary/20 transition-shadow duration-300 flex flex-col">
              <CardHeader>
                 <div className="flex items-center gap-3 mb-1">
                    {product.icon}
                    <CardTitle className="font-headline text-xl text-foreground">{t(product.nameKey)}</CardTitle>
                  </div>
                <CardDescription className="text-sm">{t(product.descriptionKey)}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <p className="font-semibold text-lg text-primary mt-2">{t(product.priceKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center py-8 animate-in fade-in-0 delay-400 duration-700">
        <Button asChild size="lg" className="font-headline">
          <Link href="/book">
            {t({ en: 'Book Your Appointment Now', id: 'Pesan Janji Temu Anda Sekarang' })}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}

    
