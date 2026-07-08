import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;
  if (email === "admin@bengkel.com" && password === "admin123") {
    res.setHeader('Set-Cookie', `admin_session=true; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`);
    return res.json({ success: true });
  }
  return res.status(401).json({ error: "Invalid credentials" });
}
