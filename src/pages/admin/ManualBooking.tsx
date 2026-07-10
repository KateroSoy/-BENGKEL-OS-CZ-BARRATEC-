import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Select, Textarea, Button } from "../../components/ui/core";
import { ArrowLeft } from "lucide-react";
import { createBooking, getActiveServices, getSettings, getActivePromos } from "../../lib/mockApi";

export default function ManualBooking() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    setServices(getActiveServices());
    setPromos(getActivePromos());
    setSettings(getSettings());
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as any;

    if (data.problemCategory) {
      data.problemDescription = `${data.problemCategory}${data.problemDescription ? ' - ' + data.problemDescription : ''}`;
    }

    const { id } = createBooking(data);
    setLoading(false);
    navigate(`/admin/bookings/${id}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Booking Manual</h1>
          <p className="text-gray-500 mt-1">Input data booking dari WhatsApp atau Walk-in</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="source">Sumber Booking</Label>
                <Select id="source" name="source" required defaultValue="WhatsApp">
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Telepon">Telepon</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Referral">Referral</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status Awal</Label>
                <Select id="status" name="status" required defaultValue="Terkonfirmasi">
                  <option value="Baru">Baru</option>
                  <option value="Terkonfirmasi">Terkonfirmasi</option>
                  <option value="Datang">Datang</option>
                  <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nama Konsumen *</Label>
                <Input id="customerName" name="customerName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">No. WhatsApp *</Label>
                <Input id="customerPhone" name="customerPhone" required type="tel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bookingDate">Tanggal *</Label>
                <Input id="bookingDate" name="bookingDate" type="date" required defaultValue={format(new Date(), "yyyy-MM-dd")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bookingTime">Jam *</Label>
                <Input id="bookingTime" name="bookingTime" type="time" required defaultValue="09:00" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
              <div className="space-y-2">
                <Label htmlFor="carType">Tipe Mobil *</Label>
                <Select id="carType" name="carType" required defaultValue="">
                  <option value="" disabled>Pilih tipe mobil</option>
                  {settings?.carTypes?.map((ct: string, i: number) => (
                    <option key={i} value={ct}>{ct}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plateNumber">Plat Nomor</Label>
                <Input id="plateNumber" name="plateNumber" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceType">Jenis Layanan *</Label>
                <Select id="serviceType" name="serviceType" required defaultValue="">
                  <option value="" disabled>Pilih layanan</option>
                  {promos.length > 0 && (
                    <optgroup label="Promo Spesial">
                      {promos.map(p => (
                        <option key={p.id} value={`[PROMO] ${p.name}`}>[PROMO] {p.name}</option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="Layanan Reguler">
                    {services.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </optgroup>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="problemCategory">Kategori Keluhan / Problem *</Label>
                <Select id="problemCategory" name="problemCategory" required defaultValue="">
                  <option value="" disabled>Pilih kategori keluhan</option>
                  {settings?.problemOptions?.map((po: string, i: number) => (
                    <option key={i} value={po}>{po}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="problemDescription">Detail Keluhan Tambahan</Label>
                <Textarea id="problemDescription" name="problemDescription" placeholder="Opsional" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminNote">Catatan Admin</Label>
              <Textarea id="adminNote" name="adminNote" placeholder="Catatan internal (tidak dilihat konsumen)" />
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Batal</Button>
              <Button type="submit" isLoading={loading}>Simpan Booking</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
