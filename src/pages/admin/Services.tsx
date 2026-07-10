import React, { useState, useEffect } from "react";
import { Wrench, Users, Plus, Tag } from "lucide-react";
import { motion } from "motion/react";
import { addService, addTechnician, getServices, getTechnicians, getPromos, addPromo } from "../../lib/mockApi";

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceImage, setServiceImage] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setServices(getServices());
    setTechnicians(getTechnicians());
    setPromos(getPromos());
    setLoading(false);
  };

  const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as any;
    data.estimatedDuration = Number(data.estimatedDuration) || 0;
    data.estimatedPrice = Number(data.estimatedPrice) || 0;
    data.imageUrl = serviceImage;
    addService(data);
    e.currentTarget.reset();
    setServiceImage("");
    loadData();
  };

  const handleServiceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar terlalu besar. Maksimal 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setServiceImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddTech = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addTechnician(Object.fromEntries(fd.entries()) as { name: string; specialty?: string });
    e.currentTarget.reset();
    loadData();
  };

  const handleAddPromo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as any;
    data.originalPrice = Number(data.originalPrice);
    data.promoPrice = Number(data.promoPrice);
    addPromo(data);
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Estimasi Waktu (Menit)</label>
                    <input 
                      name="estimatedDuration" 
                      type="number"
                      required 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Estimasi Biaya (Rp)</label>
                    <input 
                      name="estimatedPrice" 
                      type="number"
                      required 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="250000"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Gambar Layanan (Opsional)</label>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleServiceImageUpload}
                    className="w-full px-4 py-2 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                  {serviceImage && (
                    <div className="mt-2">
                      <img src={serviceImage} alt="Preview" className="h-20 w-auto rounded-lg object-contain border border-slate-200" />
                    </div>
                  )}
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

      {/* Promos Section (Full Width) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50/50">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg mr-3">
              <Tag className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Tambah Promo Paketan</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleAddPromo} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Nama Paket Promo</label>
                  <input 
                    name="name" 
                    required 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Contoh: Paket Liburan Aman"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Deskripsi Paket</label>
                  <textarea 
                    name="description" 
                    required 
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                    placeholder="Contoh: Ganti Oli + Filter + Tune Up lengkap"
                  ></textarea>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Harga Normal (Rp)</label>
                  <input 
                    name="originalPrice" 
                    type="number"
                    required 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Contoh: 850000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Harga Promo (Rp)</label>
                  <input 
                    name="promoPrice" 
                    type="number"
                    required 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Contoh: 599000"
                  />
                </div>
              </div>
              <button type="submit" className="w-full mt-4 bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex justify-center items-center gap-2 shadow-lg shadow-emerald-500/20">
                <Plus className="w-4 h-4" /> Buat Promo Paketan
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900">Daftar Promo Paketan Aktif</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {promos.map((p, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={p.id} 
                  className="p-5 bg-white rounded-2xl border border-emerald-100 flex flex-col transition-colors shadow-sm relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-100 to-transparent -z-10 rounded-bl-3xl"></div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-slate-900">{p.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 flex-grow">{p.description}</p>
                  <div className="flex flex-col mt-auto pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400 line-through">Rp {p.originalPrice.toLocaleString('id-ID')}</span>
                    <span className="font-bold text-emerald-600 text-lg">Rp {p.promoPrice.toLocaleString('id-ID')}</span>
                  </div>
                </motion.div>
              ))}
              {promos.length === 0 && (
                <div className="col-span-full text-center py-8 text-slate-500 text-sm">Belum ada promo paketan.</div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
