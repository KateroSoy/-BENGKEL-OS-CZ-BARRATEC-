import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils';
import { getBookings } from '../_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    let results = getBookings();
    const { date, status, search, serviceType, technicianId } = req.query;

    if (date) results = results.filter(b => b.bookingDate === date);
    if (status) results = results.filter(b => b.status === status);
    if (serviceType) results = results.filter(b => b.serviceType === serviceType);
    if (technicianId) results = results.filter(b => b.technicianId === technicianId);
    if (search) {
      const s = (search as string).toLowerCase();
      results = results.filter(b =>
        b.customerName.toLowerCase().includes(s) ||
        b.customerPhone.includes(s) ||
        (b.plateNumber && b.plateNumber.toLowerCase().includes(s))
      );
    }

    return res.json(results);
  }

  if (req.method === 'POST') {
    // Accept the booking but just return success (mock)
    const data = req.body;
    const id = `mock-${Date.now()}`;
    return res.json({ success: true, id });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
