
// src/app/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ChevronRight, Clock, MapPin, Scissors } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';

const bannerImagesData = [
  {
    src: '/images/bannerimage1.png',
    altKey: { en: 'King Barbershop Banner - Interior View', id: 'Spanduk King Barbershop - Tampak Dalam' },
    aiHint: 'barbershop interior salon',
  },
  {
    src: '/images/bannerimage2.png',
    altKey: { en: 'King Barbershop Banner - Stylish Exterior', id: 'Spanduk King Barbershop - Eksterior Bergaya' },
    aiHint: 'modern barbershop exterior',
  },
];

const featuredHaircutsData = [
  {
    src: '/images/pompadour/pompadour.jpg',
    altKey: { en: 'Pompadour Hairstyle', id: 'Gaya Rambut Pompadour' },
    aiHint: 'mens pompadour',
  },
  {
    src: '/images/buzzcut/buzzcut.jpg',
    altKey: { en: 'Buzz Cut Hairstyle', id: 'Gaya Rambut Buzz Cut' },
    aiHint: 'buzz cut',
  },
  {
    src: '/images/frenchcrop/frenchcrop2.jpg',
    altKey: { en: 'French Crop Hairstyle', id: 'Gaya Rambut French Crop' },
    aiHint: 'french crop',
  },
  {
    src: '/images/curtain/curtain.jpg',
    altKey: { en: 'Curtain Hairstyle', id: 'Gaya Rambut Curtain' },
    aiHint: 'curtain hairstyle',
  },
];

export default function Home() {
  const { t } = useLanguage();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBannerIndex(prevIndex => (prevIndex + 1) % bannerImagesData.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const services = [
    { 
      icon: <Scissors className="h-8 w-8 text-primary" />, 
      titleKey: { en: 'Trendy Haircuts', id: 'Potongan Rambut Trendy' },
      descriptionKey: { en: 'Get the latest styles from our expert barbers.', id: 'Dapatkan gaya terbaru dari barber ahli kami.' }
    },
    { 
      icon: <Clock className="h-8 w-8 text-primary" />, 
      titleKey: { en: 'Easy Booking', id: 'Pemesanan Mudah' },
      descriptionKey: { en: 'Book your appointment online in minutes.', id: 'Pesan janji Anda secara online dalam hitungan menit.' }
    },
    { 
      icon: <MapPin className="h-8 w-8 text-primary" />, 
      titleKey: { en: 'Prime Location', id: 'Lokasi Utama' },
      descriptionKey: { en: 'Conveniently located in the heart of the city.', id: 'Berlokasi strategis di pusat kota.' }
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in-0 duration-500">
      {/* Hero Section with Full-Bleed Banner */}
      <div className="relative w-screen -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-container px-0 -mt-8 h-[60vh] min-h-[400px] max-h-[600px] mb-16">
        <Image
          key={bannerImagesData[currentBannerIndex].src} // Important for re-rendering on src change
          src={bannerImagesData[currentBannerIndex].src}
          alt={t(bannerImagesData[currentBannerIndex].altKey)}
          fill
          style={{ objectFit: 'cover' }}
          priority={currentBannerIndex === 0} // Prioritize the first image for LCP
          data-ai-hint={bannerImagesData[currentBannerIndex].aiHint}
          sizes="100vw"
          className="-z-10 transition-opacity duration-1000 ease-in-out" // Basic opacity transition
        />
        <div className="absolute inset-0 bg-black/40 -z-10"></div>

        <div className="relative z-0 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white animate-in fade-in-0 delay-300 duration-700">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6">
            King Barbershop - Kutabumi
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl mb-8">
            {t({ 
              en: 'Experience the finest men\'s grooming in Indonesia. Modern styles, expert barbers, and a relaxing atmosphere await you.', 
              id: 'Rasakan perawatan pria terbaik di Indonesia. Gaya modern, barber ahli, dan suasana santai menanti Anda.' 
            })}
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="font-headline bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/book">
                {t({ en: 'Book Now', id: 'Pesan Sekarang' })}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-headline text-white border-white hover:bg-white/10 hover:text-white">
              <Link href="/gallery">
                {t({ en: 'View Gallery', id: 'Lihat Galeri' })}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="w-full mb-16 animate-in fade-in-0 slide-in-from-bottom-10 delay-200 duration-500">
        <h2 className="font-headline text-3xl font-bold text-center mb-10 text-primary">
          {t({ en: 'Our Services', id: 'Layanan Kami' })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-card shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader className="items-center">
                {service.icon}
                <CardTitle className="mt-4 font-headline text-xl">{t(service.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>{t(service.descriptionKey)}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-20 bg-card rounded-lg shadow-xl mb-16 animate-in fade-in-0 slide-in-from-bottom-10 delay-300 duration-500">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="font-headline text-3xl font-bold mb-4">
            {t({ en: 'Ready for a Fresh Look?', id: 'Siap Tampil Beda?' })}
          </h2>
          <p className="text-foreground/80 md:text-lg mb-8 max-w-2xl mx-auto">
            {t({ 
              en: 'Our AI Assistant can help you find the perfect style or book your next appointment. Try it using the icon at the bottom-right!', 
              id: 'Asisten AI kami dapat membantu Anda menemukan gaya yang sempurna atau memesan janji temu berikutnya. Coba melalui ikon di kanan bawah!' 
            })}
          </p>
          <Button size="lg" className="font-headline" disabled>
            {t({ en: 'AI Assistant Available', id: 'Asisten AI Tersedia' })}
          </Button>
        </div>
      </section>
      
      {/* Featured Haircuts Section */}
      <section className="w-full mb-16 animate-in fade-in-0 slide-in-from-bottom-10 delay-400 duration-500">
        <h2 className="font-headline text-3xl font-bold text-center mb-10 text-primary">
          {t({ en: "Featured Haircuts", id: "Gaya Rambut Unggulan" })}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredHaircutsData.map((haircut, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
              <Image 
                src={haircut.src} 
                alt={t(haircut.altKey)}
                data-ai-hint={haircut.aiHint}
                fill
                style={{objectFit: 'cover'}}
                className="hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
         <div className="text-center mt-8">
            <Button asChild variant="link" className="text-primary hover:text-accent font-headline">
              <Link href="/gallery">
                {t({ en: "View All Styles", id: "Lihat Semua Gaya" })} <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
      </section>
    </div>
  );
}
