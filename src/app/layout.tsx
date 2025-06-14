
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ChatbotPopup from '@/components/chatbot/ChatbotPopup';

const siteName = 'King Barbershop - Kutabumi';
const defaultTitle = 'King Barbershop - Kutabumi | Your Style, Our Expertise';
const defaultDescription = 'Discover trendy men\'s haircuts at King Barbershop Kutabumi. Expert barbers, modern styles, and easy online booking. Your next fresh look starts here!';
// IMPORTANT: Set NEXT_PUBLIC_SITE_URL in your .env file to your production domain
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'; // Fallback for local dev
// IMPORTANT: Replace this with an absolute URL to your actual Open Graph image (1200x630px recommended)
const defaultOgImage = 'https://placehold.co/1200x630.png';

export const metadata: Metadata = {
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: '/', // Relative to metadataBase, so it becomes siteUrl
    siteName: siteName,
    images: [
      {
        url: defaultOgImage, // Absolute URL
        width: 1200,
        height: 630,
        alt: `Promotional image for ${siteName}`,
      },
    ],
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage], // Absolute URL
    // site: '@YourTwitterSiteHandle', // Optional: Your site's Twitter handle
    // creator: '@YourTwitterCreatorHandle', // Optional: Content creator's Twitter handle
  },
  keywords: ['barbershop', 'kutabumi', 'tangerang', 'mens haircut', 'potong rambut pria', 'gaya rambut pria', 'cukur rambut', 'salon pria', 'barber', 'hairstyle', 'grooming'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // To add favicons, place them in the /public folder and uncomment below:
  // icons: {
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
  // For Google Search Console verification (optional):
  // verification: {
  //   google: 'YOUR_GOOGLE_SITE_VERIFICATION_TOKEN',
  // }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow user to zoom
  // themeColor: [ // Optional: if you want to set theme color for browser UI
  //   { media: '(prefers-color-scheme: light)', color: 'white' },
  //   { media: '(prefers-color-scheme: dark)', color: '#222222' }, // Match your dark bg
  // ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark"> {/* Default lang to Indonesian */}
      <head>
        {/* Font links are kept here as they are not directly part of Next.js metadata/viewport objects */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col pt-16"> {/* Added pt-16 for fixed navbar */}
        <LanguageProvider>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <div className="animate-in fade-in-0 duration-700">
              {children}
            </div>
          </main>
          <Footer />
          <ChatbotPopup />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
