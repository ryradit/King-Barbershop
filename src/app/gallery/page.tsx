
// src/app/gallery/page.tsx
"use client";

import Image from 'next/image';
import { useState, type ChangeEvent, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic'; 
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { allHaircuts, filterOptionsConfig, type Haircut } from '@/lib/haircutData'; // Use filterOptionsConfig
import { Filter, X, Type, UserCheck, Palette, Loader2, View, ChevronLeft, ChevronRight } from 'lucide-react';

const HaircutModelViewer = dynamic(() => import('@/components/ui/HaircutModelViewer'), {
  ssr: false, 
  loading: () => (
    <div className="w-full h-[400px] flex flex-col items-center justify-center bg-muted/30 rounded-md">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-2 text-sm text-muted-foreground">Loading 3D Model...</p>
    </div>
  ),
});


export default function GalleryPage() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [hairTypeFilter, setHairTypeFilter] = useState('all'); // Canonical value
  const [faceShapeFilter, setFaceShapeFilter] = useState('all'); // Canonical value
  const [styleFilter, setStyleFilter] = useState('all'); // Canonical value

  const [selectedHaircut, setSelectedHaircut] = useState<Haircut | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [show3DModel, setShow3DModel] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Reset filters to 'all' when language changes to ensure consistency
    setHairTypeFilter('all');
    setFaceShapeFilter('all');
    setStyleFilter('all');
  }, [language]);

  useEffect(() => {
    if (isModalOpen && selectedHaircut) {
      setCurrentImageIndex(0); 
      setShow3DModel(!!selectedHaircut.modelUrl); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, selectedHaircut]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleHaircutClick = (haircut: Haircut) => {
    setSelectedHaircut(haircut);
    setIsModalOpen(true);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => Math.max(0, prev - 1));
  };
  const handleNextImage = () => {
    if (selectedHaircut && selectedHaircut.images) {
      setCurrentImageIndex(prev => Math.min(selectedHaircut.images.length - 1, prev + 1));
    }
  };

  const definedFilters = [
    { labelKey: { en: 'Hair Type', id: 'Jenis Rambut' }, value: hairTypeFilter, setter: setHairTypeFilter, optionsCategory: 'hairType' as keyof typeof filterOptionsConfig },
    { labelKey: { en: 'Face Shape', id: 'Bentuk Wajah' }, value: faceShapeFilter, setter: setFaceShapeFilter, optionsCategory: 'faceShape' as keyof typeof filterOptionsConfig },
    { labelKey: { en: 'Style', id: 'Gaya' }, value: styleFilter, setter: setStyleFilter, optionsCategory: 'style' as keyof typeof filterOptionsConfig },
  ];

  const filteredHaircuts = allHaircuts.filter(haircut => {
    const name = t(haircut.nameKey).toLowerCase();
    const term = searchTerm.toLowerCase();
    
    const hairTypeMatch = hairTypeFilter === 'all' ||
                          haircut.hairType.toLowerCase() === 'any' ||
                          haircut.hairType.toLowerCase() === hairTypeFilter;

    const faceShapeMatch = faceShapeFilter === 'all' ||
                           haircut.faceShape.toLowerCase() === 'any' ||
                           haircut.faceShape.toLowerCase() === faceShapeFilter;

    const styleMatch = styleFilter === 'all' ||
                       haircut.style.toLowerCase() === styleFilter;
    
    return name.includes(term) && hairTypeMatch && faceShapeMatch && styleMatch;
  });

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      <section className="text-center py-8 bg-card rounded-lg shadow-lg animate-in fade-in-0 delay-100 duration-700">
        <h1 className="font-headline text-4xl font-bold text-primary">
          {t({ en: 'Haircut Gallery', id: 'Galeri Potongan Rambut' })}
        </h1>
        <p className="text-foreground/80 mt-2">
          {t({ en: 'Explore a variety of trendy men\'s hairstyles.', id: 'Jelajahi berbagai gaya rambut pria yang sedang tren.' })}
        </p>
      </section>

      <Card className="p-6 bg-card shadow-md animate-in fade-in-0 delay-200 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label htmlFor="search" className="text-sm font-medium">{t({ en: 'Search Style', id: 'Cari Gaya' })}</label>
            <Input
              id="search"
              type="text"
              placeholder={t({ en: 'e.g., Undercut', id: 'mis., Undercut' })}
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-background/50"
            />
          </div>
          
          {definedFilters.map(filter => (
            <div key={filter.optionsCategory} className="space-y-1">
              <label className="text-sm font-medium">{t(filter.labelKey)}</label>
              <Select value={filter.value} onValueChange={filter.setter}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder={t(filterOptionsConfig[filter.optionsCategory].find(opt => opt.value === 'all')!.labelKey)} />
                </SelectTrigger>
                <SelectContent>
                  {filterOptionsConfig[filter.optionsCategory].map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{t(opt.labelKey)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </Card>

      {filteredHaircuts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in-0 slide-in-from-bottom-10 delay-300 duration-700">
          {filteredHaircuts.map((haircut) => (
            <div key={haircut.id} onClick={() => handleHaircutClick(haircut)} className="cursor-pointer">
              <Card className="overflow-hidden shadow-lg hover:shadow-primary/30 transition-shadow duration-300 bg-card h-full flex flex-col group">
                <div className="relative aspect-square w-full">
                  <Image
                    src={haircut.images[0]} 
                    alt={t(haircut.nameKey)}
                    data-ai-hint={haircut.aiHint}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline text-lg font-semibold text-primary group-hover:underline">{t(haircut.nameKey)}</h3>
                    <div className="text-xs text-muted-foreground mt-1">
                      <p>{t({en: "Hair Type", id: "Jenis Rambut"})}: {t(filterOptionsConfig.hairType.find(opt => opt.value === haircut.hairType)?.labelKey || {en: haircut.hairType, id: haircut.hairType})}</p>
                      <p>{t({en: "Face Shape", id: "Bentuk Wajah"})}: {t(filterOptionsConfig.faceShape.find(opt => opt.value === haircut.faceShape)?.labelKey || {en: haircut.faceShape, id: haircut.faceShape})}</p>
                      <p>{t({en: "Style", id: "Gaya"})}: {t(filterOptionsConfig.style.find(opt => opt.value === haircut.style)?.labelKey || {en: haircut.style, id: haircut.style})}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 animate-in fade-in-0 delay-300 duration-700">
          <p className="text-xl text-muted-foreground">{t({ en: 'No haircuts found matching your criteria.', id: 'Tidak ada potongan rambut yang sesuai dengan kriteria Anda.' })}</p>
        </div>
      )}

      {selectedHaircut && (
        <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) { setShow3DModel(false); setCurrentImageIndex(0); } }}>
          <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] bg-card text-card-foreground p-0">
            <DialogHeader className="p-6 pb-2 flex flex-row justify-between items-center">
              <DialogTitle className="font-headline text-2xl sm:text-3xl text-primary">{t(selectedHaircut.nameKey)}</DialogTitle>
              {selectedHaircut.modelUrl && (
                <Button variant="outline" size="sm" onClick={() => setShow3DModel(!show3DModel)} className="ml-auto mr-10">
                  <View className="h-4 w-4 mr-2" />
                  {show3DModel ? t({en: "Show 2D Image", id: "Tampil Gambar 2D"}) : t({en: "Show 3D Model", id: "Tampil Model 3D"})}
                </Button>
              )}
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>
            <div className="p-6 pt-0 space-y-6 max-h-[80vh] overflow-y-auto">
              {show3DModel && selectedHaircut.modelUrl ? (
                <Suspense fallback={ 
                  <div className="w-full h-[400px] flex flex-col items-center justify-center bg-muted/30 rounded-md">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground">{t({en: "Loading 3D Model...", id: "Memuat Model 3D..."})}</p>
                  </div>
                }>
                  <HaircutModelViewer modelUrl={selectedHaircut.modelUrl} />
                </Suspense>
              ) : (
                selectedHaircut.images && selectedHaircut.images.length > 0 && (
                  <div className="relative w-full aspect-square rounded-md overflow-hidden group shadow-md">
                    <Image
                      src={selectedHaircut.images[currentImageIndex]}
                      alt={`${t(selectedHaircut.nameKey)} - Image ${currentImageIndex + 1}`}
                      data-ai-hint={`${selectedHaircut.aiHint} hairstyle detail`}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority
                      className="transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      key={selectedHaircut.images[currentImageIndex]}
                    />
                    {selectedHaircut.images.length > 1 && (
                      <>
                        <Button
                          onClick={handlePrevImage}
                          disabled={currentImageIndex === 0}
                          variant="outline"
                          size="icon"
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90 text-foreground"
                          aria-label={t({en: "Previous Image", id: "Gambar Sebelumnya"})}
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                          onClick={handleNextImage}
                          disabled={currentImageIndex === selectedHaircut.images.length - 1}
                          variant="outline"
                          size="icon"
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90 text-foreground"
                          aria-label={t({en: "Next Image", id: "Gambar Berikutnya"})}
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                          {currentImageIndex + 1} / {selectedHaircut.images.length}
                        </div>
                      </>
                    )}
                  </div>
                )
              )}
              
              <div>
                <h3 className="font-semibold text-xl mb-3 text-foreground/90 border-b pb-2">{t({ en: 'Details', id: 'Rincian' })}</h3>
                <ul className="space-y-3 text-muted-foreground text-base">
                  <li className="flex items-center">
                    <Type className="h-5 w-5 mr-3 text-primary/90 flex-shrink-0" />
                    <span><strong>{t({ en: 'Hair Type', id: 'Jenis Rambut' })}:</strong> {t(filterOptionsConfig.hairType.find(opt => opt.value === selectedHaircut.hairType)?.labelKey || {en: selectedHaircut.hairType, id: selectedHaircut.hairType})}</span>
                  </li>
                  <li className="flex items-center">
                    <UserCheck className="h-5 w-5 mr-3 text-primary/90 flex-shrink-0" />
                    <span><strong>{t({ en: 'Face Shape', id: 'Bentuk Wajah' })}:</strong> {t(filterOptionsConfig.faceShape.find(opt => opt.value === selectedHaircut.faceShape)?.labelKey || {en: selectedHaircut.faceShape, id: selectedHaircut.faceShape})}</span>
                  </li>
                  <li className="flex items-center">
                    <Palette className="h-5 w-5 mr-3 text-primary/90 flex-shrink-0" />
                    <span><strong>{t({ en: 'Style Category', id: 'Kategori Gaya' })}:</strong> {t(filterOptionsConfig.style.find(opt => opt.value === selectedHaircut.style)?.labelKey || {en: selectedHaircut.style, id: selectedHaircut.style})}</span>
                  </li>
                </ul>
              </div>
              
              <div className="pt-4">
                <h3 className="font-semibold text-xl mb-3 text-foreground/90 border-b pb-2">{t({ en: 'Description', id: 'Deskripsi' })}</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {t({ 
                    en: `The ${t(selectedHaircut.nameKey)} is a distinguished ${t(filterOptionsConfig.style.find(opt => opt.value === selectedHaircut.style)?.labelKey || {en: selectedHaircut.style, id: selectedHaircut.style}).toLowerCase()} hairstyle. It's particularly well-suited for individuals with ${selectedHaircut.hairType === 'any' ? 'any hair type' : `${t(filterOptionsConfig.hairType.find(opt => opt.value === selectedHaircut.hairType)?.labelKey || {en: selectedHaircut.hairType, id: selectedHaircut.hairType}).toLowerCase()} hair`} and complements ${selectedHaircut.faceShape === 'any' ? 'various face shapes' : `${t(filterOptionsConfig.faceShape.find(opt => opt.value === selectedHaircut.faceShape)?.labelKey || {en: selectedHaircut.faceShape, id: selectedHaircut.faceShape}).toLowerCase()} face shapes`}. This style is known for its [insert unique characteristic, e.g., clean lines, textured look, voluminous top]. For maintenance, [insert brief maintenance tip, e.g., regular trims are recommended, or it requires specific styling products]. Ask our barbers for advice on how to achieve and maintain this look!`, 
                    id: `${t(selectedHaircut.nameKey)} adalah gaya rambut ${t(filterOptionsConfig.style.find(opt => opt.value === selectedHaircut.style)?.labelKey || {en: selectedHaircut.style, id: selectedHaircut.style}).toLowerCase()} yang menawan. Sangat cocok untuk individu dengan ${selectedHaircut.hairType === 'any' ? 'semua jenis rambut' : `rambut ${t(filterOptionsConfig.hairType.find(opt => opt.value === selectedHaircut.hairType)?.labelKey || {en: selectedHaircut.hairType, id: selectedHaircut.hairType}).toLowerCase()}`} dan melengkapi ${selectedHaircut.faceShape === 'any' ? 'berbagai bentuk wajah' : `bentuk wajah ${t(filterOptionsConfig.faceShape.find(opt => opt.value === selectedHaircut.faceShape)?.labelKey || {en: selectedHaircut.faceShape, id: selectedHaircut.faceShape}).toLowerCase()}`}. Gaya ini dikenal karena [masukkan karakteristik unik, mis., garis yang rapi, tampilan bertekstur, bagian atas yang bervolume]. Untuk perawatan, [masukkan tips perawatan singkat, mis., pemangkasan rutin direkomendasikan, atau memerlukan produk penataan khusus]. Tanyakan pada barber kami untuk saran cara mendapatkan dan menjaga tampilan ini!` 
                  })}
                </p>
              </div>
            </div>
             <div className="p-6 pt-0 flex justify-end">
                <DialogClose asChild>
                    <Button variant="outline">{t({en: "Close", id: "Tutup"})}</Button>
                </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
