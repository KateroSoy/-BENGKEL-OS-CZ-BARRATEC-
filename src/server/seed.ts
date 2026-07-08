import { db } from "../db";
import {
  services,
  technicians,
  bookings,
  workshopSettings,
  users,
  bookingStatusHistory,
} from "../db/schema";
import { count, sql } from "drizzle-orm";
import crypto from "crypto";
import { format, subDays, addDays } from "date-fns";

// ─── Static Demo Data ────────────────────────────────────────────────────────

const MOCK_SERVICES = [
  { id: "svc-1", name: "Servis Ringan",   estimatedDuration: 60,  estimatedPrice: 350000  },
  { id: "svc-2", name: "Servis Besar",    estimatedDuration: 180, estimatedPrice: 1500000 },
  { id: "svc-3", name: "Ganti Oli",       estimatedDuration: 30,  estimatedPrice: 250000  },
  { id: "svc-4", name: "Tune Up",         estimatedDuration: 90,  estimatedPrice: 450000  },
  { id: "svc-5", name: "AC Mobil",        estimatedDuration: 120, estimatedPrice: 500000  },
  { id: "svc-6", name: "Ganti Ban",       estimatedDuration: 45,  estimatedPrice: 800000  },
  { id: "svc-7", name: "Pengecekan Rem",  estimatedDuration: 60,  estimatedPrice: 200000  },
];

const MOCK_TECHS = [
  { id: "tech-1", name: "Budi Santoso",   phone: "081111111111", specialty: "Mesin" },
  { id: "tech-2", name: "Agus Kurniawan", phone: "082222222222", specialty: "AC & Kelistrikan" },
  { id: "tech-3", name: "Joko Susilo",    phone: "083333333333", specialty: "Kaki-kaki" },
  { id: "tech-4", name: "Rudi Hartono",   phone: "084444444444", specialty: "Body & Cat" },
];

