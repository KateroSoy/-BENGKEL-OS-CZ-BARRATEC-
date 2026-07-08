import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, CheckCircle2, Clock, FileText, PlusCircle, Wrench, ArrowRight, Activity, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats").then(res => res.json()).then(setStats);
  }, []);

  const getStatusCount = (statusName: string) => {
    if (!stats || !stats.statuses) return 0;
    const s = stats.statuses.find((x: any) => x.status === statusName);
    return s ? s.count : 0;
  };

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Memuat dashboard...</p>
      </div>
    );
  }

  const kpiData = [
    {
      title: "Total Hari Ini",
      value: stats.todayTotal,
      icon: FileText,
      color: "blue",
      trend: "+12% dari kemarin"
    },
    {
      title: "Menunggu",
      value: getStatusCount("Baru") + getStatusCount("Menunggu Konfirmasi"),
      icon: Clock,
      color: "amber",
      trend: "Butuh tindakan"
    },
    {
      title: "Dikerjakan",
      value: getStatusCount("Sedang Dikerjakan"),
      icon: Wrench,
      color: "indigo",
      trend: "Sedang berjalan"
    },
    {
      title: "Selesai",
      value: getStatusCount("Selesai"),
      icon: CheckCircle2,
      color: "emerald",
      trend: "Siap diambil"
    }
  ];

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Ringkasan</h1>
          <p className="text-slate-500 mt-1.5 text-sm font-medium flex items-center">
            <Activity className="w-4 h-4 mr-2" /> Metrik operasional langsung
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-3 w-full sm:w-auto"
        >
          <Link to="/admin/bookings/new" className="flex-1 sm:flex-none">
            <button className="w-full bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 group">
              <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
              Booking Baru
            </button>
          </Link>
        </motion.div>
      </div>

      {/* KPI Grid */}
      <div id="tour-stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-8">
              <div className={`p-3 rounded-2xl bg-${item.color}-50 text-${item.color}-600 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                <item.icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <div className={`flex items-center text-xs font-semibold px-2 py-1 bg-slate-50 text-slate-500 rounded-lg`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {item.trend.split(' ')[0]}
              </div>
            </div>
            
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{item.title}</p>
              <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{item.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Aksi Cepat Bento */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div id="tour-quick-actions" className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900">Aksi Cepat</h3>
          </div>
          <div className="p-6 grid sm:grid-cols-2 gap-4 flex-1 bg-gradient-to-br from-white to-slate-50/50">
            <Link to="/admin/bookings/today" className="group">
              <div className="h-full p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5 transition-all flex flex-col items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Jadwal & Kalender</h4>
                  <p className="text-sm text-slate-500">Lihat dan kelola jadwal servis hari ini.</p>
                </div>
                <div className="mt-auto pt-4 text-sm font-semibold text-blue-600 flex items-center">
                  Buka Kalender <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            
            <Link to="/admin/services" className="group">
              <div className="h-full p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-900/5 transition-all flex flex-col items-start gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Wrench className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Layanan & Teknisi</h4>
                  <p className="text-sm text-slate-500">Konfigurasi data master untuk layanan, harga, dan staf.</p>
                </div>
                <div className="mt-auto pt-4 text-sm font-semibold text-indigo-600 flex items-center">
                  Kelola Layanan <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Empty State / placeholder for recent activity */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-900"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
              <Activity className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aktivitas Terkini</h3>
            <p className="text-sm text-slate-400 max-w-[200px] mx-auto">
              Pembaruan langsung akan muncul di sini saat bengkel mulai beroperasi.
            </p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
