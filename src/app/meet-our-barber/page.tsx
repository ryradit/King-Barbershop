
// src/app/meet-our-barber/page.tsx
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Scissors, Star } from 'lucide-react';

interface Barber {
  id: string;
  name: string;
  specialtyKey: { en: string; id: string };
  bioKey: { en: string; id: string };
  imageUrl: string;
  aiHint: string;
  experience: number; // Years of experience
}

const barbersData: Barber[] = [
  {
    id: 'barber-daus',
    name: 'Daus',
    specialtyKey: { en: 'All-around Expert Stylist', id: 'Stylist Ahli Serba Bisa' },
    bioKey: { 
      en: 'Daus is a passionate and versatile barber with a keen eye for detail. He excels in a wide range of styles, from classic cuts to modern trends, ensuring every client gets a look they love.', 
      id: 'Daus adalah barber yang bersemangat dan serba bisa dengan perhatian tajam terhadap detail. Ia unggul dalam berbagai gaya, dari potongan klasik hingga tren modern, memastikan setiap klien mendapatkan tampilan yang mereka sukai.' 
    },
    imageUrl: '/images/dawus.jpg',
    aiHint: 'male barber Daus portrait',
    experience: 5, // Example experience
  },
];

export default function MeetOurBarberPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in-0 duration-500">
      <section className="text-center py-8 bg-card rounded-lg shadow-lg animate-in fade-in-0 delay-100 duration-700">
        <h1 className="font-headline text-4xl font-bold text-primary">
          {t({ en: 'Meet Our Barber', id: 'Temui Barber Kami' })}
        </h1>
        <p className="text-foreground/80 mt-2 max-w-2xl mx-auto">
          {t({ 
            en: 'Our talented and experienced barber is dedicated to providing you with the highest quality grooming services. Get to know the artist behind the chair.', 
            id: 'Barber kami yang berbakat dan berpengalaman berdedikasi untuk memberi Anda layanan grooming berkualitas tertinggi. Kenali seniman di balik kursi cukur.' 
          })}
        </p>
      </section>

      <div className="flex justify-center animate-in fade-in-0 slide-in-from-bottom-10 delay-200 duration-700">
        {barbersData.map((barber) => (
          <Card key={barber.id} className="bg-card shadow-md hover:shadow-primary/20 transition-shadow duration-300 flex flex-col overflow-hidden group max-w-sm">
            <div className="relative w-full aspect-square">
              <Image
                src={barber.imageUrl}
                alt={barber.name}
                data-ai-hint={barber.aiHint}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="font-headline text-2xl text-primary group-hover:underline">{barber.name}</CardTitle>
              <CardDescription className="flex items-center text-sm pt-1">
                <Scissors className="h-4 w-4 mr-2 text-muted-foreground" />
                {t(barber.specialtyKey)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(barber.bioKey)}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Star className="h-4 w-4 mr-1.5 text-amber-400 fill-amber-400" />
                <span>{t({en: `${barber.experience} years of experience`, id: `${barber.experience} tahun pengalaman`})}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
