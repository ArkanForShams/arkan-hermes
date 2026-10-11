import type { BookingRequest, BookingResult, DashboardData } from './types';

const baseUrl = (process.env.NEXT_PUBLIC_QUICKLEAD_API_BASE_URL || '').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const correlationId = globalThis.crypto?.randomUUID?.() || `ql-${Date.now()}`;
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-Correlation-Id': correlationId, ...(init?.headers || {}) },
  });
  if (!response.ok) throw new Error(`Quicklead API request failed (${response.status})`);
  return response.json() as Promise<T>;
}

export const httpApi = {
  getDashboard: () => request<DashboardData>('/v1/customer/dashboard'),
  createBooking: (input: BookingRequest) => request<BookingResult>('/v1/customer/bookings', { method: 'POST', headers: { 'Idempotency-Key': globalThis.crypto?.randomUUID?.() || `booking-${Date.now()}` }, body: JSON.stringify(input) }),
};
