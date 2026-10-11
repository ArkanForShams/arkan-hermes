import type { BookingRequest, BookingResult, DashboardData } from './types';
import { mockApi } from './mock';
import { httpApi } from './http';

export interface QuickleadApi {
  getDashboard(): Promise<DashboardData>;
  createBooking(input: BookingRequest): Promise<BookingResult>;
}

export function getQuickleadApi(): QuickleadApi {
  // Configure NEXT_PUBLIC_QUICKLEAD_API_BASE_URL when the existing-system contract is supplied.
  // Empty base URL deliberately keeps the safe synthetic adapter active.
  return process.env.NEXT_PUBLIC_QUICKLEAD_API_BASE_URL ? httpApi : mockApi;
}
