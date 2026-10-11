import type { Booking } from './api/types';

export const BOOKING_STORAGE_KEY = 'quicklead-demo-bookings-v1';

export function readStoredBookings(fallback: Booking[]): Booking[] {
  if (typeof window === 'undefined') return fallback;
  try { const raw = window.localStorage.getItem(BOOKING_STORAGE_KEY); return raw ? JSON.parse(raw) as Booking[] : fallback; } catch { return fallback; }
}

export function writeStoredBookings(bookings: Booking[]) {
  if (typeof window !== 'undefined') window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
}

export function upsertStoredBooking(booking: Booking, fallback: Booking[]) {
  const current = readStoredBookings(fallback); const next = current.some(item => item.id === booking.id) ? current.map(item => item.id === booking.id ? booking : item) : [booking, ...current]; writeStoredBookings(next); return next;
}

export function removeStoredBooking(id: string, fallback: Booking[]) { const next = readStoredBookings(fallback).filter(item => item.id !== id); writeStoredBookings(next); return next; }
