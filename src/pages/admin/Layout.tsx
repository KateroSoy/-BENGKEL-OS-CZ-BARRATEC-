import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar as CalendarIcon, Users, Settings, LogOut, Wrench, FileText, PlusCircle, BarChart, ChevronRight, Tag } from "lucide-react";
import { cn } from "../../lib/utils";
import { useState, useEffect } from "react";
import { ProductTour } from "../../components/ProductTour";
import { logout as mockLogout } from "../../lib/mockApi";
import { useTranslation } from "../../lib/i18n/LanguageContext";

const navigationBase = [
  { key: 'admin.dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { key: 'admin.bookings.today', defaultText: 'Booking Hari Ini', href: '/admin/bookings/today', icon: FileText },
  { key: 'admin.calendar', defaultText: 'Kalender Booking', href: '/admin/calendar', icon: CalendarIcon },
  { key: 'admin.bookings.new', defaultText: 'Tambah Booking', href: '/admin/bookings/new', icon: PlusCircle },
  { key: 'admin.services', defaultText: 'Layanan & Teknisi', href: '/admin/services', icon: Users },
  { key: 'admin.promotions', href: '/admin/promotions', icon: Tag },
  { key: 'admin.reports', href: '/admin/reports', icon: BarChart },
  { key: 'admin.settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useTranslation();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (location.pathname === '/admin/dashboard') {
      const tourCompleted = localStorage.getItem('bw_tour_completed');
      if (!tourCompleted) {
        setTimeout(() => setShowTour(true), 1000);
      }
    }
  }, [location.pathname]);

  const handleCloseTour = () => {
    setShowTour(false);
    localStorage.setItem('bw_tour_completed', 'true');
  };

  const handleLogout = () => {
    mockLogout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen print:h-auto bg-[#FAFAFA] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 print:bg-white overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-gradient-to-bl from-blue-50/50 to-transparent blur-3xl -z-10 rounded-full opacity-70 pointer-events-none"></div>

      {/* Sidebar - Desktop */}
      <div id="tour-sidebar" className="hidden md:flex md:w-[280px] md:flex-col border-r border-slate-200/60 bg-white/50 backdrop-blur-xl print:hidden z-20">
        <div className="flex flex-col flex-grow pt-8 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-8 mb-10">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 mr-3">
              <Wrench className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">BENGKEL OS</span>
          </div>
          <nav className="mt-2 flex-1 px-4 space-y-1.5">
            {navigationBase.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              const name = t(item.key as any) === item.key ? (item.defaultText || t(item.key as any)) : t(item.key as any);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    isActive 
                      ? 'bg-white shadow-sm border border-slate-200/60 text-slate-900 font-semibold' 
                      : 'border border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                    'group flex items-center px-4 py-3 text-[14px] rounded-2xl transition-all duration-200'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500',
                      'mr-3.5 flex-shrink-0 h-5 w-5 transition-colors duration-200'
                    )}
                    aria-hidden="true"
                  />
                  {name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* User Profile / Logout */}
        <div className="flex-shrink-0 p-4 mx-4 mb-4 border border-slate-200/60 bg-white rounded-3xl shadow-sm">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors group"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 group-hover:bg-red-50 transition-colors">
                <LogOut className="h-4 w-4 group-hover:text-red-500 transition-colors" />
              </div>
              <span>Keluar</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-300" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden print:overflow-visible z-10">
        
        {/* Sticky Header */}
        <header className="hidden md:flex h-20 items-center justify-between px-8 backdrop-blur-md bg-white/40 border-b border-slate-200/50 sticky top-0 z-30">
          <div className="flex items-center text-sm text-slate-500 font-medium">
            <span>Workspace</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 rounded-lg p-1 mr-2">
              <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-xs font-bold uppercase rounded-md transition-colors ${language === 'en' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`}>EN</button>
              <button onClick={() => setLanguage('id')} className={`px-3 py-1 text-xs font-bold uppercase rounded-md transition-colors ${language === 'id' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`}>ID</button>
            </div>
            <div className="text-sm font-medium text-slate-900 px-4 py-2 bg-white rounded-full border border-slate-200/60 shadow-sm">
              Portal Admin
            </div>
          </div>
        </header>

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none pb-20 md:pb-8 print:overflow-visible">
          <div className="py-8 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto print:p-0 print:max-w-none">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom Nav - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-slate-200 safe-area-pb print:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-16">
          {navigationBase.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.href;
            const name = t(item.key as any) === item.key ? (item.defaultText || t(item.key as any)) : t(item.key as any);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 relative",
                  isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-900 transition-colors"
                )}
              >
                {isActive && (
                  <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-b-full" 
                  />
                )}
                <item.icon className={cn("h-5 w-5", isActive && "text-blue-600")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium tracking-wide">{name.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <ProductTour isOpen={showTour} onClose={handleCloseTour} />
    </div>
  );
}