const STATUSES_ALL    = ["Baru", "Menunggu Konfirmasi", "Dikerjakan", "Selesai", "Selesai", "Selesai", "Datang", "Batal"];
const STATUSES_FUTURE = ["Baru", "Baru", "Menunggu Konfirmasi"];
const NAMES  = ["Andi Wirawan", "Siti Rahayu", "Bambang W.", "Rina Sari", "Dodi Prasetyo", "Joko Susilo", "Rudi Hermawan", "Bima Sakti", "Citra Dewi", "Eko Putranto"];
const CARS   = ["Toyota Avanza", "Honda Brio", "Toyota Innova", "Daihatsu Xenia", "Honda HR-V", "Toyota Fortuner", "Mitsubishi Pajero", "Honda Civic", "Toyota Camry", "Suzuki Ertiga"];
const ISSUES = ["Servis rutin berkala", "Bunyi aneh di bagian mesin", "AC tidak dingin", "Rem terasa kurang pakem", "Cek oli dan filter", "Tune-up rutin", "Kaca spion rusak", "Klakson tidak bunyi"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPlate(): string {
  const prefix = pick(["B", "D", "F", "T", "Z"]);
  const num    = Math.floor(Math.random() * 8999) + 1000;
  const s      = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const suffix = s[Math.floor(Math.random() * s.length)] + s[Math.floor(Math.random() * s.length)] + s[Math.floor(Math.random() * s.length)];
  return `${prefix} ${num} ${suffix}`;
}

// Insert a single booking + its status history atomically
async function insertBookingWithHistory(
  dateObj: Date,
  forcedStatus?: string,
  techIds?: string[]
) {
  const bookingDate = format(dateObj, "yyyy-MM-dd");
  const svc         = pick(MOCK_SERVICES);
  const status      = forcedStatus ?? pick(STATUSES_ALL);
  const isSelesai   = status === "Selesai";
  const isProgress  = isSelesai || status === "Dikerjakan" || status === "Datang";
  const isConfirmed = isProgress || status === "Menunggu Konfirmasi";
  const techId      = (techIds && techIds.length > 0 && isProgress) ? pick(techIds) : null;
  const id          = crypto.randomUUID();

  const booking = {
    id,
    bookingCode:        `BK-${format(dateObj, "yyMMdd")}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`,
    customerName:       pick(NAMES),
    customerPhone:      `081${String(Math.floor(Math.random() * 999999999)).padStart(9, "0")}`,
    bookingDate,
    bookingTime:        `${String(Math.floor(Math.random() * 8) + 8).padStart(2, "0")}:00`,
    carType:            pick(CARS),
    plateNumber:        randomPlate(),
    carYear:            2018 + Math.floor(Math.random() * 7),
    problemDescription: pick(ISSUES),
    serviceType:        svc.name,
    status,
    source:             pick(["Online Form", "WhatsApp", "Telepon"]),
    estimatedPrice:     isSelesai ? svc.estimatedPrice : null,
    technicianId:       techId,
  };

  // Build history
  const history: any[] = [
    {
      id: crypto.randomUUID(), bookingId: id,
      newStatus: "Baru",
      note: "Booking masuk via " + booking.source,
      changedBy: null,
      changedAt: subDays(dateObj, 2),
    },
  ];

  if (isConfirmed) {
    history.push({
      id: crypto.randomUUID(), bookingId: id,
      oldStatus: "Baru", newStatus: "Menunggu Konfirmasi",
      note: "Admin telah mengkonfirmasi jadwal",
      changedBy: null, changedAt: subDays(dateObj, 1),
    });
  }

  if (isProgress) {
    history.push({
      id: crypto.randomUUID(), bookingId: id,
      oldStatus: "Menunggu Konfirmasi", newStatus: "Datang",
      note: "Konsumen tiba di bengkel",
      changedBy: null, changedAt: dateObj,
    });
  }

  if (status === "Dikerjakan" || isSelesai) {
    history.push({
      id: crypto.randomUUID(), bookingId: id,
      oldStatus: "Datang", newStatus: "Dikerjakan",
      note: "Pengerjaan dimulai",
      changedBy: null, changedAt: dateObj,
    });
  }

  if (isSelesai) {
    history.push({
      id: crypto.randomUUID(), bookingId: id,
      oldStatus: "Dikerjakan", newStatus: "Selesai",
      note: "Pengerjaan selesai, kendaraan siap diambil",
      changedBy: null, changedAt: dateObj,
    });
  }

  if (status === "Batal") {
    history.push({
      id: crypto.randomUUID(), bookingId: id,
      oldStatus: "Baru", newStatus: "Batal",
      note: "Konsumen membatalkan booking",
      changedBy: null, changedAt: dateObj,
    });
  }

  // Insert booking first, then history (respect FK)
  await db.insert(bookings).values(booking);
  await db.insert(bookingStatusHistory).values(history);
}

// ─── Main Seed Function ───────────────────────────────────────────────────────

export async function seedDatabase() {
  const today    = new Date();
  const todayStr = format(today, "yyyy-MM-dd");

  // ── 1. Settings ──────────────────────────────────────────────────────────
  const settingsCount = await db.select({ count: count() }).from(workshopSettings);
  if (settingsCount[0].count === 0) {
    await db.insert(workshopSettings).values({
      id:                  "settings-main",
      workshopName:        "BENGKEL OS CZ-BARRATEC",
      phone:               "08123456789",
      address:             "Jl. Otomotif Raya No. 1, Jakarta Selatan",
      openTime:            "08:00",
      closeTime:           "17:00",
      maxBookingPerSlot:   3,
      slotIntervalMinutes: 60,
    });
    console.log("[Seed] ✓ Workshop settings inserted.");
  }

  // ── 2. Admin User ─────────────────────────────────────────────────────────
  const userCount = await db.select({ count: count() }).from(users);
  if (userCount[0].count === 0) {
    await db.insert(users).values({
      id:           "admin-demo-cz-barratec",
      name:         "Admin CZ-Barratec",
      email:        "admin@bengkel.com",
      passwordHash: "admin123",
      role:         "admin",
    });
    console.log("[Seed] ✓ Admin user inserted.");
  }

  // ── 3. Services ───────────────────────────────────────────────────────────
  const svcCount = await db.select({ count: count() }).from(services);
  if (svcCount[0].count === 0) {
    await db.insert(services).values(MOCK_SERVICES);
    console.log("[Seed] ✓ Services inserted.");
  }

  // ── 4. Technicians ────────────────────────────────────────────────────────
  const techCount = await db.select({ count: count() }).from(technicians);
  if (techCount[0].count === 0) {
    await db.insert(technicians).values(MOCK_TECHS);
    console.log("[Seed] ✓ Technicians inserted.");
  }

  // Load existing tech IDs to use as FK references
  const existingTechs = await db.select({ id: technicians.id }).from(technicians);
  const techIds = existingTechs.map(t => t.id);

  // ── 5. Today's Bookings ───────────────────────────────────────────────────
  const todayCount = await db
    .select({ count: count() })
    .from(bookings)
    .where(sql`${bookings.bookingDate} = ${todayStr}`);

  if (todayCount[0].count === 0) {
    console.log(`[Seed] Today (${todayStr}) empty — seeding today's bookings...`);
    const forcedStatuses = ["Baru", "Menunggu Konfirmasi", "Datang", "Dikerjakan", "Selesai", "Selesai", "Batal"];
    for (const s of forcedStatuses) {
      await insertBookingWithHistory(today, s, techIds);
    }
    console.log("[Seed] ✓ Today's bookings inserted.");
  }

  // ── 6. Historical Bookings (past 30 days) ─────────────────────────────────
  const histCount = await db
    .select({ count: count() })
    .from(bookings)
    .where(sql`${bookings.bookingDate} < ${todayStr}`);

  if (histCount[0].count < 20) {
    console.log("[Seed] Historical bookings thin — seeding past data...");
    let inserted = 0;
    for (let d = 1; d <= 30; d++) {
      const day = subDays(today, d);
      const cnt = Math.floor(Math.random() * 3) + 2; // 2–4 per day
      for (let j = 0; j < cnt; j++) {
        await insertBookingWithHistory(day, undefined, techIds);
        inserted++;
      }
    }
    console.log(`[Seed] ✓ Historical bookings inserted (${inserted} total).`);
  }

  // ── 7. Future Bookings (next 14 days) ────────────────────────────────────
  const futCount = await db
    .select({ count: count() })
    .from(bookings)
    .where(sql`${bookings.bookingDate} > ${todayStr}`);

  if (futCount[0].count < 10) {
    console.log("[Seed] Future bookings thin — seeding upcoming data...");
    let inserted = 0;
    for (let d = 1; d <= 14; d++) {
      const day = addDays(today, d);
      const cnt = Math.floor(Math.random() * 2) + 1; // 1–2 per day
      for (let j = 0; j < cnt; j++) {
        await insertBookingWithHistory(day, pick(STATUSES_FUTURE), techIds);
        inserted++;
      }
    }
    console.log(`[Seed] ✓ Future bookings inserted (${inserted} total).`);
  }

  console.log("[Seed] ✅ All demo data verified — system ready.");
}
