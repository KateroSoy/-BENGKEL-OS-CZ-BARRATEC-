import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { StatusBadge } from "../../components/ui/core";
import { ArrowLeft, MessageCircle, Clock, User, Wrench, FileText, ChevronRight } from "lucide-react";
import { createWhatsAppLink } from "../../lib/utils";
import { WhatsAppHelper } from "../../utils/whatsapp";
import { motion } from "motion/react";
import { getBookingById, getTechnicians, updateBookingStatus, updateBookingTechnician } from "../../lib/mockApi";

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
  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState<any[]>([]);

  useEffect(() => {
    loadBooking();
    setTechnicians(getTechnicians());
  }, [id]);

  const loadBooking = () => {
    setLoading(true);
    setBooking(id ? getBookingById(id) : null);
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
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      
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
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors font-medium text-sm group"
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
  );
}
