import React, { useState, useEffect } from "react";
import { Save, Settings as SettingsIcon, Building, Clock, MapPin, Phone, List, X, Plus, Image, CreditCard, Wallet, Wrench } from "lucide-react";
import { motion } from "motion/react";
import { getSettings, updateSettings } from "../../lib/mockApi";

function TagsInput({ name, initialTags, placeholder }: { name: string; initialTags: string[]; placeholder: string }) {
  const [tags, setTags] = useState<string[]>(initialTags || []);
  const [inputValue, setInputValue] = useState("");

  const handleAdd = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    const val = inputValue.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
    }
    setInputValue("");
  };

  const handleRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={tags.join('\n')} />
      <div className="flex gap-2">
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAdd}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
        />
        <button 
          type="button" 
          onClick={() => handleAdd()}
          className="px-4 py-2.5 bg-emerald-50 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-2 border border-emerald-200/50"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key={i} 
            className="flex items-center gap-2 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 shadow-sm"
          >
            {tag}
            <button 
              type="button" 
              onClick={() => handleRemove(tag)}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
        {tags.length === 0 && (
          <p className="text-sm text-slate-400 italic">Belum ada pilihan ditambahkan.</p>
        )}
      </div>
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState<any>(null);
  const [logoData, setLogoData] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const s = getSettings();
    setSettings(s);
    setLogoData(s.logoUrl || "");
    setLoading(false);
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar terlalu besar. Maksimal 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoData(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as any;
    data.logoUrl = logoData; // Use the uploaded base64 data

    // Convert numeric fields
    data.maxBookingPerSlot = Number(data.maxBookingPerSlot);
    data.slotIntervalMinutes = Number(data.slotIntervalMinutes);

    // Convert string to array
    if (typeof data.carTypes === 'string') {
      data.carTypes = data.carTypes.split('\n').map((s: string) => s.trim()).filter(Boolean);
    }
    if (typeof data.problemOptions === 'string') {
      data.problemOptions = data.problemOptions.split('\n').map((s: string) => s.trim()).filter(Boolean);
    }

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
              <div className="col-span-1 md:col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Gambar / Logo Bengkel (Opsional)</label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <input type="hidden" name="logoUrl" value={logoData} />
                </div>
                {logoData && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-500 mb-2">Pratinjau Logo:</p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block">
                      <img 
                        src={logoData} 
                        alt="Logo" 
                        className="max-h-24 w-auto object-contain" 
                        onError={() => setLogoData("")}
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setLogoData("")}
                      className="ml-4 text-sm text-red-500 font-medium hover:underline"
                    >
                      Hapus Logo
                    </button>
                  </div>
                )}
                {!logoData && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-500 mb-2">Pratinjau Default (Ikon Aplikasi):</p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                        <Wrench className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Account */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50/50">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg mr-3">
              <Wallet className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Informasi Rekening Pembayaran</h2>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Nama Bank / E-Wallet</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    name="bankName" 
                    defaultValue={settings?.bankName} 
                    placeholder="Cth: BCA / GoPay"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Atas Nama (Pemilik)</label>
                <div className="relative">
                  <input 
                    name="bankAccountName" 
                    defaultValue={settings?.bankAccountName} 
                    placeholder="Cth: PT Bengkel Sukses"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Nomor Rekening</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    name="bankAccountNumber" 
                    defaultValue={settings?.bankAccountNumber} 
                    placeholder="Cth: 1234567890"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
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

        {/* Dropdown Options */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50/50">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg mr-3">
              <List className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Pilihan Dropdown Booking</h2>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Pilihan Tipe Kendaraan</label>
                <TagsInput 
                  name="carTypes" 
                  initialTags={settings?.carTypes || []} 
                  placeholder="Ketik lalu tekan Enter..." 
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Pilihan Masalah / Keluhan</label>
                <TagsInput 
                  name="problemOptions" 
                  initialTags={settings?.problemOptions || []} 
                  placeholder="Ketik lalu tekan Enter..." 
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
