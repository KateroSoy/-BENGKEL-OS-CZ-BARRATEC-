import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, CheckCircle2, ListChecks, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createPublicBooking, getActiveServices, getSettings, getSlotInfo } from "../../lib/mockApi";
import { useTranslation } from "../../lib/i18n/LanguageContext";

type FormMode = 'selection' | 'wizard' | 'single';

export default function BookingForm() {
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();
  const [formMode, setFormMode] = useState<FormMode>('selection');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);

  // Form Draft state
  const [formData, setFormData] = useState<any>(() => {
    const saved = localStorage.getItem("bookingDraft");
    return saved ? JSON.parse(saved) : {
      customerName: "",
      customerPhone: "",
      customerType: "Pelanggan baru",
      carBrand: "",
      carModel: "",
      carYear: "",
      plateNumber: "",
      transmission: "Otomatis",
      serviceType: "",
      problemCategory: "",
      problemDescription: "",
      isDrivable: "Ya",
      additionalService: "Tunggu di bengkel",
      bookingDate: format(new Date(), "yyyy-MM-dd"),
      bookingTime: ""
    };
  });

  useEffect(() => {
    setSettings(getSettings());
    setServices(getActiveServices());
  }, []);

  useEffect(() => {
    localStorage.setItem("bookingDraft", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (formData.bookingDate && settings) {
      const data = getSlotInfo(formData.bookingDate);
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
    }
  }, [formData.bookingDate, settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If in wizard mode and not on the last step, just go next
    if (formMode === 'wizard' && step < 4) {
      handleNext();
      return;
    }
    
    setLoading(true);
    // Combine problem category and description
    const submitData = { ...formData };
    if (submitData.problemCategory) {
      submitData.problemDescription = `${submitData.problemCategory} - ${submitData.problemDescription}`;
    }
    submitData.carType = `${submitData.carBrand} ${submitData.carModel}`;

    createPublicBooking(submitData);
    localStorage.removeItem("bookingDraft");
    setLoading(false);
    navigate("/booking/success", { state: { booking: submitData } });
  };

  if (!settings) return <div className="min-h-screen bg-[var(--color-background)]" />;

  const inputClass = "w-full bg-[var(--color-background)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all shadow-sm";
  const labelClass = "block text-xs font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-widest";

  const renderStepIndicator = () => (
    <div className="flex justify-between relative mb-12">
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[var(--color-border-subtle)] -z-10"></div>
      <div className="absolute top-1/2 left-0 h-[2px] bg-[var(--color-primary)] -z-10 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
      {[
        { n: 1, label: t('booking.step1') },
        { n: 2, label: t('booking.step2') },
        { n: 3, label: t('booking.step3') },
        { n: 4, label: t('booking.step4') }
      ].map((s) => (
        <div key={s.n} className="flex flex-col items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all shadow-sm ${
            step >= s.n 
              ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' 
              : 'bg-white border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]'
          }`}>
            {step > s.n ? <CheckCircle2 className="w-5 h-5" /> : s.n}
          </div>
          <span className={`text-xs font-bold uppercase tracking-wide ${step >= s.n ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'} hidden sm:block`}>{s.label as string}</span>
        </div>
      ))}
    </div>
  );

  // Field renderers to avoid duplication
  const Step1Fields = () => (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold uppercase mb-2 text-[var(--color-text-primary)]">{t('booking.f.step1.title')}</h2>
        <p className="text-[var(--color-text-secondary)] text-sm font-medium">{t('booking.f.step1.desc')}</p>
      </div>
      <div className="space-y-6">
        <div>
          <label className={labelClass}>{t('booking.f.name')}</label>
          <input type="text" name="customerName" required value={formData.customerName} onChange={handleChange} className={inputClass} placeholder={t('booking.f.name.ph') as string} autoFocus />
        </div>
        <div>
          <label className={labelClass}>{t('booking.f.phone')}</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] font-bold">+62</span>
            <input type="tel" name="customerPhone" required value={formData.customerPhone} onChange={handleChange} className={`${inputClass} pl-14`} placeholder="81234567890" />
          </div>
        </div>
        <div>
          <label className={labelClass}>{t('booking.f.status')}</label>
          <div className="flex gap-4">
            {[t('booking.f.status.new'), t('booking.f.status.exist')].map(opt => (
              <label key={opt as string} className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors shadow-sm ${formData.customerType === opt ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]' : 'bg-white border-[var(--color-border-subtle)] hover:bg-gray-50 text-[var(--color-text-primary)]'}`}>
                <input type="radio" name="customerType" value={opt as string} checked={formData.customerType === opt} onChange={handleChange} className="hidden" />
                <span className="font-bold text-sm">{opt as string}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const Step2Fields = () => (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold uppercase mb-2 text-[var(--color-text-primary)]">{t('booking.f.step2.title')}</h2>
        <p className="text-[var(--color-text-secondary)] text-sm font-medium">{t('booking.f.step2.desc')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>{t('booking.f.brand')}</label>
          <select name="carBrand" required value={formData.carBrand} onChange={handleChange} className={inputClass}>
            <option value="">{t('booking.f.brand.ph')}</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Suzuki">Suzuki</option>
            <option value="Daihatsu">Daihatsu</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>{t('booking.f.model')}</label>
          <input type="text" name="carModel" required value={formData.carModel} onChange={handleChange} className={inputClass} placeholder={t('booking.f.model.ph') as string} />
        </div>
        <div>
          <label className={labelClass}>{t('booking.f.year')}</label>
          <input type="number" name="carYear" value={formData.carYear} onChange={handleChange} className={inputClass} placeholder="2018" />
        </div>
        <div>
          <label className={labelClass}>{t('booking.f.plate')}</label>
          <input type="text" name="plateNumber" value={formData.plateNumber} onChange={handleChange} className={inputClass} placeholder="B 1234 XYZ" />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>{t('booking.f.trans')}</label>
          <div className="flex gap-4">
            {[t('booking.f.trans.auto'), t('booking.f.trans.man')].map(opt => (
              <label key={opt as string} className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors shadow-sm ${formData.transmission === opt ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]' : 'bg-white border-[var(--color-border-subtle)] hover:bg-gray-50 text-[var(--color-text-primary)]'}`}>
                <input type="radio" name="transmission" value={opt as string} checked={formData.transmission === opt} onChange={handleChange} className="hidden" />
                <span className="font-bold text-sm">{opt as string}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const Step3Fields = () => (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold uppercase mb-2 text-[var(--color-text-primary)]">{t('booking.f.step3.title')}</h2>
        <p className="text-[var(--color-text-secondary)] text-sm font-medium">{t('booking.f.step3.desc')}</p>
      </div>
      <div className="space-y-6">
        <div>
          <label className={labelClass}>{t('booking.f.srv')}</label>
          <select name="serviceType" required value={formData.serviceType} onChange={handleChange} className={inputClass}>
            <option value="">{t('booking.f.srv.ph')}</option>
            {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>{t('booking.f.prob')}</label>
          <select name="problemCategory" required value={formData.problemCategory} onChange={handleChange} className={inputClass}>
            <option value="">{t('booking.f.prob.ph')}</option>
            {settings.problemOptions?.map((p:string) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>{t('booking.f.desc')}</label>
          <textarea name="problemDescription" rows={3} value={formData.problemDescription} onChange={handleChange} className={inputClass} placeholder={t('booking.f.desc.ph') as string}></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>{t('booking.f.drive')}</label>
            <div className="flex gap-4">
              {[t('booking.f.drive.yes'), t('booking.f.drive.no')].map(opt => (
                <label key={opt as string} className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors shadow-sm ${formData.isDrivable === opt ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]' : 'bg-white border-[var(--color-border-subtle)] hover:bg-gray-50 text-[var(--color-text-primary)]'}`}>
                  <input type="radio" name="isDrivable" value={opt as string} checked={formData.isDrivable === opt} onChange={handleChange} className="hidden" />
                  <span className="font-bold text-sm">{opt as string}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>{t('booking.f.add')}</label>
            <select name="additionalService" value={formData.additionalService} onChange={handleChange} className={inputClass}>
              <option value="Tunggu di bengkel">Tunggu di bengkel / Wait</option>
              <option value="Tinggal kendaraan">Tinggal kendaraan / Leave</option>
              <option value="Jemput kendaraan">Jemput kendaraan / Pickup</option>
              <option value="Antar kendaraan">Antar kendaraan / Delivery</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const Step4Fields = () => (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold uppercase mb-2 text-[var(--color-text-primary)]">{t('booking.f.step4.title')}</h2>
        <p className="text-[var(--color-text-secondary)] text-sm font-medium">{t('booking.f.step4.desc')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>{t('booking.f.date')}</label>
          <input type="date" name="bookingDate" required value={formData.bookingDate} onChange={handleChange} min={format(new Date(), "yyyy-MM-dd")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('booking.f.time')}</label>
          <select name="bookingTime" required value={formData.bookingTime} onChange={handleChange} className={inputClass}>
            <option value="">{t('booking.f.time.ph')}</option>
            {availableSlots.map(slot => (
              <option key={slot.time} value={slot.time} disabled={slot.isFull}>
                {slot.time} {slot.isFull ? "(Penuh/Full)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-[var(--color-border-subtle)]">
        <h3 className="font-bold text-lg mb-4 text-[var(--color-text-primary)]">{t('booking.f.summary')}</h3>
        <div className="bg-[var(--color-background)] p-5 rounded-lg border border-[var(--color-border-subtle)] space-y-4 text-sm shadow-inner">
          <div className="flex justify-between border-b border-[var(--color-border-subtle)] pb-2">
            <span className="text-[var(--color-text-secondary)] font-medium">{t('booking.f.owner')}</span>
            <span className="font-bold text-[var(--color-text-primary)]">{formData.customerName || "-"}</span>
          </div>
          <div className="flex justify-between border-b border-[var(--color-border-subtle)] pb-2">
            <span className="text-[var(--color-text-secondary)] font-medium">{t('booking.f.vehicle')}</span>
            <span className="font-bold text-[var(--color-text-primary)]">{formData.carBrand} {formData.carModel} ({formData.plateNumber || "-"})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)] font-medium">{t('booking.f.service')}</span>
            <span className="font-bold text-[var(--color-text-primary)]">{formData.serviceType || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] pb-24 md:pb-12">
      
      {/* Header */}
      <div className="bg-white border-b border-[var(--color-border-subtle)] px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Link to="/home" className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors text-[var(--color-text-secondary)]">
          <ArrowLeft className="w-5 h-5" /> <span className="font-bold hidden sm:inline">{t('booking.back')}</span>
        </Link>
        <div className="flex-1 flex items-center justify-center gap-2">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="h-8 w-auto object-contain hidden sm:block" />
          ) : (
            <div className="hidden sm:flex w-8 h-8 bg-black items-center justify-center font-display font-bold text-white text-sm">
              {settings?.workshopName?.charAt(0) || "B"}
            </div>
          )}
          <span className="font-display font-bold text-xl uppercase tracking-widest text-center">{settings?.workshopName}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-md p-0.5">
            <button onClick={() => setLanguage('en')} className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-all rounded-sm ${language === 'en' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'}`}>EN</button>
            <button onClick={() => setLanguage('id')} className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-all rounded-sm ${language === 'id' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'}`}>ID</button>
          </div>
          {formMode !== 'selection' && (
            <button onClick={() => setFormMode('selection')} className="text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] uppercase tracking-wider underline hidden sm:inline">
              {t('booking.mode.btn')}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 pt-12">
        {formMode === 'selection' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="text-center">
              <h1 className="font-display text-4xl font-bold uppercase mb-4 text-[var(--color-text-primary)]">{t('booking.mode.btn')}</h1>
              <p className="text-[var(--color-text-secondary)] text-lg font-medium">{t('booking.mode.desc')}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <button 
                onClick={() => setFormMode('wizard')}
                className="bg-white border border-[var(--color-border-subtle)] p-10 rounded-2xl flex flex-col items-center text-center hover:border-[var(--color-primary)] hover:shadow-xl hover:shadow-[var(--color-primary)]/10 transition-all group"
              >
                <div className="w-20 h-20 rounded-full bg-[var(--color-background)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ListChecks className="w-10 h-10 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase mb-3 text-[var(--color-text-primary)]">{t('booking.mode.wizard')}</h3>
                <p className="text-[var(--color-text-secondary)] font-medium leading-relaxed">{t('booking.mode.wizard.desc')}</p>
              </button>

              <button 
                onClick={() => setFormMode('single')}
                className="bg-white border border-[var(--color-border-subtle)] p-10 rounded-2xl flex flex-col items-center text-center hover:border-[var(--color-primary)] hover:shadow-xl hover:shadow-[var(--color-primary)]/10 transition-all group"
              >
                <div className="w-20 h-20 rounded-full bg-[var(--color-background)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-10 h-10 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase mb-3 text-[var(--color-text-primary)]">{t('booking.mode.single')}</h3>
                <p className="text-[var(--color-text-secondary)] font-medium leading-relaxed">{t('booking.mode.single.desc')}</p>
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {formMode === 'wizard' && renderStepIndicator()}
            
            <form onSubmit={handleSubmit} className="bg-white border border-[var(--color-border-subtle)] p-6 md:p-10 rounded-2xl shadow-lg shadow-gray-200/50">
              
              {formMode === 'wizard' ? (
                <AnimatePresence mode="wait">
                  {step === 1 && <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Step1Fields /></motion.div>}
                  {step === 2 && <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Step2Fields /></motion.div>}
                  {step === 3 && <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Step3Fields /></motion.div>}
                  {step === 4 && <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><Step4Fields /></motion.div>}
                </AnimatePresence>
              ) : (
                <div className="space-y-16">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}><Step1Fields /></motion.div>
                  <div className="h-px bg-gray-100"></div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}><Step2Fields /></motion.div>
                  <div className="h-px bg-gray-100"></div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}><Step3Fields /></motion.div>
                  <div className="h-px bg-gray-100"></div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}><Step4Fields /></motion.div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-10 pt-8 border-t border-[var(--color-border-subtle)]">
                {formMode === 'wizard' && step > 1 ? (
                  <button type="button" onClick={handlePrev} className="px-6 py-3 font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                    {t('booking.prev')}
                  </button>
                ) : (
                  <div></div>
                )}
                
                <button type="submit" disabled={loading} className="bg-[var(--color-primary)] text-white px-8 py-4 rounded font-bold hover:bg-[var(--color-primary-hover)] transition-all flex items-center gap-2 shadow-md">
                  {loading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (formMode === 'wizard' && step < 4) ? (
                    <>{t('booking.next')} <ArrowRight className="w-5 h-5" /></>
                  ) : (
                    <>{t('booking.submit')} <CheckCircle2 className="w-5 h-5" /></>
                  )}
                </button>
              </div>

            </form>
          </>
        )}
      </div>
    </div>
  );
}
