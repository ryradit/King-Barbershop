
// src/app/actions/sendWhatsAppNotification.ts
'use server';

import { Twilio } from 'twilio';

interface BookingDetails {
  customerName: string;
  bookingDate: string; // e.g., "July 20, 2024" or "20 Juli 2024"
  bookingTime: string; // e.g., "10:00"
  customerPhone?: string;
  paymentMethod?: string;
  language: 'en' | 'id'; // Customer's language preference
}

export async function sendWhatsAppBookingNotification(details: BookingDetails): Promise<{ success: boolean; messageKey: { en: string; id: string } }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  // Ensure WhatsApp numbers are in the format: whatsapp:+14155238886
  const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_SENDER_NUMBER;
  const ownerWhatsAppNumber = process.env.OWNER_WHATSAPP_RECIPIENT_NUMBER;

  if (!accountSid || !authToken || !twilioWhatsAppNumber || !ownerWhatsAppNumber) {
    console.error('Twilio credentials or recipient number are not configured in .env. Please check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_SENDER_NUMBER, and OWNER_WHATSAPP_RECIPIENT_NUMBER.');
    return { 
      success: false, 
      messageKey: { 
        en: 'Twilio configuration is missing on the server. Notification not sent.', 
        id: 'Konfigurasi Twilio tidak ditemukan di server. Notifikasi tidak terkirim.' 
      } 
    };
  }
  
  // Validate WhatsApp number formats (basic check)
  if (!twilioWhatsAppNumber.startsWith('whatsapp:+') || !ownerWhatsAppNumber.startsWith('whatsapp:+')) {
    console.error('Twilio WhatsApp numbers must be in E.164 format prefixed with "whatsapp:+". Example: whatsapp:+12345678900');
     return { 
      success: false, 
      messageKey: { 
        en: 'Twilio WhatsApp number format is incorrect. Notification not sent.', 
        id: 'Format nomor WhatsApp Twilio salah. Notifikasi tidak terkirim.' 
      } 
    };
  }

  const client = new Twilio(accountSid, authToken);

  // Construct message in Bahasa Indonesia for the barber
  let messageBody = `🔔 Notifikasi Janji Temu: King Barbershop - Kutabumi 🔔\n=========================\n`;
  messageBody += `Pelanggan: ${details.customerName}\n`;
  messageBody += `Tanggal: ${details.bookingDate}\n`; // bookingDate is already localized by the calling function
  messageBody += `Waktu: ${details.bookingTime}\n`;
  if (details.customerPhone) {
    messageBody += `Telepon: ${details.customerPhone}\n`;
  }
  if (details.paymentMethod) {
    messageBody += `Pembayaran: ${details.paymentMethod}\n`; // paymentMethod is already localized by the calling function
  }
  messageBody += `Bahasa Pelanggan: ${details.language.toUpperCase()}`;


  try {
    await client.messages.create({
      from: twilioWhatsAppNumber,
      to: ownerWhatsAppNumber,
      body: messageBody,
    });
    console.log('WhatsApp booking notification sent successfully to owner.');
    return { 
      success: true, 
      messageKey: { 
        en: 'Booking notification sent to the barber.', 
        id: 'Notifikasi pemesanan telah dikirim ke barber.' 
      } 
    };
  } catch (error: any) {
    console.error('Failed to send WhatsApp booking notification:', error);
    // Log more details from Twilio error if available
    if (error.message) {
        console.error('Twilio error message:', error.message);
    }
    if (error.code) {
        console.error('Twilio error code:', error.code);
    }
    if (error.moreInfo) {
        console.error('Twilio more info:', error.moreInfo);
    }
    return { 
      success: false, 
      messageKey: { 
        en: 'Failed to send booking notification to the barber. Please check server logs.', 
        id: 'Gagal mengirim notifikasi pemesanan ke barber. Harap periksa log server.' 
      }
    };
  }
}
