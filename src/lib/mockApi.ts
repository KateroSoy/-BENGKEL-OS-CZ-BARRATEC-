// Client-side mock data store. Replaces the old Vercel serverless API routes
// (which were themselves just in-memory mock stubs) so the app ships as a
// pure static site with no serverless functions.

import { format, subDays, addDays } from "date-fns";

export interface Service {
  id: string;
  name: string;
  estimatedDuration: number;
  estimatedPrice: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromoPackage {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  promoPrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  workshopName: string;
  address: string;
  phone: string;
  logoUrl?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  openTime: string;
  closeTime: string;
  maxBookingPerSlot: number;
  slotIntervalMinutes: number;
  operationalDays: null;
  carTypes: string[];
  problemOptions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  bookingDate: string;
  bookingTime: string;
  carType: string;
  plateNumber: string;
  carYear: number;
  problemDescription: string;
  serviceType: string;
  status: string;
  source: string;
  estimatedPrice: number | null;
  technicianId: string | null;
  technicianName: string | null;
  customerNote: string | null;
  adminNote: string | null;
  estimatedFinishTime: string | null;
  paymentProofBase64?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEntry {
  id: string;
  bookingId: string;
  oldStatus: string | null;
  newStatus: string;
  note: string | null;
  changedBy: string | null;
  changedAt: string;
  adminName: string | null;
}

const services: Service[] = [
  { id: "svc-1", name: "Servis Ringan", estimatedDuration: 60, estimatedPrice: 350000, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "svc-2", name: "Servis Besar", estimatedDuration: 180, estimatedPrice: 1500000, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "svc-3", name: "Ganti Oli", estimatedDuration: 30, estimatedPrice: 250000, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "svc-4", name: "Tune Up", estimatedDuration: 90, estimatedPrice: 450000, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "svc-5", name: "AC Mobil", estimatedDuration: 120, estimatedPrice: 500000, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "svc-6", name: "Ganti Ban", estimatedDuration: 45, estimatedPrice: 800000, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "svc-7", name: "Pengecekan Rem", estimatedDuration: 60, estimatedPrice: 200000, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const technicians: Technician[] = [
  { id: "tech-1", name: "Budi Santoso", phone: "081111111111", specialty: "Mesin", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "tech-2", name: "Agus Kurniawan", phone: "082222222222", specialty: "AC & Kelistrikan", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "tech-3", name: "Joko Susilo", phone: "083333333333", specialty: "Kaki-kaki", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "tech-4", name: "Rudi Hartono", phone: "084444444444", specialty: "Body & Cat", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const promos: PromoPackage[] = [
  {
    id: "promo-1",
    name: "Paket Liburan Aman (Oli + Tune Up)",
    description: "Ganti oli mesin (4L) + Filter + Tune Up lengkap + Pengecekan 20 titik kendaraan.",
    originalPrice: 850000,
    promoPrice: 599000,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "promo-2",
    name: "Paket Kaki-Kaki Prima",
    description: "Spooring, Balancing 4 roda, dan pembersihan rem depan belakang.",
    originalPrice: 450000,
    promoPrice: 299000,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const settings: Settings = {
  id: "settings-main",
  workshopName: "BENGKEL OS CZ-BARRATEC",
  address: "Jl. Raya Otomotif No. 123, Jakarta Selatan",
  phone: "081234567890",
  logoUrl: "",
  bankName: "BCA",
  bankAccountName: "Bengkel OS CZ-BARRATEC",
  bankAccountNumber: "1234567890",
  openTime: "08:00",
  closeTime: "17:00",
  maxBookingPerSlot: 3,
  slotIntervalMinutes: 60,
  operationalDays: null,
  carTypes: ["Toyota Avanza", "Honda Brio", "Toyota Innova", "Daihatsu Xenia", "Honda HR-V", "Lainnya"],
  problemOptions: ["Servis rutin berkala", "Ganti Oli", "Pengecekan Kaki-kaki", "AC tidak dingin", "Lainnya"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const NAMES = ["Andi Wirawan", "Siti Rahayu", "Bambang W.", "Rina Sari", "Dodi Prasetyo", "Joko Susilo", "Rudi Hermawan", "Bima Sakti", "Citra Dewi", "Eko Putranto"];
const CARS = ["Toyota Avanza", "Honda Brio", "Toyota Innova", "Daihatsu Xenia", "Honda HR-V", "Toyota Fortuner", "Mitsubishi Pajero", "Honda Civic", "Toyota Camry", "Suzuki Ertiga"];
const ISSUES = ["Servis rutin berkala", "Bunyi aneh di bagian mesin", "AC tidak dingin", "Rem terasa kurang pakem", "Cek oli dan filter", "Tune-up rutin", "Kaca spion rusak", "Klakson tidak bunyi"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPlate(): string {
  const prefix = pick(["B", "D", "F", "T", "Z"]);
  const num = Math.floor(Math.random() * 8999) + 1000;
  const s = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const suffix = s[Math.floor(Math.random() * s.length)] + s[Math.floor(Math.random() * s.length)] + s[Math.floor(Math.random() * s.length)];
  return `${prefix} ${num} ${suffix}`;
}

function generateBooking(dateObj: Date, status: string, idx: number): Booking {
  const svc = pick(services);
  const isSelesai = status === "Selesai";
  const isProgress = isSelesai || status === "Dikerjakan" || status === "Datang";
  const tech = isProgress ? pick(technicians) : null;
  const bookingDate = format(dateObj, "yyyy-MM-dd");

  return {
    id: `booking-${bookingDate}-${idx}`,
    bookingCode: `BK-${format(dateObj, "yyMMdd")}-${String(idx).padStart(3, "0")}`,
    customerName: NAMES[idx % NAMES.length],
    customerPhone: `081${String(Math.floor(Math.random() * 999999999)).padStart(9, "0")}`,
    bookingDate,
    bookingTime: `${String((idx % 9) + 8).padStart(2, "0")}:00`,
    carType: CARS[idx % CARS.length],
    plateNumber: randomPlate(),
    carYear: 2018 + (idx % 7),
    problemDescription: ISSUES[idx % ISSUES.length],
    serviceType: svc.name,
    status,
    source: pick(["Online Form", "WhatsApp", "Telepon"]),
    estimatedPrice: isSelesai ? svc.estimatedPrice : null,
    technicianId: tech?.id ?? null,
    technicianName: tech?.name ?? null,
    customerNote: null,
    adminNote: null,
    estimatedFinishTime: null,
    createdAt: subDays(dateObj, 1).toISOString(),
    updatedAt: dateObj.toISOString(),
  };
}

function generateAllBookings(): Booking[] {
  const today = new Date();
  const all: Booking[] = [];

  const todayStatuses = ["Baru", "Menunggu Konfirmasi", "Datang", "Dikerjakan", "Selesai", "Selesai", "Batal"];
  todayStatuses.forEach((status, i) => all.push(generateBooking(today, status, i)));

  for (let d = 1; d <= 30; d++) {
    const day = subDays(today, d);
    for (let j = 0; j < 3; j++) {
      const status = pick(["Selesai", "Selesai", "Selesai", "Batal", "Tidak Datang"]);
      all.push(generateBooking(day, status, 100 + d * 10 + j));
    }
  }

  for (let d = 1; d <= 14; d++) {
    const day = addDays(today, d);
    for (let j = 0; j < 2; j++) {
      const status = pick(["Baru", "Baru", "Menunggu Konfirmasi"]);
      all.push(generateBooking(day, status, 500 + d * 10 + j));
    }
  }

  return all;
}

const bookings: Booking[] = generateAllBookings();
const historyByBooking: Record<string, HistoryEntry[]> = {};

function initialHistory(booking: Booking): HistoryEntry[] {
  const history: HistoryEntry[] = [
    { id: `hist-${booking.id}-1`, bookingId: booking.id, oldStatus: null, newStatus: "Baru", note: "Booking masuk via " + booking.source, changedBy: null, changedAt: booking.createdAt, adminName: null },
  ];

  const flow = ["Baru", "Menunggu Konfirmasi", "Datang", "Dikerjakan", "Selesai"];
  const statusIdx = flow.indexOf(booking.status);

  if (statusIdx >= 1) history.push({ id: `hist-${booking.id}-2`, bookingId: booking.id, oldStatus: "Baru", newStatus: "Menunggu Konfirmasi", note: "Admin telah mengkonfirmasi jadwal", changedBy: "admin-demo-cz-barratec", changedAt: booking.createdAt, adminName: "Admin CZ-Barratec" });
  if (statusIdx >= 2) history.push({ id: `hist-${booking.id}-3`, bookingId: booking.id, oldStatus: "Menunggu Konfirmasi", newStatus: "Datang", note: "Konsumen tiba di bengkel", changedBy: "admin-demo-cz-barratec", changedAt: booking.updatedAt, adminName: "Admin CZ-Barratec" });
  if (statusIdx >= 3) history.push({ id: `hist-${booking.id}-4`, bookingId: booking.id, oldStatus: "Datang", newStatus: "Dikerjakan", note: "Pengerjaan dimulai", changedBy: "admin-demo-cz-barratec", changedAt: booking.updatedAt, adminName: "Admin CZ-Barratec" });
  if (statusIdx >= 4) history.push({ id: `hist-${booking.id}-5`, bookingId: booking.id, oldStatus: "Dikerjakan", newStatus: "Selesai", note: "Pengerjaan selesai, kendaraan siap diambil", changedBy: "admin-demo-cz-barratec", changedAt: booking.updatedAt, adminName: "Admin CZ-Barratec" });
  if (booking.status === "Batal") history.push({ id: `hist-${booking.id}-batal`, bookingId: booking.id, oldStatus: "Baru", newStatus: "Batal", note: "Konsumen membatalkan booking", changedBy: null, changedAt: booking.updatedAt, adminName: null });

  return history;
}

function getHistory(booking: Booking): HistoryEntry[] {
  if (!historyByBooking[booking.id]) historyByBooking[booking.id] = initialHistory(booking);
  return historyByBooking[booking.id];
}

// ---- Services ----
export function getServices(): Service[] {
  return services;
}

export function getActiveServices(): Service[] {
  return services.filter(s => s.isActive);
}

export function addService(data: { name: string }): { id: string } {
  const id = `svc-${Date.now()}`;
  services.push({
    id,
    name: data.name,
    estimatedDuration: 60,
    estimatedPrice: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return { id };
}

// ---- Technicians ----
export function getTechnicians(): Technician[] {
  return technicians;
}

export function addTechnician(data: { name: string; specialty?: string }): { id: string } {
  const id = `tech-${Date.now()}`;
  technicians.push({
    id,
    name: data.name,
    phone: "",
    specialty: data.specialty || "",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return { id };
}

// ---- Promos ----
export function getPromos(): PromoPackage[] {
  return promos;
}

export function getActivePromos(): PromoPackage[] {
  return promos.filter(p => p.isActive);
}

export function addPromo(data: { name: string; description: string; originalPrice: number; promoPrice: number }): { id: string } {
  const id = `promo-${Date.now()}`;
  promos.push({
    id,
    name: data.name,
    description: data.description,
    originalPrice: data.originalPrice,
    promoPrice: data.promoPrice,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return { id };
}

// ---- Settings ----
export function getSettings(): Settings {
  return settings;
}

export function updateSettings(data: Partial<Settings>): { success: true } {
  Object.assign(settings, data, { updatedAt: new Date().toISOString() });
  return { success: true };
}

// ---- Bookings ----
export interface BookingFilters {
  date?: string;
  status?: string;
  search?: string;
  serviceType?: string;
  technicianId?: string;
}

export function getBookings(filters: BookingFilters = {}): Booking[] {
  let results = bookings;
  const { date, status, search, serviceType, technicianId } = filters;

  if (date) results = results.filter(b => b.bookingDate === date);
  if (status) results = results.filter(b => b.status === status);
  if (serviceType) results = results.filter(b => b.serviceType === serviceType);
  if (technicianId) results = results.filter(b => b.technicianId === technicianId);
  if (search) {
    const s = search.toLowerCase();
    results = results.filter(b =>
      b.customerName.toLowerCase().includes(s) ||
      b.customerPhone.includes(s) ||
      (b.plateNumber && b.plateNumber.toLowerCase().includes(s))
    );
  }

  return results;
}

export function getBookingById(id: string): (Booking & { history: HistoryEntry[] }) | null {
  const b = bookings.find(b => b.id === id);
  if (!b) return null;
  return { ...b, history: getHistory(b) };
}

export function createBooking(data: Record<string, any>): { id: string; bookingCode: string } {
  const now = new Date();
  const id = `mock-${Date.now()}`;
  const bookingCode = "BK-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const booking: Booking = {
    id,
    bookingCode,
    customerName: data.customerName || "",
    customerPhone: data.customerPhone || "",
    bookingDate: data.bookingDate || format(now, "yyyy-MM-dd"),
    bookingTime: data.bookingTime || "09:00",
    carType: data.carType || "",
    plateNumber: data.plateNumber || "",
    carYear: now.getFullYear(),
    problemDescription: data.problemDescription || "",
    serviceType: data.serviceType || "",
    status: data.status || "Baru",
    source: data.source || "WhatsApp",
    estimatedPrice: null,
    technicianId: null,
    technicianName: null,
    customerNote: null,
    adminNote: data.adminNote || null,
    estimatedFinishTime: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  bookings.unshift(booking);
  return { id, bookingCode };
}

export function createPublicBooking(data: Record<string, any>): { success: true; bookingCode: string } {
  const { bookingCode } = createBooking({ ...data, status: "Baru", source: "Online Form" });
  return { success: true, bookingCode };
}

export function updateBookingStatus(id: string, status: string, note: string | null): { success: true } {
  const booking = bookings.find(b => b.id === id);
  if (booking) {
    const now = new Date().toISOString();
    getHistory(booking).push({
      id: `hist-${id}-${Date.now()}`,
      bookingId: id,
      oldStatus: booking.status,
      newStatus: status,
      note: note || null,
      changedBy: "admin-demo-cz-barratec",
      changedAt: now,
      adminName: "Admin CZ-Barratec",
    });
    booking.status = status;
    booking.updatedAt = now;
  }
  return { success: true };
}

export function updateBookingTechnician(id: string, technicianId: string): { success: true } {
  const booking = bookings.find(b => b.id === id);
  if (booking) {
    const tech = technicians.find(t => t.id === technicianId);
    booking.technicianId = technicianId || null;
    booking.technicianName = tech?.name ?? null;
    booking.updatedAt = new Date().toISOString();
  }
  return { success: true };
}

// ---- Dashboard ----
export function getDashboardStats() {
  const today = format(new Date(), "yyyy-MM-dd");
  const todayBookings = bookings.filter(b => b.bookingDate === today);

  const statusMap: Record<string, number> = {};
  todayBookings.forEach(b => {
    statusMap[b.status] = (statusMap[b.status] || 0) + 1;
  });

  return {
    todayTotal: todayBookings.length,
    statuses: Object.entries(statusMap).map(([status, count]) => ({ status, count })),
  };
}

// ---- Slots ----
export function getSlotInfo(date: string) {
  const dayBookings = bookings.filter(
    b => b.bookingDate === date && b.status !== "Batal" && b.status !== "Tidak Datang"
  );
  const timeMap: Record<string, number> = {};
  dayBookings.forEach(b => {
    timeMap[b.bookingTime] = (timeMap[b.bookingTime] || 0) + 1;
  });

  return {
    settings,
    bookings: Object.entries(timeMap).map(([time, count]) => ({ time, count })),
  };
}

// ---- Reports ----
export function getReports(filters: { start?: string; end?: string; status?: string }): Booking[] {
  let results = bookings;
  const { start, end, status } = filters;

  if (start) results = results.filter(b => b.bookingDate >= start);
  if (end) results = results.filter(b => b.bookingDate <= end);
  if (status) results = results.filter(b => b.status === status);

  return [...results].sort((a, b) => a.bookingDate.localeCompare(b.bookingDate) || a.bookingTime.localeCompare(b.bookingTime));
}

// ---- Auth (mock, client-side only) ----
export function login(email: string, password: string): boolean {
  const ok = email === "admin@bengkel.com" && password === "admin123";
  if (ok) localStorage.setItem("bw_admin_session", "true");
  return ok;
}

export function logout(): void {
  localStorage.removeItem("bw_admin_session");
}
