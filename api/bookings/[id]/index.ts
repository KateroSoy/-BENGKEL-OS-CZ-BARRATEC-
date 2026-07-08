import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../../_utils';
import { getBookingById } from '../../_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'ID required' });

  const booking = getBookingById(id);
  if (!booking) return res.status(404).json({ error: 'Not found' });

  res.json(booking);
}
