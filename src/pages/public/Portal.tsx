import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Wrench, User } from "lucide-react";

export default function Portal() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Customer Side */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen bg-white flex flex-col items-center justify-center p-8 relative group">
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center z-10 flex flex-col items-center">
          <div className="w-20 h-20 mb-8 border border-black/10 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform duration-500 bg-white">
            <User className="w-8 h-8 text-black" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tighter text-black mb-4">Saya Pelanggan</h2>
          <p className="text-gray-500 font-medium mb-10 max-w-sm">Booking servis kendaraan Anda dengan mudah, cepat, dan transparan tanpa perlu antre panjang.</p>
          <Link to="/home" className="bg-black text-white px-10 py-4 font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-4">
            Masuk <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Workspace Side */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen bg-black flex flex-col items-center justify-center p-8 relative group">
        <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-500 grayscale pointer-events-none"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-center z-10 flex flex-col items-center">
          <div className="w-20 h-20 mb-8 border border-white/20 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform duration-500 bg-black/50 backdrop-blur-md">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tighter text-white mb-4">Workspace Admin</h2>
          <p className="text-gray-400 font-medium mb-10 max-w-sm">Kelola jadwal booking, laporan keuangan, dan operasional bengkel dalam satu dashboard pintar.</p>
          <Link to="/admin/login" className="bg-white text-black px-10 py-4 font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-4">
            Masuk <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>

    </div>
  );
}
