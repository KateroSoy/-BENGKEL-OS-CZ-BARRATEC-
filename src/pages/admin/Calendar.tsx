import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import { StatusBadge } from "../../components/ui/core";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { getBookings } from "../../lib/mockApi";
import { useTranslation } from "../../lib/i18n/LanguageContext";

export default function Calendar() {
  const { t } = useTranslation();
  const [date, setDate] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBookings(); }, [date]);

  const loadBookings = () => {
    setLoading(true);
    setBookings(getBookings({ date: format(date, "yyyy-MM-dd") }));
    setLoading(false);
  };

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('cal.title')}</h1>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          <button onClick={() => setDate(subDays(date, 1))} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="font-medium text-gray-900 w-32 text-center flex items-center justify-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            {format(date, "dd MMM yyyy")}
          </div>
          <button onClick={() => setDate(addDays(date, 1))} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">{t('cal.loading')}</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {timeSlots.map(slot => {
              const slotBookings = bookings.filter(b => b.bookingTime.startsWith(slot.split(':')[0]));
              return (
                <div key={slot} className="flex flex-col sm:flex-row">
                  <div className="w-24 sm:border-r border-gray-100 p-4 bg-gray-50 shrink-0 flex items-center justify-center sm:justify-start">
                    <span className="font-bold text-gray-900">{slot}</span>
                  </div>
                  <div className="flex-1 p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {slotBookings.length === 0 ? (
                      <div className="text-sm text-gray-400 col-span-full py-2">{t('cal.empty')}</div>
                    ) : (
                      slotBookings.map(b => (
                        <Link to={`/admin/bookings/${b.id}`} key={b.id}>
                          <div className="border border-gray-200 p-3 rounded-xl hover:border-blue-300 transition-colors bg-white shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-gray-900 text-sm truncate">{b.customerName}</span>
                              <StatusBadge status={b.status} />
                            </div>
                            <p className="text-xs text-gray-500">{b.carType} • {b.serviceType}</p>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
