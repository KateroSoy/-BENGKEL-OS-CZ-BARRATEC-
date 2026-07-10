import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Clock, MapPin, Phone, Menu, X, ShieldCheck, CheckCircle2, ChevronRight, Star, PenTool, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getSettings, getServices, Settings, Service } from "../../lib/mockApi";
import { useTranslation } from "../../lib/i18n/LanguageContext";

export default function Landing() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useTranslation();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    setSettings(getSettings());
    setServices(getServices().filter(s => s.isActive));
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const faqs = [
    { q: t('faq.1.q'), a: t('faq.1.a') },
    { q: t('faq.2.q'), a: t('faq.2.a') },
    { q: t('faq.3.q'), a: t('faq.3.a') },
    { q: t('faq.4.q'), a: t('faq.4.a') },
    { q: t('faq.5.q'), a: t('faq.5.a') },
  ];

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans overflow-x-hidden selection:bg-black selection:text-white scroll-smooth">
      
      {/* 1. UTILITY BAR */}
      <div className="hidden md:flex border-b border-black/5 text-xs text-gray-500 py-2 px-6 justify-between items-center bg-white z-50 relative">
        <div className="flex gap-8 items-center tracking-wide">
          <div className="flex items-center gap-2">
            <span className="font-bold text-black uppercase">{t('nav.operational')}</span>
            <span>{settings?.openTime || "08:00"} – {settings?.closeTime || "17:00"} WIB</span>
          </div>
        </div>
        <div className="flex gap-4 items-center tracking-wide">
          <span className="flex items-center gap-2">
            <span className="font-bold text-black uppercase">{t('nav.contact')}</span>
            {settings?.phone || "08xx-xxxx-xxxx"}
          </span>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-black/5 py-3 shadow-sm' : 'bg-transparent py-6 md:top-10'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-8 md:h-10 object-contain" />
            ) : (
              <div className="w-10 h-10 bg-black flex items-center justify-center font-display font-bold text-white">
                {settings?.workshopName?.charAt(0) || "B"}
              </div>
            )}
            <span className="font-display font-bold tracking-tighter text-xl hidden sm:block uppercase">
              {settings?.workshopName || "DRIVE AUTO"}
            </span>
          </div>

          <div className="hidden md:flex gap-8 items-center text-sm font-bold text-black/70 uppercase tracking-widest">
            <a href="#layanan" className="hover:text-black transition-colors">{t('nav.services')}</a>
            <a href="#cara-booking" className="hover:text-black transition-colors">{t('nav.process')}</a>
            <a href="#ulasan" className="hover:text-black transition-colors">{t('nav.reviews')}</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-gray-100 rounded-md p-1 border border-black/5">
              <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-[11px] font-bold uppercase transition-all rounded-sm ${language === 'en' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'}`}>EN</button>
              <button onClick={() => setLanguage('id')} className={`px-3 py-1 text-[11px] font-bold uppercase transition-all rounded-sm ${language === 'id' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'}`}>ID</button>
            </div>
            <Link to="/booking" className="hidden sm:flex bg-black text-white font-bold px-7 py-3 hover:bg-gray-800 transition-colors text-xs tracking-widest uppercase rounded-sm">
              {t('nav.book')}
            </Link>
            <button className="md:hidden text-black" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-50 flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-10 pt-2">
              <span className="font-display font-bold text-xl uppercase tracking-tighter">{settings?.workshopName}</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-black"><X className="w-8 h-8" /></button>
            </div>
            
            <div className="flex bg-gray-100 rounded-sm mb-8 self-start">
              <button onClick={() => { setLanguage('en'); setMobileMenuOpen(false); }} className={`px-4 py-2 text-sm font-bold uppercase transition-colors ${language === 'en' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-200'}`}>EN</button>
              <button onClick={() => { setLanguage('id'); setMobileMenuOpen(false); }} className={`px-4 py-2 text-sm font-bold uppercase transition-colors ${language === 'id' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-200'}`}>ID</button>
            </div>

            <div className="flex flex-col gap-6 text-2xl font-display font-bold uppercase tracking-tight">
              <a href="#layanan" onClick={() => setMobileMenuOpen(false)} className="hover:text-gray-400 transition-colors">{t('nav.services')}</a>
              <a href="#cara-booking" onClick={() => setMobileMenuOpen(false)} className="hover:text-gray-400 transition-colors">{t('nav.process')}</a>
              <a href="#ulasan" onClick={() => setMobileMenuOpen(false)} className="hover:text-gray-400 transition-colors">{t('nav.reviews')}</a>
            </div>
            <div className="mt-auto pb-8">
              <Link to="/booking" className="flex items-center justify-center gap-2 py-4 bg-black text-white font-bold uppercase tracking-widest text-sm rounded-sm">
                {t('nav.book')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. HERO SECTION */}
      <section className="relative pt-28 md:pt-32 pb-16 flex flex-col lg:flex-row items-center min-h-[85vh] max-w-[1440px] mx-auto">
        <div className="w-full lg:w-1/2 flex flex-col items-start px-6 md:px-12 z-10 py-8 lg:py-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-8">
            <span className="w-6 h-[1px] bg-gray-500"></span>
            {t('hero.subtitle')}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-[48px] leading-[1.05] md:text-[72px] lg:text-[84px] font-bold text-black mb-8 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: t('hero.title').replace('. ', '.<br/>') }}>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-500 text-lg max-w-md mb-10 leading-relaxed font-medium">
            {t('hero.desc')}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/booking" className="bg-black text-white px-8 py-4 font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 group text-sm uppercase tracking-widest rounded-sm">
              {t('hero.btn')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Sharp Image Block */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-[85vh] px-6 lg:px-0 lg:pr-12 pb-8 lg:pb-0 mt-8 lg:mt-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full h-full bg-[url('/background.jpg')] bg-cover bg-center grayscale-[20%] contrast-125 rounded-sm"
          ></motion.div>
        </div>
      </section>

      {/* 4. TRUST STRIP */}
      <div className="border-y border-black/5 bg-white py-8">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-wrap md:flex-nowrap justify-between gap-8 overflow-x-auto hide-scrollbar">
          {[
            { label: t('trust.1.title'), sub: t('trust.1.sub') },
            { label: t('trust.2.title'), sub: t('trust.2.sub') },
            { label: t('trust.3.title'), sub: t('trust.3.sub') },
            { label: t('trust.4.title'), sub: t('trust.4.sub') },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-1 shrink-0">
              <span className="font-bold text-sm text-black uppercase tracking-widest">{item.label as string}</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest">{item.sub as string}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. SERVICE CATEGORIES */}
      <section id="layanan" className="py-20 md:py-28 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4 max-w-2xl text-black leading-tight">{t('services.title')}</h2>
            </div>
            <Link to="/booking" className="shrink-0 text-xs font-bold uppercase tracking-[0.2em] text-black hover:text-gray-500 transition-colors flex items-center gap-2 pb-1 border-b-2 border-black">
              {t('services.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {[
              { id: '01', name: t('landing.srv.1.name'), img: "/images/service_oli.png", desc: t('landing.srv.1.desc') },
              { id: '02', name: t('landing.srv.2.name'), img: "/images/service_rem.png", desc: t('landing.srv.2.desc') },
              { id: '03', name: t('landing.srv.3.name'), img: "/images/service_aki.png", desc: t('landing.srv.3.desc') },
              { id: '04', name: t('landing.srv.4.name'), img: "/images/service_ac.png", desc: t('landing.srv.4.desc') },
            ].map((srv, i) => (
              <div key={i} className="group flex flex-col cursor-pointer">
                <div className="h-[280px] overflow-hidden mb-5 bg-gray-50 rounded-sm">
                  <img src={srv.img} alt={srv.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out transform group-hover:scale-105" />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold uppercase tracking-tight text-black">{srv.name}</h3>
                  <span className="text-xs font-bold text-gray-400">{srv.id}</span>
                </div>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS */}
      <section id="cara-booking" className="py-20 md:py-28 bg-[#FAFAFA] border-y border-black/5">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-20 text-black">{t('process.title')}</h2>
          <div className="grid md:grid-cols-4 gap-12 md:gap-6">
            {[
              { num: "01", title: t('process.1.title'), desc: t('process.1.desc') },
              { num: "02", title: t('process.2.title'), desc: t('process.2.desc') },
              { num: "03", title: t('process.3.title'), desc: t('process.3.desc') },
              { num: "04", title: t('process.4.title'), desc: t('process.4.desc') },
            ].map((step, i) => (
              <div key={i} className="flex flex-col border-t border-black/10 pt-6">
                <div className="font-display text-3xl font-bold text-black mb-8">
                  {step.num}
                </div>
                <h3 className="text-base font-bold mb-3 text-black uppercase tracking-widest">{step.title as string}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{step.desc as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. WHY CHOOSE US */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <div className="lg:w-1/2 flex flex-col justify-center">
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[1.1] mb-8 text-black" dangerouslySetInnerHTML={{ __html: t('whyus.title').replace(' ', ' <br/>') }}></h2>
            <p className="text-lg text-gray-500 font-medium mb-12 max-w-md leading-relaxed">{t('whyus.desc')}</p>
            
            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8">
              {[
                t('landing.why.1'), t('landing.why.2'), 
                t('landing.why.3'), t('landing.why.4'), 
                t('landing.why.5'), t('landing.why.6')
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 pb-3 border-b border-black/5">
                  <Check className="w-4 h-4 text-black" />
                  <span className="text-black font-bold uppercase tracking-wider text-xs">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 w-full h-[400px] lg:h-[600px] bg-gray-50 rounded-sm overflow-hidden">
            <img src="/images/mechanic_hero.png" alt="Mechanic" className="w-full h-full object-cover grayscale contrast-125" />
          </div>
        </div>
      </section>

      {/* 11. TESTIMONIALS */}
      <section id="ulasan" className="py-20 md:py-28 bg-[#FAFAFA] border-y border-black/5">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-16 text-black">{t('reviews.title')}</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { text: t('landing.rev.1.text'), name: t('landing.rev.1.name'), car: t('landing.rev.1.car') },
              { text: t('landing.rev.2.text'), name: t('landing.rev.2.name'), car: t('landing.rev.2.car') },
              { text: t('landing.rev.3.text'), name: t('landing.rev.3.name'), car: t('landing.rev.3.car') }
            ].map((rev, i) => (
              <div key={i} className="flex flex-col border-l-2 border-black pl-6 py-1">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-black text-black" />)}
                </div>
                <p className="text-black font-medium text-base leading-relaxed mb-8">{rev.text}</p>
                <div>
                  <p className="font-bold text-black uppercase tracking-widest text-xs mb-1">{rev.name}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">{rev.car}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-16 text-center text-black">{t('faq.title')}</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-black/10">
                <button 
                  className="w-full text-left py-6 flex justify-between items-center font-bold text-base lg:text-lg hover:text-gray-500 transition-colors text-black uppercase tracking-tight"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 text-gray-500 leading-relaxed font-medium text-base max-w-2xl">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. FINAL CTA */}
      <section className="py-28 md:py-36 bg-black text-white px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8 leading-[1.1] max-w-4xl" dangerouslySetInnerHTML={{ __html: t('cta.title').replace(' ', '<br/>') }}>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-12 font-medium max-w-xl">{t('cta.desc')}</p>
          <Link to="/booking" className="bg-white text-black px-10 py-5 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] rounded-sm">
            {t('cta.btn')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 16. FOOTER */}
      <footer className="bg-white pt-20 pb-24 md:pb-10 text-black border-t border-black/5">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <span className="font-display font-bold text-2xl uppercase tracking-tighter mb-6 block">{settings?.workshopName || "DRIVE AUTO"}</span>
            <p className="mb-6 font-medium leading-relaxed max-w-sm text-gray-500 text-sm">{t('footer.desc')}</p>
          </div>
          <div>
            <h4 className="font-bold text-black mb-6 uppercase tracking-[0.2em] text-xs">{t('footer.nav')}</h4>
            <ul className="space-y-4 font-medium text-sm text-gray-500">
              <li><a href="#layanan" className="hover:text-black transition-colors uppercase tracking-wider">{t('nav.services')}</a></li>
              <li><a href="#cara-booking" className="hover:text-black transition-colors uppercase tracking-wider">{t('nav.process')}</a></li>
              <li><a href="#ulasan" className="hover:text-black transition-colors uppercase tracking-wider">{t('nav.reviews')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-black mb-6 uppercase tracking-[0.2em] text-xs">{t('footer.info')}</h4>
            <ul className="space-y-4 font-medium text-sm text-gray-500">
              <li><Link to="/admin/login" className="hover:text-black transition-colors uppercase tracking-wider">{t('footer.admin')}</Link></li>
              <li><a href="#" className="hover:text-black transition-colors uppercase tracking-wider">{t('footer.terms')}</a></li>
              <li><a href="#" className="hover:text-black transition-colors uppercase tracking-wider">{t('footer.privacy')}</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-t border-black/5">
          <p>&copy; {new Date().getFullYear()} {settings?.workshopName}.</p>
          <p>All Rights Reserved.</p>
        </div>
      </footer>

      {/* 17. MOBILE BOTTOM ACTION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-black/10 p-4 z-50 safe-area-pb">
        <Link to="/booking" className="w-full bg-black text-white font-bold flex items-center justify-center py-4 text-xs uppercase tracking-widest rounded-sm">
          {t('nav.book')}
        </Link>
      </div>

    </div>
  );
}
