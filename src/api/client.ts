// Shared wrapper for every request to theo-api.
// Usage: apiFetch<ReturnType>("/auth/login", { method: "POST", body: ... })
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Some responses might have no JSON body, so don't crash if parsing fails
  const data = await res.json().catch(() => null);

  // Turn the API's { error: "..." } into a normal JavaScript error,
  // so pages can show err.message to the user
  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed (${res.status})`);
  }

  return data as T;
}
