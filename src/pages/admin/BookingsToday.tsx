import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { StatusBadge } from "../../components/ui/core";
import { Search, MessageCircle, Calendar, Filter, MoreHorizontal, FileText, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { getBookings, getServices, getTechnicians } from "../../lib/mockApi";

export default function BookingsToday() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [techFilter, setTechFilter] = useState("");

  useEffect(() => {
    loadBookings();
    setServices(getServices());
    setTechnicians(getTechnicians());
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      loadBookings();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, serviceFilter, techFilter]);

  const loadBookings = () => {
    setLoading(true);
    const today = format(new Date(), "yyyy-MM-dd");
    const data = getBookings({
      date: today,
      search: search || undefined,
      status: statusFilter || undefined,
      serviceType: serviceFilter || undefined,
      technicianId: techFilter || undefined,
    });
    setBookings(data);
    setLoading(false);
  };

  const handleNotify = (phone: string, name: string, carType: string) => {
    const msg = `Halo Kak ${name}, dari BENGKEL OS CZ-BARRATEC. Mengenai booking servis mobil ${carType} Anda...`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Booking Hari Ini</h1>
          <p className="text-sm md:text-base text-slate-500 mt-1 flex items-center gap-2 font-medium">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-500" /> {format(new Date(), "EEEE, dd MMMM yyyy")}
          </p>
        </div>
      </div>

      {/* Filter Bar - Mobile First Layout */}
      <div className="bg-white p-3 rounded-2xl md:rounded-[1.5rem] border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            placeholder="Cari nama, hp, plat..." 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl transition-all text-sm h-12 outline-none font-medium"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-10 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm h-12 appearance-none outline-none font-medium text-slate-700 cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="Baru">Baru</option>
              <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
              <option value="Terkonfirmasi">Terkonfirmasi</option>
              <option value="Datang">Datang</option>
              <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
              <option value="Selesai">Selesai</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
          <div className="relative w-full sm:w-auto">
            <select 
              value={serviceFilter} 
              onChange={e => setServiceFilter(e.target.value)}
              className="w-full sm:w-auto pl-4 pr-10 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm h-12 appearance-none outline-none font-medium text-slate-700 cursor-pointer"
            >
              <option value="">Semua Layanan</option>
              {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Data Content */}
      <div className="bg-white/50 md:bg-white border-0 md:border md:border-slate-200 md:rounded-[2rem] overflow-hidden md:shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4 bg-white rounded-3xl md:rounded-none">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Memuat data booking...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl md:rounded-none">
            <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner">
              <FileText className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Booking</h3>
            <p className="text-slate-500 max-w-sm mb-8">Tidak ada jadwal servis yang sesuai dengan pencarian Anda hari ini.</p>
            <Link to="/admin/bookings/new">
              <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                Tambah Booking Manual
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                  <tr>
                    <th className="px-6 py-5 font-bold tracking-wide">Waktu</th>
                    <th className="px-6 py-5 font-bold tracking-wide">Pelanggan</th>
                    <th className="px-6 py-5 font-bold tracking-wide">Kendaraan</th>
                    <th className="px-6 py-5 font-bold tracking-wide">Status</th>
                    <th className="px-6 py-5 font-bold tracking-wide text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {bookings.map((b, index) => (
                    <motion.tr 
                      key={b.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center justify-center bg-slate-100 text-slate-900 font-bold px-3 py-1.5 rounded-lg">
                          {b.bookingTime}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-900 text-base">{b.customerName}</div>
                        <div className="text-sm text-slate-500 font-medium">{b.customerPhone}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-slate-900 font-bold">{b.carType}</div>
                        <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{b.plateNumber || '-'}</div>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.preventDefault(); handleNotify(b.customerPhone, b.customerName, b.carType); }}
                            className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                            title="WhatsApp Notifikasi"
                          >
                            <MessageCircle className="w-5 h-5" />
                          </button>
                          <Link to={`/admin/bookings/${b.id}`}>
                            <button className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Detail">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Hidden on desktop) */}
            <div className="md:hidden space-y-3">
              {bookings.map((b, index) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="inline-flex items-center justify-center bg-slate-100 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-sm">
                      <ClockIcon className="w-4 h-4 mr-1.5 text-slate-500" />
                      {b.bookingTime}
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-extrabold text-slate-900 text-lg">{b.customerName}</h3>
                    <p className="text-slate-500 text-sm font-medium">{b.customerPhone}</p>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-2xl mb-4 border border-slate-100">
                    <div className="font-bold text-slate-800 text-sm">{b.carType}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">{b.plateNumber || 'TIDAK ADA PLAT'}</div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button 
                      onClick={(e) => { e.preventDefault(); handleNotify(b.customerPhone, b.customerName, b.carType); }}
                      className="flex-1 flex justify-center items-center gap-2 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-semibold text-sm hover:bg-emerald-100 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> Hubungi
                    </button>
                    <Link to={`/admin/bookings/${b.id}`} className="flex-1">
                      <button className="w-full flex justify-center items-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors">
                        Detail <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Simple clock icon for mobile view
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
