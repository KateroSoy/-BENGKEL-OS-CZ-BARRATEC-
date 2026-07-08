import { db } from "./src/db";
import {
  bookings,
  bookingStatusHistory,
  services,
  technicians,
} from "./src/db/schema";
import { sql } from "drizzle-orm";
import crypto from "crypto";
import { format, subDays } from "date-fns";

const NAMES = [
  "Andi Wirawan", "Siti Rahayu", "Bambang Prasetyo", "Rina Kusuma",
  "Dodi Santoso", "Joko Widodo", "Rudi Hermawan", "Bima Sakti",
  "Citra Dewi", "Eko Putranto", "Fauzi Rahman", "Gita Permata",
  "Hendra Gunawan", "Indah Lestari", "Lukman Hakim"
];
const CARS = [
  "Toyota Avanza", "Honda Brio", "Toyota Innova", "Daihatsu Xenia",
  "Honda HR-V", "Toyota Fortuner", "Mitsubishi Pajero", "Honda Civic",
  "Toyota Camry", "Suzuki Ertiga", "Nissan X-Trail", "Toyota Rush",
  "Daihatsu Terios", "Honda Jazz", "Hyundai Tucson"
];
const ISSUES = [
  "Servis rutin 10.000 km", "Ganti oli mesin dan filter", "AC tidak dingin, freon habis",
  "Bunyi aneh di bagian roda kiri", "Rem blong, perlu dicek", "Tune-up mesin",
  "Mesin overheat saat macet", "Cek seluruh kaki-kaki", "Klakson mati",
  "Lampu depan redup", "Wiper tidak berfungsi", "Stir terasa berat",
];
const STATUSES_TODAY = [
  "Baru", "Baru",
  "Menunggu Konfirmasi", "Menunggu Konfirmasi",
  "Datang", "Datang",
  "Dikerjakan", "Dikerjakan", "Dikerjakan",
  "Selesai", "Selesai", "Selesai", "Selesai",
  "Batal"
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function forceSeedToday() {
  const todayStr = format(new Date(), "yyyy-MM-dd");

  // Delete all today's bookings (cascade deletes history)
  console.log(`[Force Seed] Deleting existing bookings for ${todayStr}...`);
  const existing = await db.select({ id: bookings.id }).from(bookings)
    .where(sql`${bookings.bookingDate} = ${todayStr}`);
  
  for (const b of existing) {
    await db.delete(bookingStatusHistory).where(sql`${bookingStatusHistory.bookingId} = ${b.id}`);
    await db.delete(bookings).where(sql`${bookings.id} = ${b.id}`);
  }
  console.log(`[Force Seed] Deleted ${existing.length} existing bookings.`);

  // Load existing services and techs
  const dbServices = await db.select().from(services);
  const dbTechs = await db.select().from(technicians);

  if (dbServices.length === 0) {
    console.error("[Force Seed] No services found. Run the main seeder first!");
    process.exit(1);
  }

  // Time slots: 08:00–16:00 (9 slots)
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
  const sources = ["Online Form", "WhatsApp", "Telepon", "Online Form", "WhatsApp"];

  let inserted = 0;

  // Fill 2–3 bookings per slot (total ~20–27 bookings)
  for (const slot of timeSlots) {
    const countPerSlot = Math.floor(Math.random() * 2) + 2; // 2 or 3
    for (let i = 0; i < countPerSlot; i++) {
      const svc     = pick(dbServices);
      const tech    = pick(dbTechs);
      const status  = pick(STATUSES_TODAY);
      const isSel   = status === "Selesai";
      const isDikrj = isSel || status === "Dikerjakan";
      const isDat   = isDikrj || status === "Datang";
      const isConf  = isDat || status === "Menunggu Konfirmasi";
      const id      = crypto.randomUUID();

      const booking = {
        id,
        bookingCode:        `BK-${format(new Date(), "yyMMdd")}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`,
        customerName:       pick(NAMES),
        customerPhone:      `081${String(Math.floor(Math.random() * 999999999)).padStart(9, "0")}`,
        bookingDate:        todayStr,
        bookingTime:        slot,
        carType:            pick(CARS),
        plateNumber:        `${pick(["B","D","F","T","Z"])} ${Math.floor(Math.random() * 8999) + 1000} ${String.fromCharCode(65 + Math.floor(Math.random() * 25))}${String.fromCharCode(65 + Math.floor(Math.random() * 25))}${String.fromCharCode(65 + Math.floor(Math.random() * 25))}`,
        carYear:            2018 + Math.floor(Math.random() * 7),
        problemDescription: pick(ISSUES),
        serviceType:        svc.name,
        status,
        source:             pick(sources),
        estimatedPrice:     isSel ? svc.estimatedPrice : null,
        technicianId:       isDikrj ? tech.id : null,
      };

      await db.insert(bookings).values(booking);

      // Build history
      const hist: any[] = [{
        id: crypto.randomUUID(), bookingId: id,
        newStatus: "Baru",
        note: "Booking masuk via " + booking.source,
        changedBy: null, changedAt: subDays(new Date(), 1),
      }];

      if (isConf) hist.push({ id: crypto.randomUUID(), bookingId: id, oldStatus: "Baru", newStatus: "Menunggu Konfirmasi", note: "Admin konfirmasi jadwal", changedBy: null, changedAt: new Date() });
      if (isDat)  hist.push({ id: crypto.randomUUID(), bookingId: id, oldStatus: "Menunggu Konfirmasi", newStatus: "Datang", note: "Konsumen tiba di bengkel", changedBy: null, changedAt: new Date() });
      if (isDikrj) hist.push({ id: crypto.randomUUID(), bookingId: id, oldStatus: "Datang", newStatus: "Dikerjakan", note: `Dikerjakan oleh ${tech.name}`, changedBy: null, changedAt: new Date() });
      if (isSel)  hist.push({ id: crypto.randomUUID(), bookingId: id, oldStatus: "Dikerjakan", newStatus: "Selesai", note: "Selesai, siap diambil", changedBy: null, changedAt: new Date() });
      if (status === "Batal") hist.push({ id: crypto.randomUUID(), bookingId: id, oldStatus: "Baru", newStatus: "Batal", note: "Pelanggan membatalkan", changedBy: null, changedAt: new Date() });

      await db.insert(bookingStatusHistory).values(hist);
      inserted++;
    }
  }

  console.log(`[Force Seed] ✅ Done! Inserted ${inserted} bookings for today (${todayStr}).`);
  console.log("[Force Seed] Breakdown per slot: 2–3 bookings each.");
}

forceSeedToday().then(() => process.exit(0)).catch(err => {
  console.error("[Force Seed] FAILED:", err);
  process.exit(1);
});
