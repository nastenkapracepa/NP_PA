// lib/api.ts

/**
 * Calls the backend proxy to get an improved text from the AI.
 * @param prompt The original text to improve.
 * @returns The improved text.
 */
export async function getAiEnhancedText(prompt: string): Promise<string> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error ?? 'Neznámá chyba při komunikaci se serverem.';
    throw new Error(errorMessage);
  }

  if (!data.text) {
      throw new Error('Odpověď od AI neobsahovala text.');
  }

  return data.text;
}
