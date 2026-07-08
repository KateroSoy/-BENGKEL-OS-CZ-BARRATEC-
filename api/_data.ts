// In-memory mock data store for Vercel serverless deployment
// Each function invocation gets a fresh copy, but that's fine for demo purposes

import { format, subDays, addDays } from "date-fns";

const MOCK_SERVICES = [
  { id: "svc-1", name: "Servis Ringan", estimatedDuration: 60, estimatedPrice: 350000, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "svc-2", name: "Servis Besar", estimatedDuration: 180, estimatedPrice: 1500000, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "svc-3", name: "Ganti Oli", estimatedDuration: 30, estimatedPrice: 250000, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "svc-4", name: "Tune Up", estimatedDuration: 90, estimatedPrice: 450000, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "svc-5", name: "AC Mobil", estimatedDuration: 120, estimatedPrice: 500000, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "svc-6", name: "Ganti Ban", estimatedDuration: 45, estimatedPrice: 800000, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "svc-7", name: "Pengecekan Rem", estimatedDuration: 60, estimatedPrice: 200000, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const MOCK_TECHS = [
  { id: "tech-1", name: "Budi Santoso", phone: "081111111111", specialty: "Mesin", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "tech-2", name: "Agus Kurniawan", phone: "082222222222", specialty: "AC & Kelistrikan", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "tech-3", name: "Joko Susilo", phone: "083333333333", specialty: "Kaki-kaki", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "tech-4", name: "Rudi Hartono", phone: "084444444444", specialty: "Body & Cat", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const MOCK_SETTINGS = {
  id: "settings-main",
  workshopName: "BENGKEL OS CZ-BARRATEC",
  phone: "08123456789",
  address: "Jl. Otomotif Raya No. 1, Jakarta Selatan",
  openTime: "08:00",
  closeTime: "17:00",
  maxBookingPerSlot: 3,
  slotIntervalMinutes: 60,
  operationalDays: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const NAMES = ["Andi Wirawan", "Siti Rahayu", "Bambang W.", "Rina Sari", "Dodi Prasetyo", "Joko Susilo", "Rudi Hermawan", "Bima Sakti", "Citra Dewi", "Eko Putranto"];
const CARS = ["Toyota Avanza", "Honda Brio", "Toyota Innova", "Daihatsu Xenia", "Honda HR-V", "Toyota Fortuner", "Mitsubishi Pajero", "Honda Civic", "Toyota Camry", "Suzuki Ertiga"];
const ISSUES = ["Servis rutin berkala", "Bunyi aneh di bagian mesin", "AC tidak dingin", "Rem terasa kurang pakem", "Cek oli dan filter", "Tune-up rutin", "Kaca spion rusak", "Klakson tidak bunyi"];
const STATUSES_ALL = ["Baru", "Menunggu Konfirmasi", "Dikerjakan", "Selesai", "Datang", "Batal"];
const SOURCES = ["Online Form", "WhatsApp", "Telepon"];

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

function generateBooking(dateObj: Date, status: string, idx: number) {
  const svc = pick(MOCK_SERVICES);
  const isSelesai = status === "Selesai";
  const isProgress = isSelesai || status === "Dikerjakan" || status === "Datang";
  const techId = isProgress ? pick(MOCK_TECHS).id : null;
  const techName = techId ? MOCK_TECHS.find(t => t.id === techId)?.name || null : null;
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
    source: SOURCES[idx % SOURCES.length],
    estimatedPrice: isSelesai ? svc.estimatedPrice : null,
    technicianId: techId,
    technicianName: techName,
    customerNote: null,
    adminNote: null,
    estimatedFinishTime: null,
    createdAt: subDays(dateObj, 1).toISOString(),
    updatedAt: dateObj.toISOString(),
  };
}

function generateHistory(booking: any) {
  const history: any[] = [
    {
      id: `hist-${booking.id}-1`,
      bookingId: booking.id,
      oldStatus: null,
      newStatus: "Baru",
      note: "Booking masuk via " + booking.source,
      changedBy: null,
      changedAt: booking.createdAt,
      adminName: null,
    },
  ];

  const flow = ["Baru", "Menunggu Konfirmasi", "Datang", "Dikerjakan", "Selesai"];
  const statusIdx = flow.indexOf(booking.status);

  if (statusIdx >= 1) {
    history.push({ id: `hist-${booking.id}-2`, bookingId: booking.id, oldStatus: "Baru", newStatus: "Menunggu Konfirmasi", note: "Admin telah mengkonfirmasi jadwal", changedBy: "admin-demo-cz-barratec", changedAt: booking.createdAt, adminName: "Admin CZ-Barratec" });
  }
  if (statusIdx >= 2) {
    history.push({ id: `hist-${booking.id}-3`, bookingId: booking.id, oldStatus: "Menunggu Konfirmasi", newStatus: "Datang", note: "Konsumen tiba di bengkel", changedBy: "admin-demo-cz-barratec", changedAt: booking.updatedAt, adminName: "Admin CZ-Barratec" });
  }
  if (statusIdx >= 3) {
    history.push({ id: `hist-${booking.id}-4`, bookingId: booking.id, oldStatus: "Datang", newStatus: "Dikerjakan", note: "Pengerjaan dimulai", changedBy: "admin-demo-cz-barratec", changedAt: booking.updatedAt, adminName: "Admin CZ-Barratec" });
  }
  if (statusIdx >= 4) {
    history.push({ id: `hist-${booking.id}-5`, bookingId: booking.id, oldStatus: "Dikerjakan", newStatus: "Selesai", note: "Pengerjaan selesai, kendaraan siap diambil", changedBy: "admin-demo-cz-barratec", changedAt: booking.updatedAt, adminName: "Admin CZ-Barratec" });
  }
  if (booking.status === "Batal") {
    history.push({ id: `hist-${booking.id}-batal`, bookingId: booking.id, oldStatus: "Baru", newStatus: "Batal", note: "Konsumen membatalkan booking", changedBy: null, changedAt: booking.updatedAt, adminName: null });
  }

  return history;
}

// Generate all mock bookings
function generateAllBookings() {
  const today = new Date();
  const allBookings: any[] = [];

  // Today's bookings (7 bookings with varied statuses)
  const todayStatuses = ["Baru", "Menunggu Konfirmasi", "Datang", "Dikerjakan", "Selesai", "Selesai", "Batal"];
  todayStatuses.forEach((status, i) => {
    allBookings.push(generateBooking(today, status, i));
  });

  // Past 30 days (3 per day)
  for (let d = 1; d <= 30; d++) {
    const day = subDays(today, d);
    for (let j = 0; j < 3; j++) {
      const status = pick(["Selesai", "Selesai", "Selesai", "Batal", "Tidak Datang"]);
      allBookings.push(generateBooking(day, status, 100 + d * 10 + j));
    }
  }

  // Future 14 days (2 per day)
  for (let d = 1; d <= 14; d++) {
    const day = addDays(today, d);
    for (let j = 0; j < 2; j++) {
      const status = pick(["Baru", "Baru", "Menunggu Konfirmasi"]);
      allBookings.push(generateBooking(day, status, 500 + d * 10 + j));
    }
  }

  return allBookings;
}

// Cached data (regenerated per cold start, stable within a single invocation chain)
let _bookings: any[] | null = null;

export function getBookings() {
  if (!_bookings) _bookings = generateAllBookings();
  return _bookings;
}

export function getBookingById(id: string) {
  const b = getBookings().find(b => b.id === id);
  if (!b) return null;
  return { ...b, history: generateHistory(b) };
}

export function getServices() { return MOCK_SERVICES; }
export function getActiveServices() { return MOCK_SERVICES.filter(s => s.isActive); }
export function getTechnicians() { return MOCK_TECHS; }
export function getSettings() { return MOCK_SETTINGS; }

export function getDashboardStats() {
  const today = format(new Date(), "yyyy-MM-dd");
  const todayBookings = getBookings().filter(b => b.bookingDate === today);

  const statusMap: Record<string, number> = {};
  todayBookings.forEach(b => {
    statusMap[b.status] = (statusMap[b.status] || 0) + 1;
  });

  return {
    todayTotal: todayBookings.length,
    statuses: Object.entries(statusMap).map(([status, count]) => ({ status, count })),
  };
}

export function getSlotInfo(date: string) {
  const dayBookings = getBookings().filter(
    b => b.bookingDate === date && b.status !== "Batal" && b.status !== "Tidak Datang"
  );
  const timeMap: Record<string, number> = {};
  dayBookings.forEach(b => {
    timeMap[b.bookingTime] = (timeMap[b.bookingTime] || 0) + 1;
  });

  return {
    settings: MOCK_SETTINGS,
    bookings: Object.entries(timeMap).map(([time, count]) => ({ time, count })),
  };
}
