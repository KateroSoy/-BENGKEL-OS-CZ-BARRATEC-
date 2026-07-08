import React, { useState, useEffect } from "react";
import { Wrench, Users, Plus } from "lucide-react";
import { motion } from "motion/react";
import { addService, addTechnician, getServices, getTechnicians } from "../../lib/mockApi";

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setServices(getServices());
    setTechnicians(getTechnicians());
    setLoading(false);
  };

  const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addService(Object.fromEntries(fd.entries()) as { name: string });
    e.currentTarget.reset();
    loadData();
  };

  const handleAddTech = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addTechnician(Object.fromEntries(fd.entries()) as { name: string; specialty?: string });
    e.currentTarget.reset();
    loadData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Layanan & Teknisi</h1>
        <p className="text-slate-500 mt-1">Kelola data master bengkel Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Services Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50/50">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3">
                <Wrench className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Tambah Layanan</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddService} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Nama Layanan</label>
                  <input 
                    name="name" 
                    required 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="Contoh: Ganti Oli, Tune Up"
                  />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-all flex justify-center items-center gap-2">
                  <Plus className="w-4 h-4" /> Simpan Layanan
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Daftar Layanan</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {services.map((s, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={s.id} 
                    className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="font-semibold text-slate-900">{s.name}</span>
                    </div>
                  </motion.div>
                ))}
                {services.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">Belum ada layanan.</div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technicians Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50/50">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg mr-3">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Tambah Teknisi</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddTech} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Nama Teknisi</label>
                  <input 
                    name="name" 
                    required 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Contoh: Budi, Andi"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Spesialisasi</label>
                  <input 
                    name="specialty" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Contoh: Mesin, Kelistrikan"
                  />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-all flex justify-center items-center gap-2">
                  <Plus className="w-4 h-4" /> Simpan Teknisi
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Daftar Teknisi</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {technicians.map((t, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={t.id} 
                    className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                        {t.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">{t.name}</span>
                        <span className="text-xs text-slate-500">{t.specialty || 'Umum'}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {technicians.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">Belum ada teknisi.</div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
