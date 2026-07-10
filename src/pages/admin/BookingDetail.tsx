import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { StatusBadge } from "../../components/ui/core";
import { ArrowLeft, MessageCircle, Clock, User, Wrench, FileText, ChevronRight, Image, Printer } from "lucide-react";
import { createWhatsAppLink } from "../../lib/utils";
import { WhatsAppHelper } from "../../utils/whatsapp";
import { motion } from "motion/react";
import { getBookingById, getTechnicians, updateBookingStatus, updateBookingTechnician, getSettings } from "../../lib/mockApi";

const statuses = [
  "Baru", "Menunggu Konfirmasi", "Terkonfirmasi", "Datang", 
  "Sedang Dikerjakan", "Menunggu Sparepart", "Selesai", "Batal", "Tidak Datang"
];

function StatusHistoryTimeline({ history }: { history: any[] }) {
  if (!history || history.length === 0) {
    return <p className="text-slate-400 text-sm italic">Belum ada riwayat status.</p>;
  }
  return (
    <div className="space-y-6">
      {history.map((h: any, index: number) => (
        <div key={h.id} className="flex gap-4">
          <div className="w-24 sm:w-32 text-xs text-slate-500 shrink-0 text-right font-medium pt-0.5">
            {format(new Date(h.changedAt), "dd MMM yyyy")}
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            {format(new Date(h.changedAt), "HH:mm")}
          </div>
          <div className={`border-l-2 ${index === history.length - 1 ? 'border-transparent' : 'border-blue-100'} pl-6 pb-6 relative flex-1`}>
            <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 ring-4 ring-white shadow-sm"></div>
            <p className="text-sm font-bold text-slate-900 leading-none">{h.newStatus}</p>
            {h.note && <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">{h.note}</p>}
            <p className="text-xs text-slate-400 mt-2 font-medium">Oleh: {h.adminName || "Sistem"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState<any[]>([]);

  useEffect(() => {
    loadBooking();
    setTechnicians(getTechnicians());
  }, [id]);

  const loadBooking = () => {
    setLoading(true);
    setBooking(id ? getBookingById(id) : null);
    setSettings(getSettings());
    setLoading(false);
  };

  const updateStatus = (newStatus: string) => {
    const note = prompt("Catatan (opsional):");
    if (note !== null && id) {
      updateBookingStatus(id, newStatus, note);
      loadBooking();
    }
  };

  const updateTechnician = (technicianId: string) => {
    if (id) {
      updateBookingTechnician(id, technicianId);
      loadBooking();
    }
  };

  const handleWA = (type: string) => {
    let msg = "";
    const b = booking;
    if (type === "confirm") {
      msg = WhatsAppHelper.bookingConfirmed(b.customerName, b.carType, b.bookingDate, b.bookingTime);
    } else if (type === "done") {
      msg = WhatsAppHelper.vehicleDone(b.customerName, b.carType, b.plateNumber);
    } else if (type === "reminder") {
      msg = WhatsAppHelper.reminderH1(b.customerName, b.carType, b.bookingTime);
    } else if (type === "invoice") {
      const estimate = prompt("Masukkan estimasi harga:", b.estimatedPrice || "");
      if (estimate) {
        msg = WhatsAppHelper.estimateInvoice(b.customerName, b.carType, estimate, b.serviceType);
      } else {
        return; 
      }
    } else {
      msg = `Halo Kak ${b.customerName}, dari BENGKEL OS CZ-BARRATEC.`;
    }
    window.open(createWhatsAppLink(b.customerPhone, msg), "_blank");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Memuat detail...</p>
      </div>
    );
  }
  if (!booking || booking.error) return <div className="text-red-500 p-8 text-center bg-red-50 rounded-2xl">Booking tidak ditemukan</div>;

  return (
    <>
    <div className="space-y-8 max-w-5xl mx-auto pb-10 print:hidden">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Detail Booking</h1>
          <p className="text-slate-500 text-sm mt-1 font-mono bg-slate-100 px-2 py-0.5 rounded-md inline-block">{booking.bookingCode}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={booking.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="md:col-span-2 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50/50">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3">
                <Wrench className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Info Kendaraan & Keluhan</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Mobil</p>
                <p className="font-bold text-slate-900 text-lg">{booking.carType} <span className="text-slate-400 font-medium text-base">{booking.carYear ? `(${booking.carYear})` : ''}</span></p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Plat Nomor</p>
                <p className="font-bold text-slate-900 text-lg">{booking.plateNumber || "-"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-slate-500 mb-1">Layanan</p>
                <p className="font-medium text-slate-900 bg-slate-50 inline-block px-3 py-1.5 rounded-lg border border-slate-100">{booking.serviceType}</p>
              </div>
              <div className="col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-500 mb-2 font-medium">Keluhan / Problem</p>
                <p className="text-slate-900 leading-relaxed">{booking.problemDescription}</p>
              </div>
              {booking.customerNote && (
                <div className="col-span-2 bg-amber-50 p-5 rounded-2xl border border-amber-100">
                  <p className="text-sm text-amber-600 mb-2 font-medium">Catatan Konsumen</p>
                  <p className="text-amber-900 leading-relaxed">{booking.customerNote}</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50/50">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg mr-3">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Riwayat Status</h2>
            </div>
            <div className="p-6">
              <StatusHistoryTimeline history={booking.history} />
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Status Update */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden p-6"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4">Update Status</h3>
            <select 
              value={booking.status} 
              onChange={(e) => updateStatus(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-sm font-medium transition-all appearance-none cursor-pointer"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </motion.div>

          {/* Payment Proof */}
          {booking.paymentProofBase64 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50/50">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg mr-3">
                  <Image className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Bukti Pembayaran</h2>
              </div>
              <div className="p-6">
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm group relative cursor-pointer" onClick={() => window.open(booking.paymentProofBase64, '_blank')}>
                  <img src={booking.paymentProofBase64} alt="Bukti Pembayaran" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">Lihat Penuh</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Customer */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50/50">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg mr-3">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Konsumen</h2>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <p className="text-lg font-bold text-slate-900">{booking.customerName}</p>
                <p className="text-sm font-medium text-slate-500 mt-1">{booking.customerPhone}</p>
              </div>
              
              <div className="space-y-2">
                <button 
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-bold text-sm group border border-blue-200 shadow-sm"
                  onClick={() => window.print()}
                >
                  <span className="flex items-center gap-2"><Printer className="w-4 h-4" /> Cetak Invoice (PDF)</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors font-medium text-sm group mt-4"
                  onClick={() => handleWA("chat")}
                >
                  <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Buka WhatsApp</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-colors font-medium text-sm group"
                  onClick={() => handleWA("confirm")}
                >
                  <span>Kirim Konfirmasi</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-colors font-medium text-sm group"
                  onClick={() => handleWA("reminder")}
                >
                  <span>Kirim Reminder (H-1)</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-colors font-medium text-sm group"
                  onClick={() => handleWA("invoice")}
                >
                  <span>Kirim Estimasi Harga</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-colors font-medium text-sm group"
                  onClick={() => handleWA("done")}
                >
                  <span>Kirim Info Selesai</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Technician Assignment */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50/50">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg mr-3">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Pilih Teknisi</h2>
            </div>
            <div className="p-6">
              <select 
                value={booking.technicianId || ""} 
                onChange={e => updateTechnician(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-sm font-medium transition-all appearance-none cursor-pointer"
              >
                <option value="">-- Belum Ditentukan --</option>
                {technicians.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </div>
    </div>

    {/* Invoice Print Layout */}
    <div className="hidden print:block max-w-4xl mx-auto bg-white min-h-screen">
      {/* Invoice Header */}
      <div className="flex items-start justify-between border-b-4 border-double border-gray-800 pb-6 mb-8">
        <div className="flex items-center gap-6">
          {settings?.logoUrl && settings.logoUrl.trim() !== '' && (
            <img 
              src={settings.logoUrl} 
              alt="Logo" 
              className="max-h-24 w-auto object-contain rounded-lg" 
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
              {settings?.workshopName || "BENGKEL OS CZ-BARRATEC"}
            </h1>
            <p className="text-gray-600 font-medium mt-1 text-lg">Layanan Servis Profesional</p>
            <div className="text-sm text-gray-500 mt-2 flex flex-col gap-0.5">
              <p>{settings?.address}</p>
              <p>Telp/WA: {settings?.phone}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-black text-gray-200 tracking-widest uppercase mb-4">Invoice</h2>
          <div className="text-sm text-gray-600">
            <p className="font-bold text-gray-900 mb-1">No. Invoice:</p>
            <p className="font-mono bg-gray-100 px-3 py-1 rounded-md inline-block">{booking.bookingCode}</p>
            <p className="mt-3 font-bold text-gray-900 mb-1">Tanggal Transaksi:</p>
            <p>{booking.bookingDate} {booking.bookingTime}</p>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-8 grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Tagihan Kepada</h3>
          <p className="text-lg font-bold text-gray-900">{booking.customerName}</p>
          <p className="text-gray-600 mt-1">{booking.customerPhone}</p>
        </div>
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Informasi Kendaraan</h3>
          <p className="text-lg font-bold text-gray-900">{booking.carType}</p>
          <p className="text-gray-600 font-mono mt-1">{booking.plateNumber || "-"}</p>
        </div>
      </div>

      {/* Invoice Table */}
      <table className="w-full text-left border-collapse mb-12">
        <thead className="bg-gray-100 text-gray-900 border-y-2 border-gray-800">
          <tr>
            <th className="py-3 px-4 w-12 text-center">NO</th>
            <th className="py-3 px-4">DESKRIPSI LAYANAN / KELUHAN</th>
            <th className="py-3 px-4 text-right">TOTAL</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="py-4 px-4 text-center font-medium">1</td>
            <td className="py-4 px-4">
              <p className="font-bold text-gray-900 text-base">{booking.serviceType}</p>
              <p className="text-sm text-gray-500 mt-1 max-w-lg">{booking.problemDescription}</p>
            </td>
            <td className="py-4 px-4 text-right font-medium text-gray-900">
              {booking.estimatedPrice ? `Rp ${booking.estimatedPrice.toLocaleString('id-ID')}` : '-'}
            </td>
          </tr>
        </tbody>
        <tfoot className="border-t-2 border-gray-800">
          <tr>
            <td colSpan={2} className="py-4 px-4 text-right font-bold text-gray-900 uppercase">Total Tagihan</td>
            <td className="py-4 px-4 text-right font-bold text-xl text-gray-900 bg-gray-50">
              {booking.estimatedPrice ? `Rp ${booking.estimatedPrice.toLocaleString('id-ID')}` : '-'}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Signatures */}
      <div className="mt-20 flex justify-between px-10">
        <div className="text-center">
          <p className="text-gray-900 mb-20">Pelanggan,</p>
          <div className="w-48 border-b border-gray-800 mx-auto"></div>
          <p className="text-gray-900 mt-2 font-bold">{booking.customerName}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-900 mb-20">Hormat Kami,</p>
          <div className="w-48 border-b border-gray-800 mx-auto"></div>
          <p className="text-gray-900 mt-2 font-bold">{settings?.ownerName || "Kasir / Bengkel"}</p>
        </div>
      </div>
      
      {/* Footer Note */}
      <div className="mt-16 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
        Terima kasih atas kepercayaan Anda menggunakan layanan kami.
      </div>
    </div>
    </>
  );
}
