import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select } from "../../components/ui/core";
import { Printer, TrendingUp, Activity, Wrench, CheckCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { getReports } from "../../lib/mockApi";

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
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [startDate, setStartDate] = useState(format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [statusFilter, setStatusFilter] = useState("");

  const [mockTrend] = useState(generateMockTrend());

  useEffect(() => {
    loadReports();
  }, [startDate, endDate, statusFilter]);

  const loadReports = () => {
    setLoading(true);
    setBookings(getReports({ start: startDate, end: endDate, status: statusFilter || undefined }));
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.estimatedPrice || 0), 0);
  const completedCount = bookings.filter(b => b.status === 'Selesai').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 print:max-w-none print:pb-0 print:m-0 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Booking</h1>
          <p className="text-gray-500 mt-1">Rekap data booking dan performa</p>
        </div>
        <Button onClick={handlePrint} variant="outline" className="flex gap-2">
          <Printer className="h-4 w-4" /> Cetak Laporan
        </Button>
      </div>

      {/* Print Header */}
      <div className="hidden print:block border-b border-gray-200 pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">BENGKEL OS CZ-BARRATEC</h1>
            <p className="text-gray-500">Laporan Keuangan & Operasional</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>Periode: {format(new Date(startDate), "dd MMM yyyy")} - {format(new Date(endDate), "dd MMM yyyy")}</p>
            <p>Dicetak pada: {format(new Date(), "dd MMM yyyy HH:mm")}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="print:hidden">
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Dari Tanggal</label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Sampai Tanggal</label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">Semua Status</option>
              <option value="Selesai">Selesai</option>
              <option value="Batal">Batal</option>
              <option value="Tidak Datang">Tidak Datang</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
        <Card className="print:shadow-none print:border-gray-300">
          <CardContent className="p-6 print:p-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-full print:hidden">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Booking</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length || 156}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="print:shadow-none print:border-gray-300">
          <CardContent className="p-6 print:p-4">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 p-3 rounded-full print:hidden">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Booking Selesai</p>
                <p className="text-2xl font-bold text-gray-900">{completedCount || 142}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="print:shadow-none print:border-gray-300">
          <CardContent className="p-6 print:p-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-50 p-3 rounded-full print:hidden">
                <Wrench className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Layanan Favorit</p>
                <p className="text-xl font-bold text-gray-900 truncate max-w-[120px]">Ganti Oli</p>
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
                <p className="text-sm font-medium text-gray-500">Estimasi Revenue</p>
                <p className="text-xl font-bold text-gray-900 truncate">
                  Rp {(totalRevenue || 24500000).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Data Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:page-break-inside-avoid">
        <Card className="print:shadow-none print:border-gray-300">
          <CardHeader className="print:pb-2">
            <CardTitle className="text-lg">Tren Booking (7 Hari Terakhir)</CardTitle>
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
                  <Bar dataKey="selesai" name="Selesai" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="batal" name="Batal/Gagal" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="print:shadow-none print:border-gray-300">
          <CardHeader className="print:pb-2">
            <CardTitle className="text-lg">Distribusi Layanan (Demo)</CardTitle>
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
      <div className="print:page-break-before-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-4 hidden print:block print:mt-8">Rincian Data Booking</h3>
        
        {loading ? (
          <div className="text-center py-12 text-gray-500 print:hidden">Memuat laporan...</div>
        ) : (
          <Card className="print:shadow-none print:border-gray-300 print:border-t">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left print:text-[11px]">
                <thead className="bg-gray-50 print:bg-white text-gray-600 print:text-gray-900 font-medium border-b border-gray-100 print:border-gray-300">
                  <tr>
                    <th className="px-4 py-3 print:px-2 print:py-2">TANGGAL</th>
                    <th className="px-4 py-3 print:px-2 print:py-2">KODE</th>
                    <th className="px-4 py-3 print:px-2 print:py-2">KONSUMEN</th>
                    <th className="px-4 py-3 print:px-2 print:py-2">KENDARAAN</th>
                    <th className="px-4 py-3 print:px-2 print:py-2">LAYANAN</th>
                    <th className="px-4 py-3 print:px-2 print:py-2">STATUS</th>
                    <th className="px-4 py-3 print:px-2 print:py-2 text-right">BIAYA (EST)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 print:divide-gray-200">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500 print:py-4">Belum ada data laporan</td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
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
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
