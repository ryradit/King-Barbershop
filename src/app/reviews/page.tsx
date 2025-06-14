
// src/app/reviews/page.tsx
"use client";

import type { FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { Send, UserCircle, MessageSquare, Loader2, PlusCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, type Timestamp } from 'firebase/firestore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { handleCustomerFeedback } from '@/ai/flows/handle-customer-feedback-flow';


interface LiveComment {
  id: string;
  name: string;
  comment: string;
  timestamp: Timestamp | Date | null; // Firestore serverTimestamp can be null initially
  avatar?: string;
}

// Basic profanity lists (examples - expand these as needed)
const BAD_WORDS_EN: string[] = ['shit', 'motherfucker', 'heck', 'darn'];
const BAD_WORDS_ID: string[] = ['ngentot', 'tot', 'sialan', 'kurangajar', 'tolol', 'bangsat', 'anjing', 'babi', 'pukimak', 'bodat', 'tai', 'tahi', 'sundal', 'jancok', 'jancuk', 'ndasmu', 'raimu', 'gendeng', 'goblog', 'asu', 'Cangkeme', '3gp',
            '3some',
            '4some',
            '*damn',
            '*dyke',
            '*fuck*',
            '*shit*',
            '@$$',
            'adult',
            'ahole',
            'akka',
            'amcik',
            'anal',
            'anal-play',
            'analingus',
            'analplay',
            'androsodomy',
            'andskota',
            'anilingus',
            'anjing',
            'anjrit',
            'anjrot',
            'anus',
            'arschloch',
            'arse',
            'arse*',
            'arsehole',
            'ash0le',
            'ash0les',
            'asholes',
            'ass',
            'ass',
            'ass monkey',
            'ass-playauto-eroticism',
            'asses',
            'assface',
            'assh0le',
            'assh0lez',
            'asshole',
            'asshole',
            'assholes',
            'assholz',
            'asslick',
            'assplay',
            'assrammer',
            'asswipe',
            'asu',
            'ashu',
            'washu',
            'wasu',
            'wasuh',
            'autofellatio',
            'autopederasty',
            'ayir',
            'azzhole',
            'badass',
            'b00b',
            'b00b*',
            'b00bs',
            'b1tch',
            'b17ch',
            'b!+ch',
            'b!tch',
            'babami',
            'babes',
            'bego',
            'babi',
            'bagudung',
            'bajingan',
            'ball-gag',
            'ballgag',
            'banci',
            'bangla',
            'bangsat',
            'bareback',
            'barebacking',
            'bassterds',
            'bastard',
            'bastards',
            'bastardz',
            'basterds',
            'basterdz',
            'bacot',
            'bloon',
            'bdsm',
            'beastilaity',
            'bejad',
            'bejat',
            'bencong',
            'bestiality',
            'bi7ch',
            'bi+ch',
            'biatch',
            'bikini',
            'birahi',
            'bitch',
            'bitch',
            'bitch*',
            'bitches',
            'blow job',
            'blow-job',
            'blowjob',
            'blowjob',
            'blowjobs',
            'bodat',
            'boffing',
            'bogel',
            'boiolas',
            'bokep',
            'bollock',
            'bollock*',
            'bondage',
            'boner',
            'boob',
            'boobies',
            'boobs',
            'borjong',
            'breas',
            'breasts',
            'brengsek',
            'buceta',
            'bugger',
            'buggery',
            'bugil',
            'bukake',
            'bukakke',
            'bull-dyke',
            'bull-dykes',
            'bulldyke',
            'bulldykes',
            'bungul',
            'burit',
            'butt',
            'butt-pirate',
            'butt-plug',
            'butt-plugs',
            'butthole',
            'buttplug',
            'buttplugs',
            'butts',
            'buttwipe',
            'c0ck',
            'c0cks',
            'c0k',
            'cabron',
            'cameltoe',
            'cameltoes',
            'carpet muncher',
            'cawk',
            'cawks',
            'cazzo',
            'cerita dewasa',
            'cerita hot',
            'cerita panas',
            'cerita seru',
            'chick',
            'chicks',
            'chink',
            'choda',
            'chraa',
            'chudai',
            'chuj',
            'cipa',
            'cipki',
            'clit',
            'clit',
            'clitoris',
            'clits',
            'cnts',
            'cntz',
            'cock',
            'cock*',
            'cock-head',
            'cock-sucker',
            'cockhead',
            'cocks',
            'cocksucker',
            'coli',
            'cok',
            'coprophagy',
            'coprophilia',
            'cornhole',
            'cornholes',
            'corpophilia',
            'corpophilic',
            'crack',
            'crackz',
            'crap',
            'cream-pie',
            'creampie',
            'creamypie',
            'cum',
            'cumming',
            'cumpic',
            'cumshot',
            'cumshots',
            'cunilingus',
            'cunnilingus',
            'cunt',
            'cunt*',
            'cunts',
            'cuntz',
            'cukimay',
            'cukimai',
            'd4mn',
            'damn',
            'dancuk',
            'daniel brou',
            'david neil wallace',
            'daygo',
            'deepthroat',
            'defecated',
            'defecating',
            'defecation',
            'dego',
            'desnuda',
            'dick',
            'dick',
            'dick*',
            'dicks',
            'dike',
            'dike*',
            'dild0',
            'dild0s',
            'dildo',
            'dildoes',
            'dildos',
            'dilld0',
            'dilld0s',
            'dirsa',
            'dnwallace',
            'doggystyle',
            'dominatricks',
            'dominatrics',
            'dominatrix',
            'douche',
            'douches',
            'douching',
            'dupa',
            'dyke',
            'dykes',
            'dziwka',
            'ejackulate',
            'ejakulate',
            'ekrem',
            'ekrem*',
            'ekto',
            'ekto',
            'enculer',
            'enema',
            'enemas',
            'erection',
            'erections',
            'erotic',
            'erotica',
            'f u c k',
            'f u c k e r',
            'facesit',
            'facesitting',
            'facial',
            'facials',
            'faen',
            'fag',
            'fag1t',
            'fag*',
            'faget',
            'fagg0t',
            'fagg1t',
            'faggit',
            'faggot',
            'fagit',
            'fags',
            'fagz',
            'faig',
            'faigs',
            'fanculo',
            'fanny',
            'fart',
            'farted',
            'farting',
            'fatass',
            'fcuk',
            'feces',
            'feg',
            'felch',
            'felcher',
            'felcher',
            'felching',
            'fellatio',
            'fetish',
            'fetishes',
            'ficken',
            'fisting',
            'fitt*',
            'flikker',
            'flikker',
            'flipping the bird',
            'footjob',
            'foreskin',
            'fotze',
            'fotze',
            'foursome',
            'fu(*',
            'fuck',
            'fuck',
            'fucker',
            'fuckin',
            'fucking',
            'fucking',
            'fucks',
            'fudge packer',
            'fuk',
            'fuk*',
            'fukah',
            'fuken',
            'fuker',
            'fukin',
            'fukk',
            'fukkah',
            'fukken',
            'fukker',
            'fukkin',
            'futkretzn',
            'fux0r',
            'g00k',
            'g-spot',
            'gag',
            'gang-bang',
            'gangbang',
            'gay',
            'gayboy',
            'gaygirl',
            'gays',
            'gayz',
            'gembel',
            'genital',
            'genitalia',
            'genitals',
            'gila',
            'gigolo',
            'goblok',
            'girl',
            'glory-hole',
            'glory-holes',
            'gloryhole',
            'gloryholes',
            'god-damned',
            'gook',
            'groupsex',
            'gspot',
            'guiena',
            'h0ar',
            'h0r',
            'h0re',
            'h00r',
            'h4x0r',
            'hand-job',
            'handjob',
            'hardcore',
            'hate',
            'heang',
            'hell',
            'hells',
            'helvete',
            'hencet',
            'henceut',
            'hentai',
            'hitler',
            'hoar',
            'hoer',
            'hoer*',
            'homosexual',
            'honkey',
            'hoor',
            'hoore',
            'hore',
            'horny',
            'hot girl',
            'hot video',
            'hubungan intim',
            'huevon',
            'huevon',
            'hui',
            'idiot',
            'incest',
            'injun',
            'intercourse',
            'interracial',
            'itil',
            'jablay',
            'jablai',
            'jackass',
            'jackoff',
            'jancuk',
            'jancok',
            'j4ncok',
            'jap',
            'japs',
            'jebanje',
            'jembut',
            'jerk-off',
            'jisim',
            'jism',
            'jiss',
            'jizm',
            'jizz',
            'joanne yiokaris',
            'kacuk',
            'kampang',
            'kampret',
            'kanciang',
            'kanjut',
            'kancut',
            'kanker*',
            'kankerkinky',
            'kawk',
            'kelamin',
            'kelentit',
            'keparat',
            'kike',
            'kimak',
            'klimak',
            'klimax',
            'klitoris',
            'klootzak',
            'knob',
            'knobs',
            'knobz',
            'knulle',
            'kolop',
            'kontol',
            'kontol',
            'kraut',
            'kripalu',
            'kuk',
            'kuksuger',
            'kunt',
            'kunts',
            'kuntz',
            'kunyuk',
            'kurac',
            'kurac',
            'kurwa',
            'kusi',
            'kusi*',
            'kyrpa',
            'kyrpa*',
            'l3i+ch',
            'l3itch',
            'labia',
            'labial',
            'lancap',
            'lau xanh',
            'lesbi',
            'lesbian',
            'lesbians',
            'lesbo',
            'lezzian',
            'lipshits',
            'lipshitz',
            'lolita',
            'lolitas',
            'lonte',
            'lucah',
            'maho',
            'matamu',
            'malam pengantin',
            'malam pertama',
            'mamhoon',
            'maria ozawa',
            'masochism',
            'masochist',
            'masochistic',
            'masokist',
            'massterbait',
            'masstrbait',
            'masstrbate',
            'masterbaiter',
            'masterbat3',
            'masterbat*',
            'masterbate',
            'masterbates',
            'masturbat',
            'masturbat*',
            'masturbate',
            'masturbation',
            'memek',
            'memek',
            'merd*',
            'mesum',
            'mibun',
            'mofo',
            'monkleigh',
            'motha fucker',
            'motha fuker',
            'motha fukkah',
            'motha fukker',
            'mother fucker',
            'mother fukah',
            'mother fuker',
            'mother fukkah',
            'mother fukker',
            'mother-fucker',
            'motherfisher',
            'motherfucker',
            'mouliewop',
            'muff',
            'muie',
            'mujeres',
            'mulkku',
            'muschi',
            'mutha fucker',
            'mutha fukah',
            'mutha fuker',
            'mutha fukkah',
            'mutha fukker',
            'n1gr',
            'naked',
            'nastt',
            'nazi',
            'nazis',
            'necrophilia',
            'nenen',
            'nepesaurio',
            'ngecrot',
            'ngegay',
            'ngentot',
            'ngentot',
            'ngewe',
            'ngocok',
            'ngulum',
            'nigga',
            'nigger',
            'nigger*',
            'nigger;',
            'niggers',
            'nigur;',
            'niiger;',
            'niigr;',
            'nipple',
            'nipples',
            'no cd',
            'nocd',
            'nude',
            'nudes',
            'nudity',
            'nutsack',
            'nympho',
            'nymphomania',
            'nymphomaniac',
            'orafis',
            'orgasim;',
            'orgasm',
            'orgasms',
            'orgasum',
            'orgies',
            'orgy',
            'oriface',
            'orifice',
            'orifiss',
            'orospu',
            'p0rn',
            'packi',
            'packie',
            'packy',
            'paki',
            'pakie',
            'paky',
            'pantat',
            'pantek',
            'paska',
            'paska*',
            'pecker',
            'pecun',
            'pederast',
            'pederasty',
            'pedophilia',
            'pedophiliac',
            'pee',
            'peeenus',
            'peeenusss',
            'peeing',
            'peenus',
            'peinus',
            'pemerkosaan',
            'pen1s',
            'penas',
            'penetration',
            'penetrations',
            'penis',
            'penis',
            'penis-breath',
            'pentil',
            'penus',
            'penuus',
            'pepek',
            'perek',
            'perse',
            'pervert',
            'perverted',
            'perverts',
            'pg ishazamuddin',
            'phuc',
            'phuck',
            'phuck',
            'phuk',
            'phuker',
            'phukker',
            'picka',
            'pierdol',
            'pierdol*',
            'pilat',
            'pillu',
            'pillu*',
            'pimmel',
            'pimpis',
            'piss',
            'piss*',
            'pizda',
            'polac',
            'polack',
            'polak',
            'poonani',
            'poontsee',
            'poop',
            'porn',
            'pr0n',
            'pr1c',
            'pr1ck',
            'pr1k',
            'precum',
            'preteen',
            'prick',
            'pricks',
            'prostitute',
            'prostituted',
            'prostitutes',
            'prostituting',
            'puki',
            'pukimak',
            'pula',
            'pule',
            'pusse',
            'pussee',
            'pussies',
            'pussy',
            'pussy',
            'pussylips',
            'pussys',
            'puta',
            'puto',
            'puuke',
            'puuker',
            'qahbeh',
            'queef',
            'queef*',
            'queer',
            'queers',
            'queerz',
            'qweef',
            'qweers',
            'qweerz',
            'qweir',
            'racist',
            'rape',
            'raped',
            'rapes',
            'rapist',
            'rautenberg',
            'recktum',
            'rectum',
            'retard',
            'rimjob',
            's.o.b.',
            'sabul',
            'sadism',
            'sadist',
            'sarap',
            'scank',
            'scat',
            'schaffer',
            'scheiss',
            'scheiss*',
            'schlampe',
            'schlong',
            'schmuck',
            'school',
            'screw',
            'screwing',
            'scrotum',
            'sekolah menengah shan tao',
            'seks',
            'semen',
            'sempak',
            'senggama',
            'sepong',
            'setan',
            'setubuh',
            'sex',
            'sexy',
            'sh1t',
            'sh1ter',
            'sh1ts',
            'sh1tter',
            'sh1tz',
            'sh!+',
            'sh!t',
            'sh!t',
            'sh!t*',
            'sharmuta',
            'sharmute',
            'shemale',
            'shi+',
            'shipal',
            'shit',
            'shits',
            'shitter',
            'shitty',
            'shity',
            'shitz',
            'shiz',
            'shyt',
            'shyte',
            'shytty',
            'shyty',
            'silit',
            'sinting',
            'sixty-nine',
            'sixtynine',
            'skanck',
            'skank',
            'skankee',
            'skankey',
            'skanks',
            'skanky',
            'skribz',
            'skurwysyn',
            'slag',
            'slut',
            'sluts',
            'slutty',
            'slutty',
            'slutz',
            'smut',
            'sodomi',
            'sodomized',
            'sodomy',
            'softcore',
            'son-of-a-bitch',
            'spank',
            'spanked',
            'spanking',
            'sperm',
            'sphencter',
            'spic',
            'spierdalaj',
            'splooge',
            'squirt',
            'squirted',
            'squirting',
            'strap-on',
            'strapon',
            'submissive',
            'suck',
            'suck-off',
            'sucked',
            'sucking',
            'sucks',
            'suicide',
            'suka',
            'taek',
            'tai',
            'tanpa busana',
            'taptei',
            'teets',
            'teez',
            'teho',
            'telanjang',
            'testical',
            'testicle',
            'testicle*',
            'testicles',
            'tetek',
            'tetek',
            'threesome',
            'tit',
            'titit',
            'tits',
            'titt',
            'titt*',
            'titties',
            'titty',
            'tittys',
            'togel',
            'toket',
            'tolol',
            'topless',
            'totong',
            'tranny',
            'transsexual',
            'transvestite',
            'tukar istri',
            'tukar pasangan',
            'turd',
            'tusbol',
            'twat',
            'twats',
            'twaty',
            'twink',
            'upskirt',
            'urinated',
            'urinating',
            'urination',
            'va1jina',
            'vag1na',
            'vagiina',
            'vagina',
            'vagina',
            'vaginas',
            'vaj1na',
            'vajina',
            'vibrator',
            'vittu',
            'vullva',
            'vulva',
            'w0p',
            'w00se',
            'wank',
            'wank*',
            'wanking',
            'warez',
            'watersports',
            'wetback*',
            'wh0re',
            'wh00r',
            'whoar',
            'whore',
            'whores',
            'wichser',
            'wop*',
            'wtf',
            'x-girl',
            'x-rated',
            'xes',
            'xrated',
            'xxx',
            'yed',
            'zabourah',
            'bangke'];

const suggestedCommentsConfig = {
  id: [
    "Tempatnya nyaman",
    "Abang barbernya ramah",
    "Cukurannya rapi",
    "Pelayanannya memuaskan",
    "Harga terjangkau",
    "Pasti balik lagi!"
  ],
  en: [
    "Comfortable place",
    "Friendly barber",
    "Neat haircut",
    "Satisfactory service",
    "Affordable price",
    "Definitely coming back!"
  ]
};

function filterProfanity(text: string, language: Language): string {
  let filteredText = text;
  const badWordsList = language === 'id' ? BAD_WORDS_ID : BAD_WORDS_EN;
  
  badWordsList.forEach(word => {
    // Escape special regex characters in the word to treat them literally
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
    
    // If the original word (or escaped word) is empty, skip it to prevent invalid regex
    if (!escapedWord.trim()) {
        return;
    }

    // Use a regular expression for case-insensitive whole word matching
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
    filteredText = filteredText.replace(regex, '*'.repeat(word.length)); // Use original word's length for asterisks
  });
  return filteredText;
}

export default function LiveCommentsPage() {
  const { t, language } = useLanguage(); // Added language here
  const { toast } = useToast();
  const [liveComments, setLiveComments] = useState<LiveComment[]>([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!db) {
      console.error("Firestore database (db) is not initialized in LiveCommentsPage. Comments will not load. Check Firebase initialization logs in lib/firebase.ts and ensure environment variables (NEXT_PUBLIC_...) are correct and dev server was restarted.");
      setIsLoadingComments(false);
      toast({
        title: t({ en: "Service Unavailable", id: "Layanan Tidak Tersedia" }),
        description: t({ en: "Could not connect to the comment service. Firebase might not be configured correctly. Check browser console.", id: "Tidak dapat terhubung ke layanan komentar. Firebase mungkin tidak dikonfigurasi dengan benar. Periksa konsol browser." }),
        variant: "destructive",
      });
      return;
    }
    console.log("[LiveCommentsPage] Firestore 'db' instance appears to be initialized. Setting up snapshot listener.");

    const q = query(collection(db, "live_comments"), orderBy("timestamp", "asc"));
    setIsLoadingComments(true);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const comments: LiveComment[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({ 
          id: doc.id, 
          name: data.name,
          comment: data.comment,
          timestamp: data.timestamp, 
          avatar: data.avatar 
        });
      });
      setLiveComments(comments);
      setIsLoadingComments(false);
      console.log("[LiveCommentsPage] Snapshot updated, comments count:", comments.length);
    }, (error) => {
      console.error("[LiveCommentsPage] Error fetching live comments via onSnapshot: ", error);
      setIsLoadingComments(false);
      let errorDescEn = "Could not fetch live comments. Please try again later or check browser console for details.";
      let errorDescId = "Tidak dapat mengambil komentar langsung. Silakan coba lagi nanti atau periksa konsol browser untuk detail.";
      if ((error as any)?.code === 'permission-denied') {
        errorDescEn = "Permission denied fetching comments. Check Firestore rules for 'live_comments' collection (read access).";
        errorDescId = "Izin ditolak saat mengambil komentar. Periksa aturan Firestore untuk koleksi 'live_comments' (akses baca).";
      } else if ((error as any)?.code === 'failed-precondition' && (error as any)?.message?.includes('index')) {
        errorDescEn = "Query requires an index. Check Firestore console for index creation link on 'live_comments' (timestamp field).";
        errorDescId = "Kueri memerlukan indeks. Periksa konsol Firestore untuk tautan pembuatan indeks pada 'live_comments' (kolom timestamp).";
      }
      
      toast({
        title: t({ en: "Error Loading Comments", id: "Gagal Memuat Komentar" }),
        description: t({en: errorDescEn, id: errorDescId}),
        variant: "destructive",
      });
    });

    return () => {
      console.log("[LiveCommentsPage] Unsubscribing from live_comments snapshot listener.");
      unsubscribe();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveComments]);

  const handleAddSuggestedComment = (suggestedText: string) => {
    setComment(prev => prev ? `${prev.trim()} ${suggestedText}` : suggestedText);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast({
        title: t({ en: 'Incomplete Form', id: 'Form Tidak Lengkap' }),
        description: t({ en: 'Please provide your name and comment.', id: 'Harap isi nama dan komentar Anda.' }),
        variant: 'destructive',
      });
      return;
    }
    if (!db) { 
      toast({
        title: t({ en: "Service Error", id: "Kesalahan Layanan" }),
        description: t({ en: "Comment service (Firestore db) not available. Firebase might not be initialized correctly client-side. Check browser console for logs from lib/firebase.ts.", id: "Layanan komentar (Firestore db) tidak tersedia. Firebase mungkin tidak terinisialisasi dengan benar di sisi klien. Periksa konsol browser untuk log dari lib/firebase.ts." }),
        variant: "destructive",
      });
      console.error("[LiveCommentsPage] Attempted to submit comment, but Firestore database (db) is NOT INITIALIZED. Check lib/firebase.ts logs in browser console.");
      return;
    }

    setIsSubmitting(true);
    
    const originalComment = comment.trim();
    const filteredComment = filterProfanity(originalComment, language);
    const userName = name.trim();

    const commentData = {
      name: userName,
      comment: filteredComment, // Use the filtered comment
      timestamp: serverTimestamp(),
      avatar: userName.substring(0, 2).toUpperCase() 
    };
    console.log("[LiveCommentsPage] Attempting to send comment to 'live_comments' collection with data:", JSON.stringify(commentData));


    try {
      await addDoc(collection(db, "live_comments"), commentData);
      // Don't clear name for subsequent AI response or user convenience
      setComment(''); 
      toast({
        title: t({ en: 'Comment Sent!', id: 'Komentar Terkirim!' }),
      });
      console.log("[LiveCommentsPage] Comment successfully sent to Firestore.");

      // Now, try to get AI response for the comment
      try {
        const feedbackResponse = await handleCustomerFeedback({
          inputText: originalComment, // Analyze original for better context
          language,
          customerName: userName,
          source: 'review'
        });

        if (feedbackResponse.isNegative && feedbackResponse.response) {
          const aiCommentData = {
            name: t({ en: "King Barbershop Support", id: "Dukungan King Barbershop" }),
            comment: feedbackResponse.response,
            timestamp: serverTimestamp(),
            avatar: "AI" 
          };
          await addDoc(collection(db, "live_comments"), aiCommentData);
          console.log("[LiveCommentsPage] AI response posted for negative review.");
        }
      } catch (aiError) {
        console.error("[LiveCommentsPage] Error getting or posting AI feedback response:", aiError);
        // Optionally notify admin or log this more formally
        // Do not show error to user for AI part, as their comment is already posted.
      }

    } catch (error: any) {
      console.error("[LiveCommentsPage] Full error object when sending comment: ", error); 
      
      let userFacingMessageEn = 'Could not send your comment. Please check the browser console for more details.';
      let userFacingMessageId = 'Tidak dapat mengirim komentar Anda. Harap periksa konsol browser untuk detail lebih lanjut.';

      if (error.code === 'permission-denied' || (error.message && (error.message.includes('PERMISSION_DENIED') || error.message.includes('Missing or insufficient permissions')))) {
        userFacingMessageEn = 'Could not send comment due to permission issues. Please check your Firestore security rules for the "live_comments" collection to allow "create" (write) operations from clients.';
        userFacingMessageId = 'Gagal mengirim komentar karena masalah izin. Harap periksa aturan keamanan Firestore Anda untuk koleksi "live_comments" untuk mengizinkan operasi "create" (tulis) dari klien.';
        console.error('[LiveCommentsPage] Firestore permission error suspected for "live_comments" (create operation). Ensure rules allow client writes.');
      } else if (error.message && error.message.toLowerCase().includes('firestore client is not initialized')) {
        userFacingMessageEn = 'Failed to send comment: Firebase is not correctly initialized. Check your NEXT_PUBLIC_ environment variables and console logs.';
        userFacingMessageId = 'Gagal mengirim komentar: Firebase tidak terinisialisialisasi dengan benar. Periksa variabel lingkungan NEXT_PUBLIC_ Anda dan log konsol.';
      } else if (!db) {
         userFacingMessageEn = 'Failed to send comment: The Firestore database connection (db) is not available. This indicates a problem with Firebase initialization on the client-side. Check browser console logs from lib/firebase.ts carefully.';
         userFacingMessageId = 'Gagal mengirim komentar: Koneksi database Firestore (db) tidak tersedia. Ini menunjukkan masalah dengan inisialisasi Firebase di sisi klien. Periksa log konsol browser dari lib/firebase.ts dengan seksama.';
      }
      
      toast({
        title: t({ en: 'Error Sending Comment', id: 'Gagal Mengirim Komentar' }),
        description: t({ en: userFacingMessageEn, id: userFacingMessageId }),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCommentTimestamp = (timestamp: Timestamp | Date | null): string => {
    if (!timestamp) return "";
    let dateObject: Date;
    if (timestamp instanceof Date) {
      dateObject = timestamp;
    } else if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
      dateObject = (timestamp as Timestamp).toDate();
    } else {
      return ""; 
    }
    try {
      return format(dateObject, 'Pp'); 
    } catch (e) {
      console.warn("[LiveCommentsPage] Error formatting date:", e, timestamp);
      return "Invalid date";
    }
  };

  const currentSuggestedComments = suggestedCommentsConfig[language];


  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in-0 duration-500">
      <section className="text-center py-8 bg-card rounded-lg shadow-lg animate-in fade-in-0 delay-100 duration-700">
        <h1 className="font-headline text-4xl font-bold text-primary">
          {t({ en: 'Live Comments', id: 'Ulasan Langsung' })}
        </h1>
        <p className="text-foreground/80 mt-2">
          {t({ en: 'Join the conversation! Share your thoughts in real-time.', id: 'Bergabunglah dalam percakapan! Bagikan pemikiran Anda secara real-time.' })}
        </p>
      </section>

      <Card className="bg-card shadow-md animate-in fade-in-0 slide-in-from-bottom-10 delay-200 duration-700 flex flex-col h-[600px] sm:h-[550px] md:h-[600px]">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <MessageSquare className="h-7 w-7 mr-2 text-primary" />
            {t({ en: 'Chat Feed', id: 'Feed Obrolan' })}
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-grow px-6 pb-2" ref={scrollAreaRef}>
          <div className="space-y-4">
            {isLoadingComments && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">{t({en: "Loading comments...", id: "Memuat komentar..."})}</p>
              </div>
            )}
            {!isLoadingComments && liveComments.length === 0 && (
              <p className="text-center text-muted-foreground py-10">{t({ en: 'No comments yet. Be the first to chat!', id: 'Belum ada komentar. Jadilah yang pertama mengobrol!' })}</p>
            )}
            {liveComments.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-3 animate-in fade-in-0 duration-300">
                <Avatar className="h-10 w-10 mt-1">
                  {msg.avatar && msg.avatar.length > 2 && msg.avatar.startsWith('http') ? <AvatarImage src={msg.avatar} alt={msg.name} /> : null}
                  <AvatarFallback className="bg-primary/80 text-primary-foreground text-sm font-semibold">
                    {msg.avatar && msg.avatar.length <= 2 ? msg.avatar : <UserCircle size={20}/>}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-background/30 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-headline text-sm font-semibold text-primary">{msg.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatCommentTimestamp(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{msg.comment}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="name" className="font-medium sr-only">{t({ en: 'Your Name', id: 'Nama Anda' })}</Label>
              <Input 
                id="name" 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder={t({ en: 'Your Name', id: 'Nama Anda' })} 
                required 
                className="bg-background/50 mb-2" 
                aria-label={t({ en: 'Your Name', id: 'Nama Anda' })}
              />
            </div>
            <div>
              <Label htmlFor="comment" className="font-medium sr-only">{t({ en: 'Your Comment', id: 'Komentar Anda' })}</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t({ en: 'Type your comment here...', id: 'Ketik komentar Anda di sini...' })}
                required
                className="min-h-[80px] bg-background/50"
                aria-label={t({ en: 'Your Comment', id: 'Komentar Anda' })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground self-center mr-1">{t({en: "Suggest:", id: "Saran:"})}</span>
              {currentSuggestedComments.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => handleAddSuggestedComment(suggestion)}
                  className="text-xs h-auto py-1 px-2 bg-accent/20 hover:bg-accent/40 border-border/50"
                >
                   <PlusCircle className="h-3 w-3 mr-1 opacity-70" /> {suggestion}
                </Button>
              ))}
            </div>
          </div>
          <Button type="submit" size="lg" disabled={isSubmitting} className="font-headline mt-4 w-full">
            <Send className="mr-2 h-5 w-5" />
            {isSubmitting ? t({ en: 'Sending...', id: 'Mengirim...' }) : t({ en: 'Send Comment', id: 'Kirim Komentar' })}
          </Button>
        </form>
      </Card>
    </div>
  );
}

    
