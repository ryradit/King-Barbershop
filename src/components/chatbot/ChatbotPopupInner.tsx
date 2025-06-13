
// src/components/chatbot/ChatbotPopupInner.tsx
"use client";

import type { FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image'; // Import next/image
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, CornerDownLeft, Loader2, Send, User } from 'lucide-react';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { bookAppointmentWithChatbot } from '@/ai/flows/book-appointment-with-chatbot';
import { recommendHaircut, type RecommendHaircutInput } from '@/ai/flows/recommend-haircut';
import { suggestTrendingHaircuts } from '@/ai/flows/suggest-trending-haircuts';
import { answerHairstyleQuestion } from '@/ai/flows/answer-hairstyle-question';
import { useToast } from '@/hooks/use-toast';
import { allHaircuts, type Haircut } from '@/lib/haircutData'; // Import haircut data

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  options?: QuickReplyOption[];
  isLoading?: boolean;
  imageUrl?: string;
  imageAltKey?: { en: string; id: string };
  imageAiHint?: string;
}

interface QuickReplyOption {
  textKey: { en: string; id: string };
  action: string;
  payload?: any;
}

type ConversationContext = 'idle' | 'awaiting_recommendation_details' | 'awaiting_booking_details';

const defaultQuickReplyOptions: QuickReplyOption[] = [
  { textKey: { en: 'Book Appointment', id: 'Pesan Janji' }, action: 'init_book_appointment' },
  { textKey: { en: 'Haircut Trends 2025', id: 'Tren Rambut 2025' }, action: 'trending_haircuts' },
  { textKey: { en: 'Recommend Haircut', id: 'Rekomendasi Potongan' }, action: 'init_recommend_haircut' },
];

interface ChatbotPopupInnerProps {
  initialMessage?: string;
}

// Helper function to parse recommendation details from text
const parseRecommendationDetailsFromText = (text: string, currentLang: Language) => {
  const lowerText = text.toLowerCase();
  let faceShape: string | undefined;
  let hairType: string | undefined;
  let stylePreference: string | undefined;
  let remainingText = ` ${lowerText.replace(/[^\w\s]/gi, '')} `; // Pad with spaces

  const faceShapeKeywords = {
    en: ['oval', 'square', 'round', 'heart', 'diamond', 'oblong', 'long', 'triangle'],
    id: ['oval', 'kotak', 'bulat', 'hati', 'wajik', 'lonjong', 'panjang', 'segitiga']
  };
  const hairTypeKeywords = {
    en: ['straight', 'wavy', 'curly', 'coily', 'fine', 'thick', 'thin'],
    id: ['lurus', 'bergelombang', 'keriting', 'ikal', 'tipis', 'tebal']
  };
  const styleKeywords = {
    en: ['modern', 'classic', 'trendy', 'minimalist', 'professional', 'casual', 'short', 'long', 'medium', 'undercut', 'fade', 'crop', 'pompadour', 'quiff', 'buzz cut', 'slick back', 'taper', 'crew cut'],
    id: ['modern', 'klasik', 'trend', 'minimalis', 'profesional', 'santai', 'pendek', 'panjang', 'sedang', 'undercut', 'fade', 'crop', 'pompadour', 'quiff', 'cepak', 'slick back', 'taper', 'crew cut']
  };

  const allKeywords = { faceShape, hairType, stylePreference };
  const keywordMap = { faceShape: faceShapeKeywords, hairType: hairTypeKeywords, stylePreference: styleKeywords };
  const extractedValues: Partial<RecommendHaircutInput> = {};

  // Prioritize extracting known entities
  (Object.keys(keywordMap) as Array<keyof typeof keywordMap>).forEach(key => {
    for (const kw of keywordMap[key][currentLang].concat(keywordMap[key][currentLang === 'id' ? 'en' : 'id'])) {
      if (remainingText.includes(` ${kw} `)) {
        let value = kw;
        // Normalize some Indonesian keywords to English equivalents if necessary for the AI model
        if (key === 'faceShape') {
          if (kw === 'kotak') value = 'square';
          else if (kw === 'bulat') value = 'round';
          else if (kw === 'lonjong' || kw === 'panjang') value = 'oval'; // Assuming oval for long/oblong
        } else if (key === 'hairType') {
          if (kw === 'lurus') value = 'straight';
          else if (kw === 'bergelombang' || kw === 'ikal') value = 'wavy';
          else if (kw === 'keriting') value = 'curly';
        }
        (extractedValues as any)[key] = value;
        remainingText = remainingText.replace(new RegExp(`\\b${kw}\\b`, 'gi'), ' ').trim();
        remainingText = ` ${remainingText.replace(/\s+/g, ' ')} `; // Re-pad after replace
        break; 
      }
    }
  });
  
  const commonWordsToRemove = currentLang === 'id' ? 
    ['untuk', 'wajah', 'rambut', 'gaya', 'model', 'saya', 'ingin', 'minta', 'tolong', 'carikan', 'rekomendasi', 'dengan', 'dan', 'potongan'] :
    ['for', 'face', 'hair', 'style', 'model', 'i', 'want', 'like', 'please', 'recommend', 'recommendation', 'with', 'and', 'cut'];

  let customerReferenceDescription = remainingText.trim();
  commonWordsToRemove.forEach(word => {
    customerReferenceDescription = customerReferenceDescription.replace(new RegExp(`\\b${word}\\b`, 'ig'), '').trim();
  });
  customerReferenceDescription = customerReferenceDescription.replace(/\s+/g, ' ').trim();
  
  if (customerReferenceDescription) {
    extractedValues.customerReferenceDescription = customerReferenceDescription;
  }

  return extractedValues;
};


