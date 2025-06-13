// src/components/layout/Navbar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Menu, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', labelKey: { en: 'Home', id: 'Beranda' } },
  { href: '/gallery', labelKey: { en: 'Gallery', id: 'Galeri' } },
  { href: '/book', labelKey: { en: 'Book Appointment', id: 'Pesan Janji' } },
  { href: '/reviews', labelKey: { en: 'Reviews', id: 'Ulasan' } },
  { href: '/contact', labelKey: { en: 'Contact', id: 'Kontak' } },
];

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomepage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20); // Adjust threshold as needed
    };

    if (isHomepage) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Call on mount to set initial state
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setIsScrolled(true); // Non-homepage, navbar is always solid
    }
  }, [isHomepage, pathname]);

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'id' : 'en'));
  };

  const NavLinkItems = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors",
            isMobile && "block py-2 text-lg",
            (isHomepage && !isScrolled && !isMobile) // Specific styling for desktop transparent navbar
              ? (pathname === link.href ? "text-primary" : "text-gray-200 hover:text-white")
              : (pathname === link.href ? "text-primary" : "text-foreground/80 hover:text-primary")
          )}
        >
          {t(link.labelKey)}
        </Link>
      ))}
    </>
  );

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-colors duration-300 ease-in-out",
        (isHomepage && !isScrolled)
          ? "bg-transparent border-b-transparent"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40"
      )}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Scissors className={cn(
            "h-6 w-6",
            (isHomepage && !isScrolled) ? "text-primary" : "text-primary" // Keep Scissors icon primary
          )} />
          <span className={cn(
            "font-headline text-xl font-bold",
            (isHomepage && !isScrolled) ? "text-white" : "text-foreground"
          )}>
            King Barbershop - Kutabumi
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <NavLinkItems />
        </nav>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className={cn(
              (isHomepage && !isScrolled) ? "text-white hover:bg-white/10" : "text-foreground/80 hover:bg-accent"
            )}
          >
            <Globe className="h-5 w-5" />
            <span className={cn(
              "ml-2 text-xs uppercase",
               (isHomepage && !isScrolled) ? "text-white" : "text-foreground/80"
            )}>{language}</span>
          </Button>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn((isHomepage && !isScrolled) ? "text-white hover:bg-white/10" : "text-foreground/80 hover:bg-accent")}>
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-background">
                <div className="p-6">
                  <Link href="/" className="flex items-center space-x-2 mb-6">
                    <Scissors className="h-6 w-6 text-primary" />
                    <span className="font-headline text-xl font-bold text-foreground">King Barbershop - Kutabumi</span>
                  </Link>
                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => ( // Re-rendering links for mobile with standard colors
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "block py-2 text-lg font-medium transition-colors",
                          pathname === link.href ? "text-primary" : "text-foreground/80 hover:text-primary"
                        )}
                      >
                        {t(link.labelKey)}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
