import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const bookingCode = "BK-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  res.json({ success: true, bookingCode });
}
