import React, { useState, useEffect } from "react";
import { Save, Settings as SettingsIcon, Building, Clock, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { getSettings, updateSettings } from "../../lib/mockApi";

export default function Settings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as any;

    // Convert numeric fields
    data.maxBookingPerSlot = Number(data.maxBookingPerSlot);
    data.slotIntervalMinutes = Number(data.slotIntervalMinutes);

    updateSettings(data);
    setSettings(getSettings());
    alert("Pengaturan berhasil disimpan.");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengaturan Bengkel</h1>
        <p className="text-slate-500 mt-1">Kelola profil dan konfigurasi booking</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Workshop Profile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50/50">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3">
              <Building className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Profil Bengkel</h2>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Nama Bengkel</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    name="workshopName" 
                    defaultValue={settings?.workshopName} 
                    required 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Nomor Telepon / WA</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    name="phone" 
                    defaultValue={settings?.phone} 
                    required 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Alamat Lengkap</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <textarea 
                    name="address" 
                    defaultValue={settings?.address} 
                    required 
                    rows={3}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Operational */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50/50">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg mr-3">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Operasional & Kapasitas</h2>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Jam Buka (HH:MM)</label>
                <input 
                  name="openTime" 
                  type="time" 
                  defaultValue={settings?.openTime} 
                  required 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Jam Tutup (HH:MM)</label>
                <input 
                  name="closeTime" 
                  type="time" 
                  defaultValue={settings?.closeTime} 
                  required 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Interval Booking (Menit)</label>
                <input 
                  name="slotIntervalMinutes" 
                  type="number" 
                  defaultValue={settings?.slotIntervalMinutes} 
                  required 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Maks Mobil Per Slot</label>
                <input 
                  name="maxBookingPerSlot" 
                  type="number" 
                  defaultValue={settings?.maxBookingPerSlot} 
                  required 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-end"
        >
          <button 
            type="submit" 
            disabled={saving}
            className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-medium hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-70"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </motion.div>

      </form>
    </div>
  );
}
