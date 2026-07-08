import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils';
import { db } from '../../src/db';
import { bookings, bookingStatusHistory } from '../../src/db/schema';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
