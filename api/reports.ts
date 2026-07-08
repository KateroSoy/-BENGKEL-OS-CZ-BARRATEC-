import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from './_utils';
import { getBookings } from './_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  let results = getBookings();
  const { start, end, status } = req.query;

  if (start) results = results.filter(b => b.bookingDate >= (start as string));
  if (end) results = results.filter(b => b.bookingDate <= (end as string));
  if (status) results = results.filter(b => b.status === status);

  results.sort((a, b) => a.bookingDate.localeCompare(b.bookingDate) || a.bookingTime.localeCompare(b.bookingTime));
  res.json(results);
}
