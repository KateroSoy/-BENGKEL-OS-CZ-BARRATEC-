import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select } from "../../components/ui/core";
import { Printer, TrendingUp, Activity, Wrench, CheckCircle, Search, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { getReports, getSettings } from "../../lib/mockApi";
import { useTranslation } from "../../lib/i18n/LanguageContext";

// Mock Data
const generateMockTrend = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i);
    data.push({
      date: format(d, 'dd MMM'),
      selesai: Math.floor(Math.random() * 10) + 2,
      batal: Math.floor(Math.random() * 3),
    });
  }
  return data;
};

const MOCK_SERVICE_DATA = [
  { name: 'Ganti Oli', value: 45, color: '#3b82f6' },
  { name: 'Tune Up', value: 25, color: '#10b981' },
  { name: 'Servis Ringan', value: 20, color: '#f59e0b' },
  { name: 'AC Mobil', value: 10, color: '#8b5cf6' },
];

export default function Reports() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [startDate, setStartDate] = useState(format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [statusFilter, setStatusFilter] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [mockTrend] = useState(generateMockTrend());

  useEffect(() => {
    loadReports();
  }, [startDate, endDate]);

  const loadReports = () => {
    setLoading(true);
    setSettings(getSettings());
    // Fetch all for the date range so cards have accurate totals
    setBookings(getReports({ start: startDate, end: endDate }));
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // Compute Totals for Cards (based on raw date-range data)
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.estimatedPrice || 0), 0);
  const completedCount = bookings.filter(b => b.status === 'Selesai').length;
  const cancelledCount = bookings.filter(b => b.status === 'Batal').length;

  // Local Filtering for Table
  const filteredBookings = bookings.filter(b => {
    const matchStatus = statusFilter ? b.status === statusFilter : true;
    const matchService = serviceFilter ? b.serviceType === serviceFilter : true;
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = 
      (b.customerName || '').toLowerCase().includes(searchLower) ||
      (b.bookingCode || '').toLowerCase().includes(searchLower) ||
      (b.plateNumber || '').toLowerCase().includes(searchLower);
    return matchStatus && matchService && matchSearch;
  });

  const filteredTotalRevenue = filteredBookings.reduce((sum, b) => sum + (b.estimatedPrice || 0), 0);
  const uniqueServices = Array.from(new Set(bookings.map(b => b.serviceType))).filter(Boolean);

  // Sorting Logic
  let sortedBookings = [...filteredBookings];
  if (sortOrder === "newest") {
    sortedBookings.sort((a, b) => new Date(`${b.bookingDate}T${b.bookingTime}`).getTime() - new Date(`${a.bookingDate}T${a.bookingTime}`).getTime());
  } else if (sortOrder === "oldest") {
    sortedBookings.sort((a, b) => new Date(`${a.bookingDate}T${a.bookingTime}`).getTime() - new Date(`${b.bookingDate}T${b.bookingTime}`).getTime());
  } else if (sortOrder === "price_desc") {
    sortedBookings.sort((a, b) => (b.estimatedPrice || 0) - (a.estimatedPrice || 0));
  } else if (sortOrder === "price_asc") {
    sortedBookings.sort((a, b) => (a.estimatedPrice || 0) - (b.estimatedPrice || 0));
  }

  // Pagination Logic
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage) || 1;
  const paginatedBookings = sortedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCardClick = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 print:max-w-none print:pb-0 print:m-0 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('rpt.title')}</h1>
          <p className="text-gray-500 mt-1">{t('rpt.subtitle')}</p>
        </div>
        <Button onClick={handlePrint} variant="outline" className="flex gap-2">
          <Printer className="h-4 w-4" /> {t('rpt.print')}
        </Button>
      </div>

      {/* Print Header */}
      <div className="hidden print:block mb-8">
        <div className="flex items-center justify-between border-b-4 border-double border-gray-800 pb-6 mb-2">
          <div className="flex items-center gap-6 print:gap-4">
            {settings?.logoUrl && settings.logoUrl.trim() !== '' && (
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="max-h-20 w-auto print:max-h-16 object-contain rounded-lg" 
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div>
              <h1 className="text-2xl print:text-xl font-extrabold text-gray-900 tracking-tight uppercase">
                {settings?.workshopName || "BENGKEL OS CZ-BARRATEC"}
              </h1>
              <p className="text-gray-600 font-medium mt-1 text-lg">{t('rpt.print.title')}</p>
              <div className="text-sm text-gray-500 mt-2 flex flex-col gap-0.5">
                <p>{settings?.address}</p>
                <p>Telp/WA: {settings?.phone}</p>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500 self-end bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="font-bold text-gray-700 mb-1">{t('rpt.print.period')}</p>
            <p>{format(new Date(startDate), "dd MMM yyyy")} - {format(new Date(endDate), "dd MMM yyyy")}</p>
            <p className="mt-2 text-xs">{t('rpt.print.printed')} {format(new Date(), "dd MMM yyyy HH:mm")}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="print:hidden">
        <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t('rpt.filter.from')}</label>
            <Input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t('rpt.filter.to')}</label>
            <Input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t('rpt.filter.status')}</label>
            <Select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
              <option value="">{t('rpt.filter.allstatus')}</option>
              <option value="Selesai">Selesai</option>
              <option value="Batal">Batal</option>
              <option value="Tidak Datang">Tidak Datang</option>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t('rpt.filter.service')}</label>
            <Select value={serviceFilter} onChange={e => { setServiceFilter(e.target.value); setCurrentPage(1); }}>
              <option value="">{t('rpt.filter.allservice')}</option>
              {uniqueServices.map((svc: any) => (
                <option key={svc} value={svc}>{svc}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t('rpt.filter.sort')}</label>
            <Select value={sortOrder} onChange={e => { setSortOrder(e.target.value); setCurrentPage(1); }}>
              <option value="newest">{t('rpt.filter.newest')}</option>
              <option value="oldest">{t('rpt.filter.oldest')}</option>
              <option value="price_desc">{t('rpt.filter.price.desc')}</option>
              <option value="price_asc">{t('rpt.filter.price.asc')}</option>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t('rpt.filter.search')}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                type="text" 
                placeholder={t('rpt.filter.search.ph')}
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
        <Card 
          className={`print:shadow-none print:border-gray-300 cursor-pointer transition-all hover:ring-2 hover:ring-blue-500 ${statusFilter === '' ? 'ring-2 ring-blue-500 bg-blue-50/10' : ''}`}
          onClick={() => handleCardClick('')}
        >
          <CardContent className="p-6 print:p-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-full print:hidden">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('rpt.kpi.total')}</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`print:shadow-none print:border-gray-300 cursor-pointer transition-all hover:ring-2 hover:ring-emerald-500 ${statusFilter === 'Selesai' ? 'ring-2 ring-emerald-500 bg-emerald-50/10' : ''}`}
          onClick={() => handleCardClick('Selesai')}
        >
          <CardContent className="p-6 print:p-4">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 p-3 rounded-full print:hidden">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('rpt.kpi.done')}</p>
                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`print:shadow-none print:border-gray-300 cursor-pointer transition-all hover:ring-2 hover:ring-red-500 ${statusFilter === 'Batal' ? 'ring-2 ring-red-500 bg-red-50/10' : ''}`}
          onClick={() => handleCardClick('Batal')}
        >
          <CardContent className="p-6 print:p-4">
            <div className="flex items-center gap-4">
              <div className="bg-red-50 p-3 rounded-full print:hidden">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('rpt.kpi.cancel')}</p>
                <p className="text-2xl font-bold text-gray-900">{cancelledCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="print:shadow-none print:border-gray-300">
          <CardContent className="p-6 print:p-4">
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 p-3 rounded-full print:hidden">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('rpt.kpi.revenue')}</p>
                <p className="text-xl font-bold text-gray-900 truncate">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Data Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">
        <Card>
          <CardHeader className="print:pb-2">
            <CardTitle className="text-lg">{t('rpt.chart.trend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] print:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="selesai" name={t('rpt.chart.done')} fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="batal" name={t('rpt.chart.fail')} fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="print:shadow-none print:border-gray-300">
          <CardHeader className="print:pb-2">
            <CardTitle className="text-lg">{t('rpt.chart.dist')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] print:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_SERVICE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {MOCK_SERVICE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Data - forces page break before it in print if it's long */}
      <div className="print:page-break-before-auto print:mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 hidden print:block border-b-2 border-gray-800 pb-2">{t('rpt.table.title')}</h3>
        
        {loading ? (
          <div className="text-center py-12 text-gray-500 print:hidden">{t('rpt.loading')}</div>
        ) : (
          <>
            {/* Screen View Table (Paginated) */}
            <Card className="print:hidden">
              <div className="overflow-x-auto">
              <table className="w-full text-sm text-left print:text-[11px]">
                <thead className="bg-gray-50 print:bg-white text-gray-600 print:text-gray-900 font-medium border-b border-gray-100 print:border-gray-300">
                  <tr>
                    <th className="px-4 py-3 print:px-2 print:py-2">{t('rpt.th.date')}</th>
                    <th className="px-4 py-3 print:px-2 print:py-2">{t('rpt.th.code')}</th>
                    <th className="px-4 py-3 print:px-2 print:py-2">{t('rpt.th.customer')}</th>
                    <th className="px-4 py-3 print:px-2 print:py-2">{t('rpt.th.vehicle')}</th>
                    <th className="px-4 py-3 print:px-2 print:py-2">{t('rpt.th.service')}</th>
                    <th className="px-4 py-3 print:px-2 print:py-2">{t('rpt.th.status')}</th>
                    <th className="px-4 py-3 print:px-2 print:py-2 text-right">{t('rpt.th.cost')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 print:divide-gray-200">
                  {paginatedBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500 print:py-4">
                        {t('rpt.empty')}
                      </td>
                    </tr>
                  ) : (
                    paginatedBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50 print:hover:bg-transparent print:break-inside-avoid">
                        <td className="px-4 py-3 print:px-2 print:py-2 whitespace-nowrap">{b.bookingDate} {b.bookingTime}</td>
                        <td className="px-4 py-3 print:px-2 print:py-2 font-medium text-gray-900">{b.bookingCode}</td>
                        <td className="px-4 py-3 print:px-2 print:py-2">
                          {b.customerName}
                          <div className="text-xs text-gray-500 print:text-[10px]">{b.customerPhone}</div>
                        </td>
                        <td className="px-4 py-3 print:px-2 print:py-2">
                          {b.carType}
                          <div className="text-xs text-gray-500 print:text-[10px]">{b.plateNumber}</div>
                        </td>
                        <td className="px-4 py-3 print:px-2 print:py-2">{b.serviceType}</td>
                        <td className="px-4 py-3 print:px-2 print:py-2">{b.status}</td>
                        <td className="px-4 py-3 print:px-2 print:py-2 text-right">
                          {b.estimatedPrice ? `Rp ${b.estimatedPrice.toLocaleString('id-ID')}` : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {filteredBookings.length > 0 && (
                  <tfoot className="bg-blue-50/50 print:bg-gray-100 border-t-2 border-blue-100 print:border-gray-300 font-bold text-gray-900">
                    <tr>
                      <td colSpan={5} className="px-4 py-3 print:px-2 print:py-2 text-right">
                        {t('rpt.total.filtered').replace('{{count}}', filteredBookings.length.toString())}
                      </td>
                      <td className="px-4 py-3 print:px-2 print:py-2 text-right">
                        {t('rpt.total.est')}
                      </td>
                      <td className="px-4 py-3 print:px-2 print:py-2 text-right text-blue-700 print:text-gray-900">
                        Rp {filteredTotalRevenue.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredBookings.length > 0 && (
              <div className="px-4 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  {t('rpt.showing')} <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> {t('rpt.to')} <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, filteredBookings.length)}</span> {t('rpt.of')} <span className="font-medium text-gray-900">{filteredBookings.length}</span> {t('rpt.data')}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> {t('rpt.prev')}
                  </Button>
                  <div className="text-sm font-medium text-gray-700 px-2">
                    {t('rpt.page').replace('{{current}}', currentPage.toString()).replace('{{total}}', totalPages.toString())}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    {t('rpt.next')} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </Card>

            {/* Print View Table (All Data) */}
            <div className="hidden print:block w-full">
              <table className="w-full text-xs text-left border-collapse" style={{ tableLayout: 'auto' }}>
                <thead className="bg-gray-100 text-gray-900 font-bold border-y-2 border-gray-800">
                  <tr>
                    <th className="px-1 py-2 w-[15%]">{t('rpt.th.date')}</th>
                    <th className="px-1 py-2 w-[15%]">{t('rpt.th.code')}</th>
                    <th className="px-1 py-2 w-[18%]">{t('rpt.th.customer')}</th>
                    <th className="px-1 py-2 w-[18%]">{t('rpt.th.vehicle')}</th>
                    <th className="px-1 py-2 w-[14%]">{t('rpt.th.service')}</th>
                    <th className="px-1 py-2 w-[10%]">{t('rpt.th.status')}</th>
                    <th className="px-1 py-2 w-[10%] text-right">{t('rpt.th.cost')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-1 py-4 text-center text-gray-500">{t('rpt.empty')}</td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="print:break-inside-avoid">
                        <td className="px-1 py-2 whitespace-nowrap">{b.bookingDate} {b.bookingTime}</td>
                        <td className="px-1 py-2 font-medium text-gray-900 break-words">{b.bookingCode}</td>
                        <td className="px-1 py-2 break-words">
                          {b.customerName}
                          <div className="text-[10px] text-gray-500">{b.customerPhone}</div>
                        </td>
                        <td className="px-1 py-2 break-words">
                          {b.carType}
                          <div className="text-[10px] text-gray-500">{b.plateNumber}</div>
                        </td>
                        <td className="px-1 py-2 break-words">{b.serviceType}</td>
                        <td className="px-1 py-2">{b.status}</td>
                        <td className="px-1 py-2 text-right whitespace-nowrap">
                          {b.estimatedPrice ? `Rp ${b.estimatedPrice.toLocaleString('id-ID')}` : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {filteredBookings.length > 0 && (
                  <tfoot className="border-t-2 border-gray-800 font-bold text-gray-900 bg-gray-50">
                    <tr>
                      <td colSpan={5} className="px-1 py-2 text-right">{t('rpt.total.filtered').replace('{{count}}', filteredBookings.length.toString())}</td>
                      <td className="px-1 py-2 text-right">{t('rpt.total.est')}</td>
                      <td className="px-1 py-2 text-right whitespace-nowrap">Rp {filteredTotalRevenue.toLocaleString('id-ID')}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
              
              {/* Signature Section */}
              <div className="mt-16 flex justify-end">
                <div className="text-center">
                  <p className="text-gray-900 mb-16">
                    {settings?.address?.split(',')[0] || "Jakarta"}, {format(new Date(), "dd MMMM yyyy")}
                    <br />
                    {t('rpt.sign.known')}
                  </p>
                  <div className="w-48 border-b border-gray-800 mx-auto"></div>
                  <p className="text-gray-900 mt-2 font-bold uppercase">{settings?.ownerName || "Administrator"}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
