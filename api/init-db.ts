import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from './_utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  res.json({ success: true, message: 'Using mock data — no database initialization needed' });
}
