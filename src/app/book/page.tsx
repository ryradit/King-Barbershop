
// src/app/book/page.tsx
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default react-calendar styles
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Clock, Phone, User, Send, Loader2, AlertCircle } from 'lucide-react';
// import { sendWhatsAppBookingNotification } from '../actions/sendWhatsAppBookingNotification';
import { saveAppointmentToFirestore } from '@/app/actions/saveAppointment';
import { getBookingCountsForDate } from '@/app/actions/getBookingCounts';
import { cn } from '@/lib/utils';

const availableTimes = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];
const BOOKING_LIMIT_PER_SLOT = 2;

const paymentMethods = [
  { value: 'gopay', labelKey: { en: 'GoPay', id: 'GoPay' } },
  { value: 'ovo', labelKey: { en: 'OVO', id: 'OVO' } },
  { value: 'bank_transfer', labelKey: { en: 'Bank Transfer', id: 'Transfer Bank' } },
  { value: 'cash', labelKey: { en: 'Cash at Counter', id: 'Tunai di Loket' } },
];

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

export default function BookingPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSlotDisabledStatus, setTimeSlotDisabledStatus] = useState<Record<string, boolean>>({});
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  const minBookingDate = new Date();
  minBookingDate.setHours(0, 0, 0, 0); 
  const maxBookingDate = new Date();
  maxBookingDate.setDate(minBookingDate.getDate() + 5);

  useEffect(() => {
    let isEffectMounted = true;
    const dateForThisEffectInstance = date; // Capture the Date object for this effect run

    if (dateForThisEffectInstance) {
      // Use UTC YYYY-MM-DD string for Firestore query, as before
      const formattedDateForFirestoreQuery = dateForThisEffectInstance.toISOString().split('T')[0];
      
      setIsFetchingSlots(true);
      setSelectedTime(undefined);

      getBookingCountsForDate(formattedDateForFirestoreQuery)
        .then(counts => {
          // Staleness check: Compare local date parts of dateForThisEffectInstance with current date state
          const currentDateInState = date;
          if (!isEffectMounted || 
              !currentDateInState || 
              dateForThisEffectInstance.getFullYear() !== currentDateInState.getFullYear() ||
              dateForThisEffectInstance.getMonth() !== currentDateInState.getMonth() ||
              dateForThisEffectInstance.getDate() !== currentDateInState.getDate()
          ) {
            return; // Stale data for a different selected day, or current date is undefined. Do nothing.
          }

          const currentNow = new Date(); // Current local date/time
          
          // "Is Today" check: Compare local date parts of dateForThisEffectInstance with currentNow
          const isSelectedDateToday = 
            dateForThisEffectInstance.getFullYear() === currentNow.getFullYear() &&
            dateForThisEffectInstance.getMonth() === currentNow.getMonth() &&
            dateForThisEffectInstance.getDate() === currentNow.getDate();

          const currentSystemHour = currentNow.getHours();
          const currentSystemMinute = currentNow.getMinutes();

          const disabledStatus: Record<string, boolean> = {};
          availableTimes.forEach(time => {
            const [slotHour, slotMinute] = time.split(':').map(Number);
            let isDisabledByCount = (counts[time] || 0) >= BOOKING_LIMIT_PER_SLOT;
            let isDisabledByTime = false; // Default to false

            // Only apply time-based disabling if the selected date is indeed today
            if (isSelectedDateToday) {
              if (slotHour < currentSystemHour) {
                isDisabledByTime = true;
              } else if (slotHour === currentSystemHour && slotMinute <= currentSystemMinute) {
                isDisabledByTime = true;
              }
            }
            disabledStatus[time] = isDisabledByCount || isDisabledByTime;
          });
          setTimeSlotDisabledStatus(disabledStatus);
        })
        .catch(error => {
          const currentDateInState = date;
           if (!isEffectMounted || 
              !currentDateInState || 
              dateForThisEffectInstance.getFullYear() !== currentDateInState.getFullYear() ||
              dateForThisEffectInstance.getMonth() !== currentDateInState.getMonth() ||
              dateForThisEffectInstance.getDate() !== currentDateInState.getDate()
          ) {
            return; // Stale error for a different selected day. Do nothing.
          }
          console.error("Error fetching booking counts:", error);
          toast({
            title: t({ en: 'Error Fetching Availability', id: 'Gagal Memuat Ketersediaan' }),
            description: error.message || t({ en: 'Could not load time slot availability. Please try refreshing.', id: 'Tidak dapat memuat ketersediaan slot waktu. Silakan coba muat ulang.' }),
            variant: 'destructive',
          });
          const fallbackDisabledStatus: Record<string, boolean> = {};
          availableTimes.forEach(time => fallbackDisabledStatus[time] = true); 
          setTimeSlotDisabledStatus(fallbackDisabledStatus);
        })
        .finally(() => {
          const currentDateInState = date;
          if (!isEffectMounted || 
              !currentDateInState || 
              dateForThisEffectInstance.getFullYear() !== currentDateInState.getFullYear() ||
              dateForThisEffectInstance.getMonth() !== currentDateInState.getMonth() ||
              dateForThisEffectInstance.getDate() !== currentDateInState.getDate()
          ) {
            return; // Don't update fetching state if stale or for a different selected day
          }
          setIsFetchingSlots(false);
        });
    } else {
      setTimeSlotDisabledStatus({}); // Clear status if no date is selected
    }
    
    return () => {
      isEffectMounted = false;
    };
  }, [date, t, toast]);

  const handleCalendarChange = (value: CalendarValue) => {
    if (value instanceof Date) {
      setDate(value);
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      setDate(value[0]);
    } else {
      setDate(undefined);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!date || !selectedTime || !name || !phone || !paymentMethod) {
      toast({
        title: t({ en: 'Incomplete Form', id: 'Form Tidak Lengkap' }),
        description: t({ en: 'Please fill in all fields.', id: 'Harap isi semua kolom.' }),
        variant: 'destructive',
      });
      return;
    }

    if (timeSlotDisabledStatus[selectedTime]) {
      toast({
        title: t({ en: 'Slot Not Available', id: 'Slot Tidak Tersedia' }),
        description: t({ en: 'The selected time slot is full or past. Please choose another time.', id: 'Slot waktu yang dipilih sudah penuh atau terlewat. Silakan pilih waktu lain.' }),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const bookingDetails = {
      customerName: name,
      bookingDate: date.toISOString().split('T')[0], // UTC YYYY-MM-DD for Firestore
      bookingTime: selectedTime,
      customerPhone: phone,
      paymentMethod: paymentMethods.find(pm => pm.value === paymentMethod)?.labelKey[language] || paymentMethod,
      language: language
    };

    toast({
      title: t({ en: 'Appointment Booked!', id: 'Janji Temu Dipesan!' }),
      description: `${t({en: 'See you on', id: 'Sampai jumpa pada'})} ${date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US')} ${t({en: 'at', id: 'pukul'})} ${selectedTime}.`,
      action: <CheckCircle className="text-green-500" />,
    });

    try {
      const firestoreResult = await saveAppointmentToFirestore(bookingDetails);
      toast({
        title: t(firestoreResult.messageKey),
        variant: firestoreResult.success ? 'default' : 'destructive',
      });

      if (firestoreResult.success) {
        const dateBookedForFirestore = bookingDetails.bookingDate; // This is UTC YYYY-MM-DD
        
        // Re-fetch counts for the date the booking was made FOR.
        // The 'date' state object still holds the local Date object for the booked day.
        if (date && date.toISOString().split('T')[0] === dateBookedForFirestore) { // Ensure we are updating slots for the correct day
          getBookingCountsForDate(dateBookedForFirestore)
            .then(counts => {
              // Additional staleness check: Ensure the calendar selection hasn't changed away from the booked date
              const currentlySelectedDateInState = date;
              if (!currentlySelectedDateInState || 
                  currentlySelectedDateInState.toISOString().split('T')[0] !== dateBookedForFirestore) {
                return; // User has navigated away, don't update slots for the old date
              }

              const currentNow = new Date();
              // "Is Today" check for the booked date (using the 'date' state object)
              const isBookedDateToday = 
                date.getFullYear() === currentNow.getFullYear() &&
                date.getMonth() === currentNow.getMonth() &&
                date.getDate() === currentNow.getDate();

              const currentSystemHour = currentNow.getHours();
              const currentSystemMinute = currentNow.getMinutes();

              const disabledStatus: Record<string, boolean> = {};
              availableTimes.forEach(time => {
                const [slotHour, slotMinute] = time.split(':').map(Number);
                let isDisabledByCount = (counts[time] || 0) >= BOOKING_LIMIT_PER_SLOT;
                let isDisabledByTime = false;
                if (isBookedDateToday) { 
                  if (slotHour < currentSystemHour) {
                    isDisabledByTime = true;
                  } else if (slotHour === currentSystemHour && slotMinute <= currentSystemMinute) {
                    isDisabledByTime = true;
                  }
                }
                disabledStatus[time] = isDisabledByCount || isDisabledByTime;
              });
              setTimeSlotDisabledStatus(disabledStatus);
            })
            .catch(err => {
              console.error("Error re-fetching booking counts after submission:", err);
            });
        }
      }
    } catch (error) {
      console.error("Error calling saveAppointmentToFirestore:", error);
      toast({
        title: t({ en: 'Database Error', id: 'Kesalahan Database' }),
        description: t({ en: 'Could not save appointment details to our records.', id: 'Tidak dapat menyimpan detail janji temu ke catatan kami.' }),
        variant: 'destructive',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
      <section className="text-center py-8 bg-card rounded-lg shadow-lg animate-in fade-in-0 delay-100 duration-700">
        <h1 className="font-headline text-4xl font-bold text-primary">
          {t({ en: 'Book Your Appointment', id: 'Pesan Janji Temu Anda' })}
        </h1>
        <p className="text-foreground/80 mt-2">
          {t({ en: 'Select your preferred date (within the next 6 days), time, and fill in your details.', id: 'Pilih tanggal pilihan Anda (dalam 6 hari ke depan), waktu, dan isi detail Anda.' })}
        </p>
      </section>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8">
            <div className="animate-in fade-in-0 slide-in-from-bottom-5 delay-200 duration-700">
              <Label htmlFor="date-picker" className="font-semibold text-lg mb-3 block">{t({ en: 'Select Date', id: 'Pilih Tanggal' })}</Label>
              <Calendar
                onChange={handleCalendarChange}
                value={date}
                minDate={minBookingDate}
                maxDate={maxBookingDate}
                locale={language === 'id' ? 'id-ID' : 'en-US'}
                className="w-full"
              />
            </div>

            <div className="space-y-6 mt-0 bg-card p-6 rounded-lg shadow-md animate-in fade-in-0 slide-in-from-bottom-5 delay-300 duration-700">
              <div>
                 <Label htmlFor="time-slot" className="font-semibold text-lg mb-2 block pt-1">{t({ en: 'Select Time', id: 'Pilih Waktu' })}</Label>
                {isFetchingSlots ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-3 text-muted-foreground">{t({ en: 'Loading available slots...', id: 'Memuat slot tersedia...' })}</p>
                  </div>
                ) : date ? (
                  <>
                    <RadioGroup
                      id="time-slot"
                      value={selectedTime}
                      onValueChange={setSelectedTime}
                      className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                    >
                      {availableTimes.map((time) => (
                        <Label
                          key={time}
                          htmlFor={`time-${time}`}
                          className={cn(
                            `flex items-center justify-center rounded-md border p-3 text-sm font-medium transition-colors`,
                            selectedTime === time && !timeSlotDisabledStatus[time] ? 'bg-primary text-primary-foreground border-primary cursor-pointer'
                              : timeSlotDisabledStatus[time] ? 'bg-muted/30 text-muted-foreground/70 border-dashed cursor-not-allowed opacity-70'
                              : 'hover:bg-accent/50 hover:border-accent bg-background/30 cursor-pointer'
                          )}
                        >
                          <RadioGroupItem
                            value={time}
                            id={`time-${time}`}
                            className="sr-only"
                            disabled={timeSlotDisabledStatus[time]}
                          />
                          <Clock className="h-4 w-4 mr-2 opacity-70" /> {time}
                          {timeSlotDisabledStatus[time] && <span className="ml-1 text-xs">({t({en:"Full/Past", id:"Penuh/Lewat"})})</span>}
                        </Label>
                      ))}
                    </RadioGroup>
                    {Object.values(timeSlotDisabledStatus).some(status => status === true) && (
                      <p className="text-sm text-muted-foreground mt-4 text-center px-2">
                        {t({
                          en: "If your desired time slot appears full or past, you can always contact us or visit the shop directly for potential walk-in availability.",
                          id: "Jika slot waktu yang Anda inginkan tampak penuh atau telah terlewat, Anda selalu dapat menghubungi kami atau mengunjungi barbershop secara langsung untuk kemungkinan ketersediaan walk-in."
                        })}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center text-sm text-muted-foreground p-3 border rounded-md bg-muted/20">
                    <AlertCircle className="h-5 w-5 mr-2 text-amber-500"/>
                    {t({ en: 'Please select a date first to see available times.', id: 'Harap pilih tanggal terlebih dahulu untuk melihat waktu tersedia.' })}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="name" className="font-semibold text-lg mb-2 block">{t({ en: 'Full Name', id: 'Nama Lengkap' })}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="name" type="text" placeholder={t({ en: 'Your Name', id: 'Nama Anda' })} value={name} onChange={(e) => setName(e.target.value)} required className="pl-10 bg-background/30" />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="font-semibold text-lg mb-2 block">{t({ en: 'Phone Number', id: 'Nomor Telepon' })}</Label>
                 <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="phone" type="tel" placeholder={t({ en: 'e.g., 08123456789', id: 'mis., 08123456789' })} value={phone} onChange={(e) => setPhone(e.target.value)} required className="pl-10 bg-background/30" />
                </div>
              </div>
              <div>
                <Label htmlFor="payment" className="font-semibold text-lg mb-2 block">{t({ en: 'Payment Method', id: 'Metode Pembayaran' })}</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                  <SelectTrigger id="payment" className="w-full bg-background/30">
                    <SelectValue placeholder={t({ en: 'Choose payment method', id: 'Pilih metode pembayaran' })} />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>{t(method.labelKey)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <Button type="submit" size="lg" className="w-full font-headline mt-6" disabled={isSubmitting || !selectedTime || timeSlotDisabledStatus[selectedTime]}>
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                {isSubmitting ? t({ en: 'Booking...', id: 'Memesan...' })
                  : (selectedTime && timeSlotDisabledStatus[selectedTime]) ? t({en: "Slot Unavailable", id:"Slot Tidak Tersedia"})
                  : t({ en: 'Book Appointment', id: 'Pesan Janji Temu' })}
              </Button>
            </div>
        </div>
      </form>
    </div>
  );
}

    
