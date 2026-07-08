import { Link } from "react-router-dom";
import { User, ShieldCheck, Wrench, ArrowRight, Zap, Star, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-blue-500/30 selection:text-blue-200 relative overflow-hidden">
      
      {/* Glossy Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-blue-600/20 via-indigo-900/10 to-transparent blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[500px] bg-gradient-to-tl from-purple-600/10 to-transparent blur-[100px] pointer-events-none"></div>
      
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none bg-cover bg-center opacity-30 mix-blend-luminosity"
        style={{ backgroundImage: "url('/background.jpg')" }}
      ></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">BENGKEL OS</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60"
          >
            {/* <a href="#" className="hover:text-white transition-colors">Fitur</a>
            <a href="#" className="hover:text-white transition-colors">Harga</a>
            <a href="#" className="hover:text-white transition-colors">Kontak</a> */}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/admin/login">
              <button className="text-sm font-medium bg-white/10 border border-white/20 text-white px-5 py-2 rounded-full hover:bg-white/20 hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-md">
                Masuk
              </button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-20 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center mb-24"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-blue-300 text-xs font-semibold mb-8 uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.15)]">
            <Star className="w-3.5 h-3.5" />
            <span>Versi 2.0 telah rilis</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-balance leading-[1.1] mb-6">
            Kelola bengkel Anda <br className="hidden md:block" />
            secara <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">profesional.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/50 max-w-2xl text-balance mb-12 font-medium">
            Platform terpadu untuk bengkel otomotif modern. Kelola booking, teknisi, dan pantau perkembangan bisnis Anda dengan sentuhan elegan.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link to="/booking" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.3)] group">
                Booking Servis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/admin" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-semibold rounded-full border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md">
                <ShieldCheck className="w-5 h-5" /> Portal Pemilik
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Glossy Bento Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 80 }}
          className="grid md:grid-cols-5 gap-6 max-w-5xl mx-auto"
        >
          {/* Card 1 - Customer Portal */}
          <Link to="/booking" className="md:col-span-3 group outline-none">
            <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 h-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:bg-white/10 hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(37,99,235,0.2)] transition-all duration-500 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Glossy Reflection */}
              <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 rotate-45 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  <User className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">Portal Pelanggan</h3>
                <p className="text-white/60 mb-10 max-w-md text-lg leading-relaxed">
                  Booking servis kendaraan Anda secara online. Pantau status pengerjaan secara real-time dengan notifikasi otomatis.
                </p>
                <div className="mt-auto flex items-center font-bold text-blue-400 group-hover:text-blue-300">
                  Masuk Sekarang 
                  <div className="ml-3 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/40 transition-colors">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2 - Admin Portal */}
          <Link to="/admin" className="md:col-span-2 group outline-none">
            <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 h-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:bg-white/10 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] transition-all duration-500 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Glossy Reflection */}
              <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 rotate-45 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-8 border border-purple-500/30 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">Workspace</h3>
                <p className="text-white/60 mb-10 text-lg leading-relaxed">
                  Dashboard admin canggih untuk mengelola seluruh operasi bengkel.
                </p>
                <div className="mt-auto flex items-center font-bold text-purple-400 group-hover:text-purple-300">
                  Buka Dashboard
                  <div className="ml-3 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/40 transition-colors">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
