import { Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft, CalendarCheck } from "lucide-react";
import { motion } from "motion/react";

export default function BookingSuccess() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-emerald-100/50 to-teal-100/30 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
        className="max-w-lg w-full"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-10 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] text-center relative overflow-hidden">
          
          {/* Top Edge Decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="mx-auto flex items-center justify-center h-28 w-28 rounded-full bg-emerald-50 mb-8 relative"
          >
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-[spin_3s_linear_infinite] border-t-emerald-300"></div>
            <CheckCircle2 className="h-14 w-14 text-emerald-500 relative z-10" />
          </motion.div>
          
          <div className="space-y-4 mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Booking Berhasil!</h2>
            <p className="text-slate-500 text-lg leading-relaxed text-balance">
              Luar biasa! Jadwal perawatan kendaraan Anda telah masuk ke sistem kami. 
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-10 text-left flex items-start gap-4">
             <CalendarCheck className="w-8 h-8 text-blue-500 shrink-0 mt-0.5" />
             <div>
                <h4 className="font-bold text-slate-900">Langkah Selanjutnya</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Admin bengkel kami akan segera meninjau jadwal Anda dan mengirimkan pesan konfirmasi beserta detail estimasi melalui WhatsApp.
                </p>
             </div>
          </div>

          <Link to="/">
            <button className="w-full bg-white text-slate-900 border-2 border-slate-200 font-bold py-4 px-6 rounded-2xl hover:bg-slate-50 hover:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all flex items-center justify-center gap-3 group shadow-sm">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </button>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link to="/admin/login" className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">
            Portal Karyawan
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
