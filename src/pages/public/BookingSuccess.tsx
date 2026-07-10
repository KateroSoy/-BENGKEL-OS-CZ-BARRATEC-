import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, MapPin, MessageCircle, Download, RotateCcw, Calendar, User, Wrench, Clock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { getSettings } from "../../lib/mockApi";

export default function BookingSuccess() {
  const location = useLocation();
  const booking = location.state?.booking;
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const bookingCode = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

  const waMessage = `Halo Admin, saya ${booking?.customerName || 'Pelanggan'}. Saya sudah membuat booking dengan kode ${bookingCode} untuk kendaraan ${booking?.carBrand || ''} ${booking?.carModel || ''} pada ${booking?.bookingDate || ''} jam ${booking?.bookingTime || ''}. Mohon konfirmasinya.`;
  const waLink = settings?.phone ? `https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}` : '#';

  const handleSave = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans py-12 px-5 md:px-12 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      <div className="max-w-2xl mx-auto z-10 relative">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded shadow-2xl p-6 md:p-10 relative overflow-hidden">
          
          <div className="flex flex-col items-center text-center mb-10 border-b border-[var(--color-border-subtle)] pb-10">
            <div className="w-20 h-20 bg-[var(--color-success)]/10 rounded-full flex items-center justify-center mb-6 border border-[var(--color-success)]/30">
              <CheckCircle2 className="w-10 h-10 text-[var(--color-success)]" />
            </div>
            <h1 className="font-display text-3xl font-bold uppercase mb-2">Booking Berhasil Dikirim</h1>
            <p className="text-[var(--color-text-secondary)]">Kode Booking: <strong className="text-white text-lg ml-2 tracking-widest">{bookingCode}</strong></p>
            
            <div className="mt-6 flex items-center gap-2 bg-[var(--color-warning)]/10 text-[var(--color-warning)] px-4 py-2 rounded text-sm font-bold border border-[var(--color-warning)]/20">
              <Clock className="w-4 h-4" />
              Status: Menunggu Konfirmasi (Estimasi 15 menit)
            </div>
          </div>

          <div className="space-y-6 mb-10">
            <h3 className="font-bold uppercase tracking-widest text-[var(--color-text-secondary)] text-sm mb-4">Detail Reservasi</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--color-background)] p-6 rounded border border-[var(--color-border-subtle)]">
              <div className="flex gap-3">
                <User className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)] uppercase">Nama Pelanggan</p>
                  <p className="font-bold">{booking?.customerName || "-"}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Wrench className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)] uppercase">Kendaraan & Layanan</p>
                  <p className="font-bold">{booking?.carBrand} {booking?.carModel}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{booking?.serviceType || "-"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)] uppercase">Jadwal Kedatangan</p>
                  <p className="font-bold">{booking?.bookingDate || "-"}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">Jam: {booking?.bookingTime || "-"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)] uppercase">Lokasi Bengkel</p>
                  <p className="font-bold">{settings?.workshopName || "Bengkel"}</p>
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-1">{settings?.address || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href={waLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-black font-bold py-3 px-4 rounded hover:bg-[#20b858] transition-colors">
              <MessageCircle className="w-5 h-5" /> Konfirmasi via WhatsApp
            </a>
            <button onClick={handleSave} className="flex items-center justify-center gap-2 bg-[var(--color-background)] border border-[var(--color-border-subtle)] text-white font-bold py-3 px-4 rounded hover:bg-white/5 transition-colors">
              <Download className="w-5 h-5" /> Simpan Detail Booking
            </button>
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[var(--color-background)] border border-[var(--color-border-subtle)] text-white font-bold py-3 px-4 rounded hover:bg-white/5 transition-colors">
              <MapPin className="w-5 h-5" /> Lihat Lokasi
            </a>
            <Link to="/booking" className="flex items-center justify-center gap-2 bg-[var(--color-background)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] font-bold py-3 px-4 rounded hover:bg-white/5 transition-colors">
              <RotateCcw className="w-5 h-5" /> Buat Booking Baru
            </Link>
          </div>

          <div className="mt-8 text-center print:hidden">
            <Link to="/home" className="text-sm text-[var(--color-primary)] hover:underline">Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
