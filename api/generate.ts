// api/generate.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const MAX_PROMPT_LENGTH = 500;
const RequestSchema = z.object({
  prompt: z.string().trim().min(1, 'Prompt cannot be empty.').max(MAX_PROMPT_LENGTH, `Prompt cannot be longer than ${MAX_PROMPT_LENGTH} characters.`),
});

// Naive in-memory rate limiting (suitable for single-region Vercel functions)
const buckets = new Map<string, { tokens: number; ts: number }>();
function isRateLimited(ip: string, rate = 10, perMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(ip) ?? { tokens: rate, ts: now };
  
  const refill = Math.floor(((now - bucket.ts) / perMs) * rate);
  bucket.tokens = Math.min(rate, bucket.tokens + refill);
  bucket.ts = now;

  if (bucket.tokens <= 0) {
    buckets.set(ip, bucket);
    return true;
  }
  
  bucket.tokens -= 1;
  buckets.set(ip, bucket);
  return false;
}


export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set common security and CORS headers
  // This should ideally be your frontend's production URL
  res.setHeader('Access-Control-Allow-Origin', '*'); // For development; lock this down in production
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Rate limiting
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? 'unknown';
  if (isRateLimited(ip)) {
      return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    const validationResult = RequestSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid request body', details: validationResult.error.flatten() });
    }

    const { prompt: originalText } = validationResult.data;

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error('API_KEY is not configured on the server.');
      return res.status(500).json({ error: 'Server key not configured' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Vylepši a profesionálně přeformuluj následující text inzerátu. Zachovej původní smysl, ale udělej ho atraktivnější a stručnější. Odpověz pouze vylepšeným textem, bez jakéhokoliv dalšího komentáře. Původní text: "${originalText}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const generatedText = response.text;

    return res.status(200).json({ text: generatedText });

  } catch (e: any) {
    console.error('Error in /api/generate:', e);
    return res.status(500).json({ error: e?.message ?? 'An unknown server error occurred' });
  }
}
