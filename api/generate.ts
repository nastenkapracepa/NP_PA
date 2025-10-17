// api/generate.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const RequestSchema = z.object({
  text: z.string().trim().min(1, 'Text cannot be empty.').max(500, 'Text cannot be longer than 500 characters.'),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const validationResult = RequestSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid request body', details: validationResult.error.format() });
    }

    const { text } = validationResult.data;

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing server API key' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Vylepši a profesionálně přeformuluj následující text inzerátu. Zachovej původní smysl, ale udělej ho atraktivnější a stručnější. Odpověz pouze vylepšeným textem, bez jakéhokoliv dalšího komentáře. Původní text: "${text}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const generatedText = response.text;

    return res.status(200).json({ text: generatedText });

  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message ?? 'An unknown server error occurred' });
  }
}
