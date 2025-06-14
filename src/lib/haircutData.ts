
// src/lib/haircutData.ts

export interface Haircut {
  id: number;
  nameKey: { en: string; id: string };
  images: string[];
  modelUrl?: string;
  hairType: string; // Canonical English values: 'straight', 'curly', 'wavy', 'any'
  faceShape: string; // Canonical English values: 'round', 'square', 'oval', 'any'
  style: string; // Canonical English values: 'modern', 'classic', 'trendy', 'minimalist'
  aiHint: string;
}

export const allHaircuts: Haircut[] = [
  { 
    id: 1, 
    nameKey: { en: 'Classic Fade', id: 'Fade Klasik' }, 
    images: [
      '/images/classicfade/fade.jpg', 
      '/images/classicfade/fade2.jpg',
      '/images/classicfade/fade3.jpg',
    ], 
    modelUrl: '/models/fade.glb', 
    hairType: 'straight', 
    faceShape: 'oval', 
    style: 'classic', 
    aiHint: 'mens fade' 
  },
  { 
    id: 2, 
    nameKey: { en: 'Modern Undercut', id: 'Undercut Modern' }, 
    images: [
      '/images/undercut/undercut2.jpg',
      '/images/undercut/undercut3.jpg',
      '/images/undercut/undercut4.jpg',
    ], 
    modelUrl: '/models/undercut.glb', 
    hairType: 'wavy', 
    faceShape: 'square', 
    style: 'modern', 
    aiHint: 'mens undercut' 
  },
  { 
    id: 3, 
    nameKey: { en: 'Mullet', id: 'Mullet' }, 
    images: [
      '/images/mullet/mullet2.jpg',
      '/images/mullet/mullet3.jpg',
      '/images/mullet/mullet4.jpg'
    ], 
    modelUrl: '/models/mullet.glb', 
    hairType: 'any', 
    faceShape: 'oval', 
    style: 'trendy', 
    aiHint: 'mullet hairstyle' 
  },
  { 
    id: 4, 
    nameKey: { en: 'Side Part', id: 'Side Part' }, 
    images: [
      '/images/sidepart/sidepart.jpg',
      '/images/sidepart/sidepart2.jpg',
      '/images/sidepart/sidepart3.jpg'
    ], 
    modelUrl: '/models/sidepart.glb',
    hairType: 'straight', 
    faceShape: 'oval', 
    style: 'classic', 
    aiHint: 'mens side part' 
  },
  { 
    id: 5, 
    nameKey: { en: 'Curly Quiff', id: 'Quiff Keriting' }, 
    images: [
        '/images/quiff/quiffnew1.jpg',
        '/images/quiff/quiffnew2.jpg',
        '/images/quiff/quiffnew3.jpg'
    ], 
    modelUrl: '/models/quiff.glb', 
    hairType: 'curly', 
    faceShape: 'round', 
    style: 'modern', 
    aiHint: 'curly quiff' 
  },
  { 
    id: 6, 
    nameKey: { en: 'Pompadour', id: 'Pompadour' }, 
    images: [
      '/images/pompadour/pompadour.jpg',
      '/images/pompadour/pompadour1.jpg',
      '/images/pompadour/pompadour2.jpg'
    ], 
    modelUrl: '/models/pompadour.glb', 
    hairType: 'any', 
    faceShape: 'square', 
    style: 'classic', 
    aiHint: 'mens pompadour' 
  },
  { 
    id: 7, 
    nameKey: { en: 'Buzz Cut', id: 'Buzz Cut' }, 
    images: [
      '/images/buzzcut/buzzcut.jpg',
      '/images/buzzcut/buzzcut2.jpg',
      '/images/buzzcut/buzzcut3.jpg'
    ], 
    modelUrl: '/models/buzzcut.glb', 
    hairType: 'any', 
    faceShape: 'any', 
    style: 'minimalist', 
    aiHint: 'buzz cut' 
  },
  { 
    id: 8, 
    nameKey: { en: 'French Crop', id: 'French Crop' }, 
    images: [ 
      '/images/frenchcrop/frenchcrop2.jpg',
      '/images/frenchcrop/frenchcrop.jpg',
      '/images/frenchcrop/frenchcrop3.jpg'
    ], 
    modelUrl: '/models/frenchcrop1.glb', 
    hairType: 'any', 
    faceShape: 'oval', 
    style: 'trendy', 
    aiHint: 'french crop' 
  },
  { 
    id: 9, 
    nameKey: { en: 'Two Block Haircut', id: 'Potongan Two Block' }, 
    images: [
      '/images/twoblock/twoblock.jpg',
      '/images/twoblock/twoblock2.jpg',
      '/images/twoblock/twoblock3.jpg'
    ], 
    modelUrl: '/models/twoblock.glb', 
    hairType: 'wavy', 
    faceShape: 'oval', 
    style: 'trendy', 
    aiHint: 'two block' 
  },
  { 
    id: 10, 
    nameKey: { en: 'Curtain Hairstyle', id: 'Gaya Rambut Curtain' }, 
    images: [ 
      '/images/curtain/curtain.jpg',
      '/images/curtain/curtain2.jpg',
      '/images/curtain/curtain3.jpg'
    ], 
    modelUrl: '/models/curtainnew.glb', 
    hairType: 'straight', 
    faceShape: 'any', 
    style: 'trendy', 
    aiHint: 'curtain hairstyle' 
  },
  { 
    id: 11, 
    nameKey: { en: 'Comma Hair', id: 'Rambut Koma' }, 
    images: [
      '/images/comma/commahair.jpg',
      '/images/comma/comma1.jpg',
      '/images/comma/comma2.jpg'
    ], 
    modelUrl: '/models/commahair.glb', 
    hairType: 'straight', 
    faceShape: 'oval', 
    style: 'trendy', 
    aiHint: 'comma hair' 
  },
];

