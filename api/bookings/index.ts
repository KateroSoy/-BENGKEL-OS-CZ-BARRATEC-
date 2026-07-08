import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils';
import { db } from '../../src/db';
import { bookings, technicians, bookingStatusHistory } from '../../src/db/schema';
import { eq, and, or, desc, sql } from 'drizzle-orm';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    try {
      const { date, status, search, serviceType, technicianId } = req.query;
      let conditions: any[] = [];
      if (date) conditions.push(eq(bookings.bookingDate, date as string));
      if (status) conditions.push(eq(bookings.status, status as string));
      if (serviceType) conditions.push(eq(bookings.serviceType, serviceType as string));
      if (technicianId) conditions.push(eq(bookings.technicianId, technicianId as string));

      if (search) {
        const searchTerm = `%${search as string}%`;
        conditions.push(
          or(
            sql`customer_name ILIKE ${searchTerm}`,
            sql`customer_phone ILIKE ${searchTerm}`,
            sql`plate_number ILIKE ${searchTerm}`
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
  } else if (req.method === 'POST') {
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
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