export default function ChatbotPopupInner({ initialMessage }: ChatbotPopupInnerProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isBotLoading, setIsBotLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>('idle');
  const [pendingRecommendationDetails, setPendingRecommendationDetails] = useState<Partial<RecommendHaircutInput>>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

  const generateUniqueId = () => {
    messageIdCounter.current += 1;
    return `${Date.now()}-${messageIdCounter.current}`;
  };
  
  useEffect(() => {
    messageIdCounter.current = 0;
    const firstMessageText = initialMessage || t({ 
      en: 'Hello! I am KingBot, your AI assistant. How can I help you today with your hairstyle needs or appointment bookings?', 
      id: 'Halo! Saya KingBot, asisten AI Anda. Ada yang bisa saya bantu hari ini terkait kebutuhan gaya rambut Anda atau pemesanan janji?' 
    });
    const newInitialBotMessage: Message = {
      id: generateUniqueId(),
      text: firstMessageText,
      sender: 'bot',
      options: defaultQuickReplyOptions,
    };
    setMessages([newInitialBotMessage]);
    setConversationContext('idle');
    setPendingRecommendationDetails({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, t, initialMessage]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot', options?: QuickReplyOption[], isLoading?: boolean, imageDetails?: Pick<Message, 'imageUrl' | 'imageAltKey' | 'imageAiHint'>) => {
    const newMessage: Message = { id: generateUniqueId(), text, sender, options, isLoading, ...imageDetails };
    setMessages(prev => [...prev, newMessage]);
     if (scrollAreaRef.current) {
      setTimeout(() => scrollAreaRef.current!.scrollTo({ top: scrollAreaRef.current!.scrollHeight, behavior: 'smooth' }), 0);
    }
  };
  
  const updateLastBotMessage = (text: string, options?: QuickReplyOption[], imageDetails?: Pick<Message, 'imageUrl' | 'imageAltKey' | 'imageAiHint'>) => {
    setMessages(prev => prev.map((msg, index) => 
      index === prev.length - 1 && msg.sender === 'bot' 
      ? { ...msg, text, isLoading: false, options, ...imageDetails } 
      : msg
    ));
     if (scrollAreaRef.current) {
      setTimeout(() => scrollAreaRef.current!.scrollTo({ top: scrollAreaRef.current!.scrollHeight, behavior: 'smooth' }), 0);
    }
  };

  const handleSend = async (messageText = input, bypassInputClear = false) => {
    if (!messageText.trim() && !bypassInputClear) return;

    addMessage(messageText, 'user');
    if (!bypassInputClear) setInput('');
    
    setIsBotLoading(true);
    addMessage(t({en: "Thinking...", id: "Sedang berpikir..."}), 'bot', [], true);


    try {
      const lowerMessage = messageText.toLowerCase();
      let botResponse = '';
      let quickReplies: QuickReplyOption[] | undefined = defaultQuickReplyOptions;
      let imageDetails: Pick<Message, 'imageUrl' | 'imageAltKey' | 'imageAiHint'> | undefined = undefined;

      if (conversationContext === 'awaiting_recommendation_details') {
        const extracted = parseRecommendationDetailsFromText(lowerMessage, language);
        const updatedDetails = { ...pendingRecommendationDetails, ...extracted };
        setPendingRecommendationDetails(updatedDetails);

        if (updatedDetails.faceShape && updatedDetails.hairType) {
          addMessage(t({en: "Alright, let me find some recommendations for you...", id: "Baik, saya carikan beberapa rekomendasi untuk Anda..."}), 'bot', [], true);
          const result = await recommendHaircut(updatedDetails as RecommendHaircutInput);
          botResponse = `${t({en: "Recommendation:", id: "Rekomendasi:"})} ${result.recommendedHaircut}\n${result.description}\n\n${t({en: "Suitability:", id: "Kecocokan:"})} ${result.suitabilityExplanation}`;
          
          const matchedHaircut = allHaircuts.find(h =>
            t(h.nameKey).toLowerCase() === result.recommendedHaircut.toLowerCase() ||
            h.nameKey.en.toLowerCase() === result.recommendedHaircut.toLowerCase() ||
            h.nameKey.id.toLowerCase() === result.recommendedHaircut.toLowerCase()
          );
          if (matchedHaircut && matchedHaircut.images.length > 0) {
            imageDetails = {
              imageUrl: matchedHaircut.images[0],
              imageAltKey: matchedHaircut.nameKey,
              imageAiHint: matchedHaircut.aiHint
            };
          }
          botResponse += `\n\n${t({ en: "Is there anything else I can help you with?", id: "Ada lagi yang bisa saya bantu?" })}`;
          setConversationContext('idle');
          setPendingRecommendationDetails({});
          quickReplies = defaultQuickReplyOptions;
        } else if (!updatedDetails.faceShape) {
          botResponse = t({en: "I see. And what is your face shape (e.g., round, oval, square)?", id: "Baik. Lalu, apa bentuk wajah Anda (misalnya bulat, oval, kotak)?"});
          quickReplies = [
            { textKey: { en: 'Oval', id: 'Oval' }, action: 'provide_detail', payload: { text: language === 'id' ? 'wajah oval' : 'oval face'} },
            { textKey: { en: 'Round', id: 'Bulat' }, action: 'provide_detail', payload: { text: language === 'id' ? 'wajah bulat' : 'round face'} },
            { textKey: { en: 'Square', id: 'Kotak' }, action: 'provide_detail', payload: { text: language === 'id' ? 'wajah kotak' : 'square face'} },
          ];
        } else { // Hair type is missing
          botResponse = t({en: "Great! Now, what is your hair type (e.g., straight, wavy, curly)?", id: "Sip! Sekarang, apa jenis rambut Anda (misalnya lurus, bergelombang, keriting)?"});
           quickReplies = [
            { textKey: { en: 'Straight', id: 'Lurus' }, action: 'provide_detail', payload: { text: language === 'id' ? 'rambut lurus' : 'straight hair'} },
            { textKey: { en: 'Wavy', id: 'Bergelombang' }, action: 'provide_detail', payload: { text: language === 'id' ? 'rambut bergelombang' : 'wavy hair'} },
            { textKey: { en: 'Curly', id: 'Keriting' }, action: 'provide_detail', payload: { text: language === 'id' ? 'rambut keriting' : 'curly hair'} },
          ];
        }
      } else if (lowerMessage.includes(t({en: "recommend", id: "rekomendasi"})) || lowerMessage.includes(t({en: "suggest", id: "saran"})) || lowerMessage.includes(t({en: "style", id: "gaya"}))) {
        setPendingRecommendationDetails({}); // Clear previous
        const extracted = parseRecommendationDetailsFromText(lowerMessage, language);
        setPendingRecommendationDetails(extracted);

        if (extracted.faceShape && extracted.hairType) {
           addMessage(t({en: "Alright, let me find some recommendations for you based on that...", id: "Baik, saya carikan beberapa rekomendasi berdasarkan itu..."}), 'bot', [], true);
          const result = await recommendHaircut(extracted as RecommendHaircutInput);
          botResponse = `${t({en: "Recommendation:", id: "Rekomendasi:"})} ${result.recommendedHaircut}\n${result.description}\n\n${t({en: "Suitability:", id: "Kecocokan:"})} ${result.suitabilityExplanation}`;
          
          const matchedHaircut = allHaircuts.find(h =>
            t(h.nameKey).toLowerCase() === result.recommendedHaircut.toLowerCase() ||
            h.nameKey.en.toLowerCase() === result.recommendedHaircut.toLowerCase() ||
            h.nameKey.id.toLowerCase() === result.recommendedHaircut.toLowerCase()
          );
          if (matchedHaircut && matchedHaircut.images.length > 0) {
             imageDetails = {
              imageUrl: matchedHaircut.images[0],
              imageAltKey: matchedHaircut.nameKey,
              imageAiHint: matchedHaircut.aiHint
            };
          }
          botResponse += `\n\n${t({ en: "Is there anything else I can help you with?", id: "Ada lagi yang bisa saya bantu?" })}`;
          setConversationContext('idle');
          quickReplies = defaultQuickReplyOptions;
        } else if (!extracted.faceShape) {
          botResponse = t({en: "Sure, I can help with haircut recommendations! First, what's your face shape? (e.g., oval, round, square)", id: "Tentu, saya bisa bantu rekomendasi potongan rambut! Pertama, apa bentuk wajah Anda? (misalnya oval, bulat, kotak)"});
          setConversationContext('awaiting_recommendation_details');
           quickReplies = [
            { textKey: { en: 'Oval', id: 'Oval' }, action: 'provide_detail', payload: { text: language === 'id' ? 'wajah oval' : 'oval face'} },
            { textKey: { en: 'Round', id: 'Bulat' }, action: 'provide_detail', payload: { text: language === 'id' ? 'wajah bulat' : 'round face'} },
            { textKey: { en: 'Square', id: 'Kotak' }, action: 'provide_detail', payload: { text: language === 'id' ? 'wajah kotak' : 'square face'} },
          ];
        } else { // Face shape known, hair type missing
          botResponse = t({en: "Okay, I have your face shape. What's your hair type? (e.g., straight, wavy, curly)", id: "Oke, bentuk wajah sudah ada. Apa jenis rambut Anda? (misalnya lurus, bergelombang, keriting)"});
          setConversationContext('awaiting_recommendation_details');
           quickReplies = [
            { textKey: { en: 'Straight', id: 'Lurus' }, action: 'provide_detail', payload: { text: language === 'id' ? 'rambut lurus' : 'straight hair'} },
            { textKey: { en: 'Wavy', id: 'Bergelombang' }, action: 'provide_detail', payload: { text: language === 'id' ? 'rambut bergelombang' : 'wavy hair'} },
            { textKey: { en: 'Curly', id: 'Keriting' }, action: 'provide_detail', payload: { text: language === 'id' ? 'rambut keriting' : 'curly hair'} },
          ];
        }
      } else if (lowerMessage.includes(t({en: "book", id: "pesan"})) || lowerMessage.includes(t({en: "appointment", id: "janji"}))) {
        const nameMatch = lowerMessage.match(language === 'id' ? /(?:nama[:\s]+)([a-zA-Z\s]+)(?:,|$)/i : /(?:name[:\s]+)([a-zA-Z\s]+)(?:,|$)/i);
        const dateMatch = lowerMessage.match(/(\d{4}-\d{2}-\d{2})/);
        const timeMatch = lowerMessage.match(/(\d{2}:\d{2})/);
        const phoneMatch = lowerMessage.match(language === 'id' ? /(?:\bnomor\b|\btelp\b|\btelepon\b)[:\s]*(\d[\d\s-]{7,})/i : /(?:\bphone\b)[:\s]*(\d[\d\s-]{7,})/i);

        if (nameMatch && dateMatch && timeMatch && phoneMatch) {
          const appointmentData = {
            customerName: nameMatch[1].trim(),
            preferredDate: dateMatch[1],
            preferredTime: timeMatch[1],
            contactNumber: phoneMatch[1].replace(/\D/g, ''),
          };
          const result = await bookAppointmentWithChatbot(appointmentData);
          botResponse = result.confirmationMessage;
          botResponse += `\n\n${t({ en: "Is there anything else I can help you with?", id: "Ada lagi yang bisa saya bantu?" })}`;
        } else {
          botResponse = t({en: "To book, please tell me your Name, preferred Date (YYYY-MM-DD), Time (HH:MM), and Phone Number. Example: Book for John Doe, 2024-12-25, 10:00, Phone 08123456789", id: "Untuk memesan, tolong sebutkan Nama, Tanggal (YYYY-MM-DD), Waktu (HH:MM), dan Nomor Telepon Anda. Contoh: Pesan untuk Budi, 2024-12-25, 10:00, Telepon 08123456789"});
        }
        setConversationContext('idle');
        setPendingRecommendationDetails({});
      } else if (lowerMessage.includes(t({en: "trend", id: "tren"}))) {
        const result = await suggestTrendingHaircuts({ language });
        botResponse = result.trends;
        botResponse += `\n\n${t({ en: "Is there anything else I can help you with?", id: "Ada lagi yang bisa saya bantu?" })}`;
        setConversationContext('idle');
        setPendingRecommendationDetails({});
      } else { // Fallback for general questions or unrecognised input
        const generalAnswerResult = await answerHairstyleQuestion({ question: messageText, language });
        botResponse = generalAnswerResult.answer;
        botResponse += `\n\n${t({ en: "Is there anything else I can assist you with regarding hairstyles or our services?", id: "Ada lagi yang bisa saya bantu terkait gaya rambut atau layanan kami?" })}`;
        setConversationContext('idle');
        setPendingRecommendationDetails({});
        quickReplies = defaultQuickReplyOptions;
      }
      updateLastBotMessage(botResponse, quickReplies, imageDetails);
    } catch (error) {
      console.error("Chatbot error:", error);
      updateLastBotMessage(t({ en: 'Oops! Something went wrong. Please try again.', id: 'Oops! Terjadi kesalahan. Silakan coba lagi.' }));
      toast({
        title: t({ en: 'Chatbot Error', id: 'Kesalahan Chatbot' }),
        description: (error as Error)?.message || t({ en: 'Could not process your request.', id: 'Tidak dapat memproses permintaan Anda.' }),
        variant: 'destructive',
      });
      setConversationContext('idle');
      setPendingRecommendationDetails({});
    } finally {
      setIsBotLoading(false);
    }
  };

  const handleQuickReply = (option: QuickReplyOption) => {
    const userMessage = t(option.textKey);
    addMessage(userMessage, 'user'); 
    setInput(''); 
    
    if (option.action === 'provide_detail' && option.payload?.text) {
        handleSend(option.payload.text, true); 
        return;
    }

    setIsBotLoading(true);
    addMessage(t({en: "Thinking...", id: "Sedang berpikir..."}), 'bot', [], true);

    (async () => {
      let botResponse = '';
      let quickReplies: QuickReplyOption[] | undefined = defaultQuickReplyOptions;
      let imageDetails: Pick<Message, 'imageUrl' | 'imageAltKey' | 'imageAiHint'> | undefined = undefined;

      try {
        if (option.action === 'init_book_appointment') {
          botResponse = t({en: "Sure! To book an appointment, please tell me your Full Name, preferred Date (YYYY-MM-DD), Time (HH:MM), and Phone Number. Example: Book for John Doe, 2024-12-25, 10:00, Phone 08123456789", id: "Tentu! Untuk memesan janji, tolong sebutkan Nama Lengkap, Tanggal (YYYY-MM-DD), Waktu (HH:MM), dan Nomor Telepon Anda. Contoh: Pesan untuk Budi, 2024-12-25, 10:00, Telepon 08123456789"});
          setConversationContext('idle'); 
          setPendingRecommendationDetails({});
        } else if (option.action === 'trending_haircuts') {
          const result = await suggestTrendingHaircuts({ language });
          botResponse = result.trends;
          botResponse += `\n\n${t({ en: "Is there anything else I can help you with?", id: "Ada lagi yang bisa saya bantu?" })}`;
          setConversationContext('idle');
          setPendingRecommendationDetails({});
        } else if (option.action === 'init_recommend_haircut') {
          setPendingRecommendationDetails({}); 
          botResponse = t({en: "Okay, I can help with that! What is your face shape (e.g., round, square, oval)?", id: "Baik, saya bisa bantu! Apa bentuk wajah Anda (misalnya, bulat, kotak, oval)?"});
          setConversationContext('awaiting_recommendation_details');
          quickReplies = [
            { textKey: { en: 'Oval', id: 'Oval' }, action: 'provide_detail', payload: { text: language === 'id' ? 'wajah oval' : 'oval face'} },
            { textKey: { en: 'Round', id: 'Bulat' }, action: 'provide_detail', payload: { text: language === 'id' ? 'wajah bulat' : 'round face'} },
            { textKey: { en: 'Square', id: 'Kotak' }, action: 'provide_detail', payload: { text: language === 'id' ? 'wajah kotak' : 'square face'} },
          ];
        } else if (option.action === 'recommend_payload' && option.payload) {
            addMessage(t({en: "Processing your selection...", id: "Memproses pilihan Anda..."}), 'bot', [], true);
            const result = await recommendHaircut(option.payload as RecommendHaircutInput);
            botResponse = `${t({en: "Recommendation:", id: "Rekomendasi:"})} ${result.recommendedHaircut}\n${result.description}\n\n${t({en: "Suitability:", id: "Kecocokan:"})} ${result.suitabilityExplanation}`;
            
            const matchedHaircut = allHaircuts.find(h =>
              t(h.nameKey).toLowerCase() === result.recommendedHaircut.toLowerCase() ||
              h.nameKey.en.toLowerCase() === result.recommendedHaircut.toLowerCase() ||
              h.nameKey.id.toLowerCase() === result.recommendedHaircut.toLowerCase()
            );
            if (matchedHaircut && matchedHaircut.images.length > 0) {
              imageDetails = {
                imageUrl: matchedHaircut.images[0],
                imageAltKey: matchedHaircut.nameKey,
                imageAiHint: matchedHaircut.aiHint
              };
            }
            botResponse += `\n\n${t({ en: "Is there anything else I can help you with?", id: "Ada lagi yang bisa saya bantu?" })}`;
            setConversationContext('idle');
            setPendingRecommendationDetails({});
            quickReplies = defaultQuickReplyOptions;
        } else {
          // Fallback for unhandled quick reply actions - can call the general question flow
          const generalAnswerResult = await answerHairstyleQuestion({ question: userMessage, language });
          botResponse = generalAnswerResult.answer;
          botResponse += `\n\n${t({ en: "Is there anything else I can assist you with?", id: "Ada lagi yang bisa saya bantu?" })}`;
          setConversationContext('idle');
          setPendingRecommendationDetails({});
        }
        updateLastBotMessage(botResponse, quickReplies, imageDetails);
      } catch (err) {
        console.error("Quick reply error:", err);
        updateLastBotMessage(t({ en: 'Oops! Something went wrong with that option.', id: 'Oops! Terjadi kesalahan dengan opsi itu.' }));
        toast({
          title: t({ en: 'Chatbot Error', id: 'Kesalahan Chatbot' }),
          description: (err as Error)?.message || t({ en: 'Could not process your request.', id: 'Tidak dapat memproses permintaan Anda.' }),
          variant: 'destructive',
        });
        setConversationContext('idle');
        setPendingRecommendationDetails({});
      } finally {
        setIsBotLoading(false);
      }
    })();
  };

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <>
      <ScrollArea className="flex-grow p-4 bg-background/70 h-full" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end max-w-[85%] space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className="h-8 w-8 shadow">
                  <AvatarImage src={msg.sender === 'bot' ? '/bot-avatar.png' : '/user-avatar.png'} />
                  <AvatarFallback>{msg.sender === 'bot' ? <Bot/> : <User />}</AvatarFallback>
                </Avatar>
                <Card className={`${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-card text-card-foreground rounded-tl-none'} p-3 shadow-md`}>
                  {msg.isLoading ? (
                     <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> <span>{msg.text}</span>
                     </div>
                  ) : (
                    <>
                      {msg.imageUrl && msg.imageAltKey && (
                        <div className="my-2 rounded-md overflow-hidden aspect-video relative max-h-[150px] sm:max-h-[200px] shadow">
                          <Image
                            src={msg.imageUrl}
                            alt={t(msg.imageAltKey)}
                            data-ai-hint={msg.imageAiHint || 'hairstyle recommendation'}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 640px) 70vw, 220px" // Adjusted for chat bubble context
                            priority={false} // Not typically a priority image
                          />
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                    </>
                  )}
                </Card>
              </div>
            </div>
          ))}
           {messages.length > 0 && messages[messages.length -1]?.sender === 'bot' && messages[messages.length -1].options && !messages[messages.length -1].isLoading && (
            <div className="flex flex-wrap gap-2 mt-2 justify-start pl-10">
              {messages[messages.length -1].options!.map(opt => (
                <Button 
                    key={opt.action + JSON.stringify(opt.payload || {})} 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleQuickReply(opt)} 
                    className="bg-background/80 hover:bg-accent/30 border-primary/70 text-primary text-xs px-3 py-1 h-auto"
                >
                  {t(opt.textKey)}
                </Button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmitForm} className="border-t p-4 flex items-center gap-2 bg-card">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t({ en: 'Type your message...', id: 'Ketik pesan Anda...' })}
          className="flex-grow bg-background/50 focus:ring-primary/50"
          disabled={isBotLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmitForm(e);
            }
          }}
        />
        <Button type="submit" size="icon" disabled={isBotLoading || !input.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {isBotLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          <span className="sr-only">{t({en: "Send", id: "Kirim"})}</span>
        </Button>
      </form>
    </>
  );
}

