// src/app/contact/page.tsx
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, MapPin, Phone, Send, Instagram, Facebook, Twitter } from 'lucide-react';
// Removed Image import as it's no longer used for the map

export default function ContactPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log({ name, email, message });
    toast({
      title: t({ en: 'Message Sent!', id: 'Pesan Terkirim!' }),
      description: t({ en: 'We will get back to you soon.', id: 'Kami akan segera menghubungi Anda.' }),
    });
    setName('');
    setEmail('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in-0 duration-500">
      <section className="text-center py-8 bg-card rounded-lg shadow-lg animate-in fade-in-0 delay-100 duration-700">
        <h1 className="font-headline text-4xl font-bold text-primary">
          {t({ en: 'Contact Us', id: 'Hubungi Kami' })}
        </h1>
        <p className="text-foreground/80 mt-2">
          {t({ en: 'Get in touch for inquiries or visit our barbershop.', id: 'Hubungi kami untuk pertanyaan atau kunjungi barbershop kami.' })}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in-0 slide-in-from-bottom-10 delay-200 duration-700">
        {/* Contact Information & Map */}
        <Card className="bg-card shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{t({ en: 'Our Information', id: 'Informasi Kami' })}</CardTitle>
            <CardDescription>{t({ en: 'Find us or reach out through these channels.', id: 'Temukan kami atau hubungi melalui saluran ini.' })}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-3">
              <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">{t({ en: 'Address', id: 'Alamat' })}</h3>
                <p className="text-muted-foreground">Jl. Mawar Raya No.27 Blok D2, RT.7/RW.12, Kutabumi, Kec. Ps. Kemis, Kabupaten Tangerang, Banten 15560</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">{t({ en: 'Phone', id: 'Telepon' })}</h3>
                <p className="text-muted-foreground">+62 21 1234 5678</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">{t({ en: 'Email', id: 'Email' })}</h3>
                <p className="text-muted-foreground">info@kingbarbershop-kutabumi.com</p>
              </div>
            </div>
            
            <div className="pt-4">
              <h3 className="font-semibold mb-2">{t({ en: 'Follow Us', id: 'Ikuti Kami' })}</h3>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" asChild className="hover:border-primary hover:text-primary">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
                </Button>
                 <Button variant="outline" size="icon" asChild className="hover:border-primary hover:text-primary">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
                </Button>
                 <Button variant="outline" size="icon" asChild className="hover:border-primary hover:text-primary">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
                </Button>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">{t({ en: 'Our Location', id: 'Lokasi Kami' })}</h3>
              <div className="aspect-video bg-muted rounded-md overflow-hidden relative shadow-inner">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.7949415004764!2d106.5678521!3d-6.1582124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69fff84b6c6c89%3A0x35cd727f00cd4398!2sKING%20BARBERSHOP%20KUTABUMI!5e0!3m2!1sen!2sid!4v1749716392990!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t({en: "Map to KING BARBERSHOP KUTABUMI", id: "Peta ke KING BARBERSHOP KUTABUMI"})}
                ></iframe>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="bg-card shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{t({ en: 'Send Us a Message', id: 'Kirim Pesan' })}</CardTitle>
            <CardDescription>{t({ en: 'Have a question? Fill out the form below.', id: 'Ada pertanyaan? Isi formulir di bawah ini.' })}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="contact-name" className="font-medium">{t({ en: 'Your Name', id: 'Nama Anda' })}</Label>
                <Input id="contact-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t({ en: 'e.g., Jane Doe', id: 'mis., Siti Aminah' })} required className="mt-1 bg-background/50" />
              </div>
              <div>
                <Label htmlFor="contact-email" className="font-medium">{t({ en: 'Your Email', id: 'Email Anda' })}</Label>
                <Input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t({ en: 'e.g., your@email.com', id: 'mis., anda@email.com' })} required className="mt-1 bg-background/50" />
              </div>
              <div>
                <Label htmlFor="contact-message" className="font-medium">{t({ en: 'Message', id: 'Pesan' })}</Label>
                <Textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t({ en: 'Your message here...', id: 'Pesan Anda di sini...' })}
                  required
                  className="mt-1 min-h-[120px] bg-background/50"
                />
              </div>
              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full font-headline">
                 <Send className="mr-2 h-5 w-5" />
                {isSubmitting ? t({ en: 'Sending...', id: 'Mengirim...' }) : t({ en: 'Send Message', id: 'Kirim Pesan' })}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
