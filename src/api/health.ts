// All API calls use relative URLs (/api/...).
// The Vite proxy (local) and the Vercel rewrite (live) forward them to the API.
export async function getHealth(): Promise<{ status: string }> {
  const res = await fetch("/api/health");

  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }

  return res.json();
}
