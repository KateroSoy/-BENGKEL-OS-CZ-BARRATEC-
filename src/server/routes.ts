import { Router } from "express";
import { db } from "../db";
import { bookings, services, technicians, workshopSettings, bookingStatusHistory, users } from "../db/schema";
import { eq, and, or, gte, lte, sql, desc, asc } from "drizzle-orm";
import crypto from "crypto";

export const apiRouter = Router();

// ========================
// PUBLIC ROUTES
// ========================

// Get public settings (for booking form)
apiRouter.get("/settings/public", async (req, res) => {
  try {
    const settings = await db.select().from(workshopSettings).limit(1);
    if (!settings.length) return res.json(null);
    res.json(settings[0]);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Get active services
apiRouter.get("/services/public", async (req, res) => {
  try {
    const data = await db.select().from(services).where(eq(services.isActive, true));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Get slots info (simplified for MVP: we would normally calculate available slots)
apiRouter.get("/slots", async (req, res) => {
  try {
    const date = req.query.date as string;
    if (!date) return res.status(400).json({ error: "Date is required" });
    
    const settings = await db.select().from(workshopSettings).limit(1);
    if (!settings.length) return res.status(400).json({ error: "Settings not found" });

    // Find bookings on this date
    const existingBookings = await db.select({
      time: bookings.bookingTime,
      count: sql<number>`count(*)`
    })
    .from(bookings)
    .where(and(eq(bookings.bookingDate, date), sql`status NOT IN ('Batal', 'Tidak Datang')`))
    .groupBy(bookings.bookingTime);

    res.json({
      settings: settings[0],
      bookings: existingBookings
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Create public booking
apiRouter.post("/bookings/public", async (req, res) => {
  try {
    const data = req.body;
    const bookingCode = "BK-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    
    const newBooking = {
      id: crypto.randomUUID(),
      bookingCode,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      bookingDate: data.bookingDate,
      bookingTime: data.bookingTime,
      carType: data.carType,
      carYear: data.carYear,
      plateNumber: data.plateNumber,
      problemDescription: data.problemDescription,
      serviceType: data.serviceType,
      customerNote: data.customerNote || null,
      status: "Baru",
      source: "Online Form",
    };
    
    await db.insert(bookings).values(newBooking);
    
    // Status history
    await db.insert(bookingStatusHistory).values({
      id: crypto.randomUUID(),
      bookingId: newBooking.id,
      newStatus: "Baru",
      note: "Booking created via online form"
    });

    res.json({ success: true, bookingCode });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// ========================
// ADMIN AUTH MIDDLEWARE
// ========================
// For MVP, we will use a simple fixed auth or check the cookie
// Let's implement a quick login
apiRouter.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@bengkel.com" && password === "admin123") {
    res.cookie("admin_session", "true", { httpOnly: true });
    return res.json({ success: true });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

apiRouter.post("/auth/logout", (req, res) => {
  res.clearCookie("admin_session");
  res.json({ success: true });
});

// Admin check middleware (Bypassed for demo purposes)
apiRouter.use((req, res, next) => {
  // if (req.cookies.admin_session !== "true") {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }
  next();
});

// ========================
// ADMIN ROUTES
// ========================

apiRouter.get("/dashboard/stats", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    
    const todayBookings = await db.select({ count: sql<number>`count(*)` })
      .from(bookings).where(eq(bookings.bookingDate, today));
    
    const statusCounts = await db.select({
      status: bookings.status,
      count: sql<number>`count(*)`
    }).from(bookings).where(eq(bookings.bookingDate, today)).groupBy(bookings.status);

    res.json({
      todayTotal: todayBookings[0]?.count || 0,
      statuses: statusCounts
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

apiRouter.get("/bookings", async (req, res) => {
  try {
    const { date, status, search, serviceType, technicianId } = req.query;
    let conditions = [];
    if (date) conditions.push(eq(bookings.bookingDate, date as string));
    if (status) conditions.push(eq(bookings.status, status as string));
    if (serviceType) conditions.push(eq(bookings.serviceType, serviceType as string));
    if (technicianId) conditions.push(eq(bookings.technicianId, technicianId as string));
    
    // We handle search via SQL like for simplicity on sqlite
    if (search) {
      const searchTerm = `%${search as string}%`;
      conditions.push(
        or(
          sql`customer_name LIKE ${searchTerm}`,
          sql`customer_phone LIKE ${searchTerm}`,
          sql`plate_number LIKE ${searchTerm}`
        )
      );
    }
    
    const query = db.select({
      booking: bookings,
      technician: technicians
    })
    .from(bookings)
    .leftJoin(technicians, eq(bookings.technicianId, technicians.id))
    .orderBy(desc(bookings.createdAt));

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }
    
    const results = await query;
    res.json(results.map(r => ({ ...r.booking, technicianName: r.technician?.name })));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

apiRouter.get("/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.select({
      booking: bookings,
      technician: technicians
    })
    .from(bookings)
    .leftJoin(technicians, eq(bookings.technicianId, technicians.id))
    .where(eq(bookings.id, id))
    .limit(1);

    if (!result.length) return res.status(404).json({ error: "Not found" });
    
    const history = await db.select({
      id: bookingStatusHistory.id,
      oldStatus: bookingStatusHistory.oldStatus,
      newStatus: bookingStatusHistory.newStatus,
      note: bookingStatusHistory.note,
      changedAt: bookingStatusHistory.changedAt,
      changedBy: bookingStatusHistory.changedBy,
      adminName: users.name
    })
      .from(bookingStatusHistory)
      .leftJoin(users, eq(bookingStatusHistory.changedBy, users.id))
      .where(eq(bookingStatusHistory.bookingId, id))
      .orderBy(desc(bookingStatusHistory.changedAt));

    res.json({
      ...result[0].booking,
      technicianName: result[0].technician?.name,
      history
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

apiRouter.patch("/bookings/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    
    const old = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    if (!old.length) return res.status(404).json({ error: "Not found" });
    
    const admin = await db.select().from(users).limit(1);
    const adminId = admin.length > 0 ? admin[0].id : null;

    await db.update(bookings).set({ status }).where(eq(bookings.id, id));
    
    await db.insert(bookingStatusHistory).values({
      id: crypto.randomUUID(),
      bookingId: id,
      oldStatus: old[0].status,
      newStatus: status,
      note: note || "Status updated manually",
      changedBy: adminId
    });
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

apiRouter.patch("/bookings/:id/technician", async (req, res) => {
  try {
    const { id } = req.params;
    const { technicianId } = req.body;
    await db.update(bookings).set({ technicianId }).where(eq(bookings.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

apiRouter.post("/bookings", async (req, res) => {
  try {
    const data = req.body;
    const bookingCode = "BKM-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    
    const newBooking = {
      id: crypto.randomUUID(),
      bookingCode,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      bookingDate: data.bookingDate,
      bookingTime: data.bookingTime,
      carType: data.carType,
      carYear: data.carYear,
      plateNumber: data.plateNumber,
      problemDescription: data.problemDescription,
      serviceType: data.serviceType,
      customerNote: data.customerNote || null,
      adminNote: data.adminNote || null,
      technicianId: data.technicianId || null,
      status: data.status || "Baru",
      source: data.source || "WhatsApp",
    };
    
    await db.insert(bookings).values(newBooking);
    
    await db.insert(bookingStatusHistory).values({
      id: crypto.randomUUID(),
      bookingId: newBooking.id,
      newStatus: newBooking.status,
      note: "Booking created manually"
    });

    res.json({ success: true, id: newBooking.id });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

apiRouter.get("/reports", async (req, res) => {
  try {
    const { start, end, status } = req.query;
    let conditions = [];
    
    if (start) conditions.push(gte(bookings.bookingDate, start as string));
    if (end) conditions.push(lte(bookings.bookingDate, end as string));
    if (status) conditions.push(eq(bookings.status, status as string));
    
    const query = db.select()
      .from(bookings)
      .orderBy(asc(bookings.bookingDate), asc(bookings.bookingTime));

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }
    
    const results = await query;
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Admin Masters
apiRouter.get("/services", async (req, res) => {
  const data = await db.select().from(services);
  res.json(data);
});

apiRouter.post("/services", async (req, res) => {
  const { name, estimatedDuration, estimatedPrice } = req.body;
  const id = crypto.randomUUID();
  await db.insert(services).values({ id, name, estimatedDuration, estimatedPrice });
  res.json({ id });
});

apiRouter.get("/technicians", async (req, res) => {
  const data = await db.select().from(technicians);
  res.json(data);
});

apiRouter.post("/technicians", async (req, res) => {
  const { name, phone, specialty } = req.body;
  const id = crypto.randomUUID();
  await db.insert(technicians).values({ id, name, phone, specialty });
  res.json({ id });
});

apiRouter.get("/settings", async (req, res) => {
  const data = await db.select().from(workshopSettings).limit(1);
  res.json(data[0] || null);
});

apiRouter.put("/settings", async (req, res) => {
  const data = req.body;
  const existing = await db.select().from(workshopSettings).limit(1);
  if (existing.length > 0) {
    await db.update(workshopSettings).set(data).where(eq(workshopSettings.id, existing[0].id));
  } else {
    data.id = crypto.randomUUID();
    await db.insert(workshopSettings).values(data);
  }
  res.json({ success: true });
});
