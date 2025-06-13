// src/components/chatbot/ChatbotPopup.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, X, Bot } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ChatbotPopupInner from './ChatbotPopupInner';

export default function ChatbotPopup() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');

  // Generate initial message based on language
  useEffect(() => {
    setInitialMessage(
      t({
        en: "Hello! I'm KingBot. Ask me about hairstyles, book an appointment, or get recommendations!",
        id: 'Halo! Saya KingBot. Tanya saya tentang gaya rambut, pesan janji, atau dapatkan rekomendasi!',
      })
    );
  }, [language, t]);


  const handleToggleOpen = (forceMessage?: string) => {
    if (forceMessage) {
      setInitialMessage(forceMessage);
    } else {
       // Reset to default initial message when reopening without a specific trigger
       setInitialMessage(
        t({
          en: "Hello! I'm KingBot. Ask me about hairstyles, book an appointment, or get recommendations!",
          id: 'Halo! Saya KingBot. Tanya saya tentang gaya rambut, pesan janji, atau dapatkan rekomendasi!',
        })
      );
    }
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => handleToggleOpen()}
              size="icon"
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 text-primary-foreground"
              aria-label={isOpen ? t({ en: 'Close Chat', id: 'Tutup Obrolan' }) : t({ en: 'Chat with KingBot', id: 'Chat dengan KingBot' })}
            >
              {isOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-popover text-popover-foreground">
            <p>{isOpen ? t({ en: 'Close Chat', id: 'Tutup Obrolan' }) : t({ en: 'Chat with KingBot', id: 'Chat dengan KingBot' })}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] max-h-[calc(100vh-8rem)] shadow-2xl rounded-xl flex flex-col border border-border/50 z-40 overflow-hidden bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-border/50 bg-card/95 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/bot-avatar.png" alt="KingBot" />
                <AvatarFallback className="bg-primary/20 text-primary"><Bot size={20}/></AvatarFallback>
              </Avatar>
              <CardTitle className="text-base font-headline text-foreground">{t({ en: 'KingBot Assistant', id: 'Asisten KingBot' })}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <ChatbotPopupInner initialMessage={initialMessage} />
        </Card>
      )}
    </>
  );
}
