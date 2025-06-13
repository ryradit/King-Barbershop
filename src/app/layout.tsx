import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ChatbotPopup from '@/components/chatbot/ChatbotPopup'; 

export const metadata: Metadata = {
  title: 'King Barbershop - Kutabumi',
  description: 'Modern barbershop in Indonesia for trendy men\'s haircuts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark"> {/* Default lang to Indonesian */}
      <head>
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
