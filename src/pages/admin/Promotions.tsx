import React, { useState, useEffect } from "react";
import { Tag, Calculator, Plus, TrendingUp, AlertCircle, Percent, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getCampaigns, addCampaign, Campaign } from "../../lib/mockApi";

const services = [
  { id: "s1", name: "Ganti Oli & Filter", basePrice: 350000, cost: 200000 },
  { id: "s2", name: "Tune Up Lengkap", basePrice: 500000, cost: 250000 },
  { id: "s3", name: "Servis Rem 4 Roda", basePrice: 400000, cost: 150000 },
  { id: "s4", name: "Servis AC Basic", basePrice: 250000, cost: 100000 },
];

export default function Promotions() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'calculator'>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Campaign Form State
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    code: "",
    discount: 10,
    status: "Active",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
  });

  useEffect(() => {
    setCampaigns(getCampaigns());
  }, []);

  // Calculator State
  const [calcServiceId, setCalcServiceId] = useState("s1");
  const [calcDiscount, setCalcDiscount] = useState(15);
  const [calcVolume, setCalcVolume] = useState(100); // Normal monthly volume
  const [calcVolumeIncrease, setCalcVolumeIncrease] = useState(30); // % increase due to promo

  // Calculator Logic
  const selectedService = services.find(s => s.id === calcServiceId) || services[0];
  
  const normalRevenue = selectedService.basePrice * calcVolume;
  const normalProfit = (selectedService.basePrice - selectedService.cost) * calcVolume;
  
  const promoPrice = selectedService.basePrice * (1 - calcDiscount / 100);
  const promoVolume = Math.round(calcVolume * (1 + calcVolumeIncrease / 100));
  
  const promoRevenue = promoPrice * promoVolume;
  const promoProfit = (promoPrice - selectedService.cost) * promoVolume;
  
  const profitDifference = promoProfit - normalProfit;
  const isProfitable = profitDifference >= 0;

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    addCampaign(newCampaign);
    setCampaigns(getCampaigns());
    setShowAddModal(false);
    setNewCampaign({
      name: "",
      code: "",
      discount: 10,
      status: "Active",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manajemen Promosi</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola kampanye diskon dan kalkulasi proyeksi keuntungan bengkel.</p>
        </div>
        {activeTab === 'campaigns' && (
          <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 text-sm">
            <Plus className="w-4 h-4" /> Buat Promo Baru
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/60 inline-flex shadow-sm mb-6">
        <button 
          onClick={() => setActiveTab('campaigns')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'campaigns' 
              ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <Tag className="w-4 h-4" /> Kampanye Aktif
        </button>
        <button 
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'calculator' 
              ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <Calculator className="w-4 h-4" /> Kalkulator ROI
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB A: CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <motion.div key="campaigns" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 font-semibold text-slate-600">Nama Kampanye</th>
                    <th className="px-6 py-4 font-semibold text-slate-600">Kode Promo</th>
                    <th className="px-6 py-4 font-semibold text-slate-600">Diskon</th>
                    <th className="px-6 py-4 font-semibold text-slate-600">Masa Berlaku</th>
                    <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                    <th className="px-6 py-4 font-semibold text-slate-600">Penggunaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {campaigns.length > 0 ? campaigns.map(campaign => (
                    <tr key={campaign.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{campaign.name}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono text-xs border border-slate-200">{campaign.code}</span>
                      </td>
                      <td className="px-6 py-4 text-blue-600 font-bold">{campaign.discount}%</td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {campaign.startDate} s/d {campaign.endDate || 'Selesai'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          campaign.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200/50' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{campaign.uses}x</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Belum ada kampanye promosi.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB B: CALCULATOR */}
        {activeTab === 'calculator' && (
          <motion.div key="calculator" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Form */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Percent className="w-5 h-5 text-blue-600" /> Skenario Promosi
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Layanan</label>
                  <select 
                    value={calcServiceId} 
                    onChange={e => setCalcServiceId(e.target.value)}
                    className="w-full border-slate-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 bg-slate-50 p-3"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (Harga: Rp {s.basePrice.toLocaleString('id-ID')})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Persentase Diskon (%)</label>
                  <input 
                    type="range" min="0" max="50" step="1" 
                    value={calcDiscount} 
                    onChange={e => setCalcDiscount(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                    <span>0%</span>
                    <span className="text-blue-600 font-bold text-sm">{calcDiscount}%</span>
                    <span>50%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Volume Normal /Bulan</label>
                    <input 
                      type="number" 
                      value={calcVolume} 
                      onChange={e => setCalcVolume(Number(e.target.value))}
                      className="w-full border-slate-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Target Kenaikan (%)</label>
                    <input 
                      type="number" 
                      value={calcVolumeIncrease} 
                      onChange={e => setCalcVolumeIncrease(Number(e.target.value))}
                      className="w-full border-slate-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-slate-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none"></div>

              <div>
                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2 relative z-10">
                  <TrendingUp className="w-5 h-5 text-blue-400" /> Proyeksi Keuntungan (Margin)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-8">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Tanpa Promosi</p>
                    <p className="text-2xl font-bold text-white mb-1">Rp {normalProfit.toLocaleString('id-ID')}</p>
                    <p className="text-sm text-slate-400">{calcVolume} Kendaraan</p>
                  </div>
                  
                  <div className={`border rounded-2xl p-5 relative overflow-hidden ${isProfitable ? 'bg-blue-600/10 border-blue-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[40px] pointer-events-none ${isProfitable ? 'bg-blue-500/20' : 'bg-red-500/20'}`}></div>
                    <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${isProfitable ? 'text-blue-300' : 'text-red-300'}`}>Dengan Promosi</p>
                    <p className="text-2xl font-bold text-white mb-1">Rp {promoProfit.toLocaleString('id-ID')}</p>
                    <p className="text-sm text-slate-300">{promoVolume} Kendaraan</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <div className={`p-4 rounded-xl flex items-start gap-3 border ${
                  isProfitable 
                    ? 'bg-green-500/10 border-green-500/20 text-green-300' 
                    : 'bg-red-500/10 border-red-500/20 text-red-300'
                }`}>
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm leading-relaxed">
                    {isProfitable ? (
                      <><strong>Strategi Bagus!</strong> Promosi ini diproyeksikan memberikan tambahan profit sebesar <strong className="text-white">Rp {profitDifference.toLocaleString('id-ID')}</strong> karena kenaikan volume menutup nilai diskon.</>
                    ) : (
                      <><strong>Peringatan Defisit:</strong> Diskon terlalu besar. Kenaikan volume {calcVolumeIncrease}% tidak cukup untuk menutup nilai diskon. Anda diproyeksikan rugi sebesar <strong className="text-white">Rp {Math.abs(profitDifference).toLocaleString('id-ID')}</strong> dari profit normal.</>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Campaign Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-900">Buat Promo Baru</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddCampaign} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Kampanye *</label>
                  <input type="text" required value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} className="w-full border-slate-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-slate-50" placeholder="Contoh: Promo Ramadhan" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kode Promo *</label>
                    <input type="text" required value={newCampaign.code} onChange={e => setNewCampaign({...newCampaign, code: e.target.value.toUpperCase()})} className="w-full border-slate-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-slate-50 uppercase font-mono" placeholder="RAMADHAN20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Diskon (%) *</label>
                    <input type="number" required min="1" max="100" value={newCampaign.discount} onChange={e => setNewCampaign({...newCampaign, discount: Number(e.target.value)})} className="w-full border-slate-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-slate-50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tgl Mulai *</label>
                    <input type="date" required value={newCampaign.startDate} onChange={e => setNewCampaign({...newCampaign, startDate: e.target.value})} className="w-full border-slate-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tgl Berakhir *</label>
                    <input type="date" required value={newCampaign.endDate} onChange={e => setNewCampaign({...newCampaign, endDate: e.target.value})} className="w-full border-slate-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-slate-50" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">Simpan Kampanye</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
