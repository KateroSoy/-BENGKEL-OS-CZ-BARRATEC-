import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from './_utils';
import { getSlotInfo } from './_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const date = req.query.date as string;
  if (!date) return res.status(400).json({ error: "Date is required" });

  res.json(getSlotInfo(date));
}
