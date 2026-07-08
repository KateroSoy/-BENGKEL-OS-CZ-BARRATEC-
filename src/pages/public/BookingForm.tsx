import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, Clock, Wrench, User, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function BookingForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  
  // Local state for fancy interactions
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings/public").then(res => res.json()).then(setSettings);
    fetch("/api/services/public").then(res => res.json()).then(data => setServices(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (date && settings) {
      fetch(`/api/slots?date=${date}`).then(res => res.json()).then(data => {
        const slots = [];
        const start = parseInt(data.settings.openTime.split(":")[0]);
        const end = parseInt(data.settings.closeTime.split(":")[0]);
        const interval = data.settings.slotIntervalMinutes;
        
        for (let i = start; i < end; i += (interval/60)) {
          const timeString = `${String(Math.floor(i)).padStart(2, '0')}:${String((i % 1) * 60).padStart(2, '0')}`;
          const bookedCount = data.bookings.find((b: any) => b.time === timeString)?.count || 0;
          slots.push({
            time: timeString,
            isFull: bookedCount >= data.settings.maxBookingPerSlot,
            available: data.settings.maxBookingPerSlot - bookedCount
          });
        }
        setAvailableSlots(slots);
      });
    }
  }, [date, settings]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    
    try {
      const res = await fetch("/api/bookings/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        navigate("/booking/success");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const inputClass = (id: string) => `
    w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 outline-none text-slate-900 bg-white
    ${focusedField === id ? 'border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.15)] ring-4 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'}
  `;

  const labelClass = "block text-sm font-bold text-slate-700 mb-2 ml-1";

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-blue-200 selection:text-blue-900 relative overflow-hidden py-10 px-4 sm:px-6">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-100/50 to-transparent blur-3xl rounded-full -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-100/40 to-transparent blur-3xl rounded-full -z-10 pointer-events-none"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-600 hover:text-slate-900 hover:shadow-md transition-all mb-8">
            <ArrowRight className="w-4 h-4 rotate-180" /> Kembali ke Beranda
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            {settings.workshopName}
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Jadwalkan perawatan kendaraan Anda dalam hitungan detik.
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 70 }}
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 shadow-[0_20px_60px_rgba(0,0,0,0.04)] overflow-hidden">
            
            <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Reservasi Online</h2>
                <p className="text-blue-100 text-sm mt-1">Lengkapi form di bawah ini</p>
              </div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-10">
              
              {/* Section 1: Customer Data */}
              <div className="space-y-6 relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
                  <h3 className="text-xl font-bold text-slate-900">Data Pemilik</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="relative group">
                    <label htmlFor="customerName" className={labelClass}>Nama Lengkap *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        id="customerName" 
                        name="customerName" 
                        required 
                        placeholder="Cth: Budi Santoso"
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClass('name')} pl-12`}
                      />
                    </div>
                  </div>
                  <div className="relative group">
                    <label htmlFor="customerPhone" className={labelClass}>Nomor WhatsApp *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 group-focus-within:text-blue-500 transition-colors">+62</span>
                      <input 
                        id="customerPhone" 
                        name="customerPhone" 
                        type="tel"
                        required 
                        placeholder="81234567890"
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClass('phone')} pl-14`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100"></div>

              {/* Section 2: Vehicle Data */}
              <div className="space-y-6 relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">2</div>
                  <h3 className="text-xl font-bold text-slate-900">Data Kendaraan</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="relative group">
                    <label htmlFor="carType" className={labelClass}>Tipe Kendaraan *</label>
                    <div className="relative">
                      <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        id="carType" 
                        name="carType" 
                        required 
                        placeholder="Cth: Honda HRV"
                        onFocus={() => setFocusedField('car')}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClass('car')} pl-12 focus:border-indigo-500 focus:ring-indigo-500/10`}
                      />
                    </div>
                  </div>
                  <div className="relative group">
                    <label htmlFor="plateNumber" className={labelClass}>Plat Nomor</label>
                    <input 
                      id="plateNumber" 
                      name="plateNumber" 
                      placeholder="Cth: B 1234 XYZ"
                      onFocus={() => setFocusedField('plate')}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputClass('plate')} uppercase focus:border-indigo-500 focus:ring-indigo-500/10`}
                    />
                  </div>
                  <div className="relative group sm:col-span-2">
                    <label htmlFor="serviceType" className={labelClass}>Jenis Layanan *</label>
                    <div className="relative">
                      <select 
                        id="serviceType" 
                        name="serviceType" 
                        required 
                        defaultValue=""
                        onFocus={() => setFocusedField('service')}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClass('service')} appearance-none cursor-pointer focus:border-indigo-500 focus:ring-indigo-500/10`}
                      >
                        <option value="" disabled>Pilih jenis perawatan...</option>
                        {services.map(s => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        ▼
                      </div>
                    </div>
                  </div>
                  <div className="relative group sm:col-span-2">
                    <label htmlFor="problemDescription" className={labelClass}>Keluhan / Problem *</label>
                    <textarea 
                      id="problemDescription" 
                      name="problemDescription" 
                      required 
                      rows={3}
                      placeholder="Ceritakan keluhan atau gejala pada kendaraan Anda secara detail..."
                      onFocus={() => setFocusedField('problem')}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputClass('problem')} resize-none focus:border-indigo-500 focus:ring-indigo-500/10`}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100"></div>

              {/* Section 3: Schedule */}
              <div className="space-y-6 relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">3</div>
                  <h3 className="text-xl font-bold text-slate-900">Jadwal Kedatangan</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="relative group">
                    <label htmlFor="bookingDate" className={labelClass}>Pilih Tanggal *</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input 
                        id="bookingDate" 
                        name="bookingDate" 
                        type="date" 
                        required 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={format(new Date(), "yyyy-MM-dd")}
                        onFocus={() => setFocusedField('date')}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClass('date')} pl-12 focus:border-emerald-500 focus:ring-emerald-500/10 cursor-pointer`}
                      />
                    </div>
                  </div>
                  <div className="relative group">
                    <label htmlFor="bookingTime" className={labelClass}>Pilih Slot Jam *</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <select 
                        id="bookingTime" 
                        name="bookingTime" 
                        required 
                        defaultValue=""
                        onFocus={() => setFocusedField('time')}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClass('time')} pl-12 appearance-none cursor-pointer focus:border-emerald-500 focus:ring-emerald-500/10`}
                      >
                        <option value="" disabled>Lihat jam tersedia...</option>
                        {availableSlots.map(slot => (
                          <option key={slot.time} value={slot.time} disabled={slot.isFull}>
                            {slot.time} {slot.isFull ? "(Penuh)" : `(${slot.available} slot tersedia)`}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-900 text-white text-lg font-bold py-5 px-6 rounded-2xl hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 disabled:opacity-70 group"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-slate-300 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Konfirmasi Booking <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></>
                  )}
                </button>
                <p className="text-center text-sm text-slate-500 mt-4 font-medium flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Data Anda aman bersama kami.
                </p>
              </div>

            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