export const filterOptionsConfig = {
  hairType: [
    { value: 'all', labelKey: { en: 'All', id: 'Semua' } },
    { value: 'straight', labelKey: { en: 'Straight', id: 'Lurus' } },
    { value: 'wavy', labelKey: { en: 'Wavy', id: 'Bergelombang' } },
    { value: 'curly', labelKey: { en: 'Curly', id: 'Keriting' } },
    { value: 'any', labelKey: { en: 'Any', id: 'Apapun' } },
  ],
  faceShape: [
    { value: 'all', labelKey: { en: 'All', id: 'Semua' } },
    { value: 'oval', labelKey: { en: 'Oval', id: 'Oval' } },
    { value: 'square', labelKey: { en: 'Square', id: 'Kotak' } },
    { value: 'round', labelKey: { en: 'Round', id: 'Bulat' } },
    { value: 'any', labelKey: { en: 'Any', id: 'Apapun' } },
  ],
  style: [
    { value: 'all', labelKey: { en: 'All', id: 'Semua' } },
    { value: 'classic', labelKey: { en: 'Classic', id: 'Klasik' } },
    { value: 'modern', labelKey: { en: 'Modern', id: 'Modern' } },
    { value: 'trendy', labelKey: { en: 'Trendy', id: 'Trendy' } },
    { value: 'minimalist', labelKey: { en: 'Minimalist', id: 'Minimalis' } },
  ],
};

// Old filterOptions - to be removed from gallery page and this file eventually if not used elsewhere
export const filterOptions = {
  hairType: {
    en: ['All', 'Straight', 'Wavy', 'Curly', 'Any'],
    id: ['Semua', 'Lurus', 'Bergelombang', 'Keriting', 'Apapun']
  },
  faceShape: {
    en: ['All', 'Oval', 'Square', 'Round', 'Any'],
    id: ['Semua', 'Oval', 'Kotak', 'Bulat', 'Apapun']
  },
  style: {
    en: ['All', 'Classic', 'Modern', 'Trendy', 'Minimalist'],
    id: ['Semua', 'Klasik', 'Modern', 'Trendy', 'Minimalis']
  }
};

