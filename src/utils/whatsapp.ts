import { formatPhone } from "../lib/utils";

export const WhatsAppHelper = {
  bookingReceived: (name: string, carType: string, date: string, time: string) => 
    `Halo Kak ${name}, booking servis mobil ${carType} tanggal ${date} jam ${time} sudah kami terima. Admin bengkel akan segera konfirmasi ya. Terima kasih.`,
  
  bookingConfirmed: (name: string, carType: string, date: string, time: string) => 
    `Halo Kak ${name}, booking servis mobil ${carType} tanggal ${date} jam ${time} sudah terkonfirmasi. Mohon datang tepat waktu ya. Terima kasih.`,
  
  reminderH1: (name: string, carType: string, time: string) => 
    `Halo Kak ${name}, kami ingatkan booking servis mobil ${carType} besok jam ${time}. Mohon datang tepat waktu ya. Terima kasih.`,
  
  vehicleDone: (name: string, carType: string, plate: string) => 
    `Halo Kak ${name}, kendaraan ${carType} dengan plat ${plate || '-'} sudah selesai dikerjakan. Silakan datang ke bengkel untuk pengambilan. Terima kasih.`,
  
  estimateInvoice: (name: string, carType: string, estimate: string, detail: string) => 
    `Halo Kak ${name}, estimasi biaya servis kendaraan ${carType} adalah Rp${estimate}. Detail pengerjaan: ${detail}. Terima kasih.`
};
