import { useAuth } from "@clerk/react";

export function useApi() {
  const { getToken } = useAuth();

  return async <T>(path: string, options: RequestInit = {}): Promise<T> => {
    const token = await getToken(); // fresh token for every request
    const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
    return data as T;
  };
}