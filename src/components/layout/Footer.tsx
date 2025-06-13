// src/components/layout/Footer.tsx
"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Clock } from 'lucide-react'; // Added Clock icon
import Link from 'next/link';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const address = "Jl. Mawar Raya No.27 Blok D2, RT.7/RW.12, Kutabumi, Kec. Ps. Kemis, Kabupaten Tangerang, Banten 15560";
  const operationalHours = "09:00 - 21:00";

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div>
            <h3 className="font-semibold text-foreground mb-2">{t({ en: 'King Barbershop - Kutabumi', id: 'King Barbershop - Kutabumi' })}</h3>
            <p>
              &copy; {currentYear} {t({ en: 'All rights reserved.', id: 'Hak cipta dilindungi.' })}
            </p>
            <p>
              {t({ en: 'Modern Barbershop in Indonesia', id: 'Barbershop Modern di Indonesia' })}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">{t({ en: 'Location', id: 'Lokasi' })}</h3>
            <p className="flex items-center justify-center md:justify-start">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
              <span>{address}</span>
            </p>
            <Link href="/contact" className="text-primary hover:underline mt-1 inline-block">
              {t({ en: 'View on Map', id: 'Lihat di Peta' })}
            </Link>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">{t({ en: 'Operational Hours', id: 'Jam Operasional' })}</h3>
            <p className="flex items-center justify-center md:justify-start">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
              <span>{operationalHours}</span>
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">{t({ en: 'Quick Links', id: 'Tautan Cepat' })}</h3>
            <ul className="space-y-1">
              <li><Link href="/gallery" className="hover:text-primary hover:underline">{t({ en: 'Gallery', id: 'Galeri' })}</Link></li>
              <li><Link href="/book" className="hover:text-primary hover:underline">{t({ en: 'Book Appointment', id: 'Pesan Janji' })}</Link></li>
              <li><Link href="/reviews" className="hover:text-primary hover:underline">{t({ en: 'Reviews', id: 'Ulasan' })}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
