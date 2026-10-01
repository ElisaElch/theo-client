// Shared wrapper for every request to theo-api.
// Usage: apiFetch<ReturnType>("/auth/login", { method: "POST", body: ... })
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  // File uploads (FormData) must NOT get a JSON Content-Type header:
  // the browser sets the right one itself, including the file "boundary"
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  // Some responses (like 204 No Content) have no JSON body, so don't crash
  const data = await res.json().catch(() => null);

  // Turn the API's { error: "..." } into a normal JavaScript error,
  // so pages can show err.message to the user
  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed (${res.status})`);
  }

  return data as T;
}
