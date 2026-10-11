import type { AddOnService, Booking, DashboardData, Offer } from './types';

const vehicle = { id: 'v1', name: 'Toyota Land Cruiser', plate: 'Riyadh · أ ب ج 1234', year: 2023, mileage: 48210, nextService: 'In 1,790 km', status: 'Service in progress', image: 'LC' };

export const offers: Offer[] = [
  { id: 'OFFER-OIL', title: 'Service season offer', detail: 'Save on a complete periodic maintenance visit.', discount: '15% off', validUntil: '31 Oct 2026' },
  { id: 'OFFER-WASH', title: 'Care package', detail: 'Complimentary exterior wash with your booking.', discount: 'FREE WASH', validUntil: '15 Nov 2026' },
];

export const addOnServices: AddOnService[] = [
  { id: 'ADD-AC', title: 'Air conditioning check', detail: 'Cooling performance and cabin filter review', price: 120, recommended: true },
  { id: 'ADD-BRAKE', title: 'Brake health inspection', detail: 'Pads, discs and brake-fluid visual check', price: 85 },
  { id: 'ADD-ALIGN', title: 'Wheel alignment check', detail: 'Alignment measurement and adjustment report', price: 140 },
];

export const demoDashboard: DashboardData = {
  customerName: 'Shams',
  activeService: { id: 'ro-10482', vehicle, branch: 'Quicklead · Olaya', service: 'Periodic maintenance', status: 'in-service', eta: 'Ready today · 04:30 PM', estimate: 1280, timeline: [
    { label: 'Appointment confirmed', detail: 'Today, 09:15 AM', status: 'done', time: '09:15' },
    { label: 'Vehicle checked in', detail: 'Advisor received your vehicle', status: 'done', time: '09:42' },
    { label: 'Service in progress', detail: 'Technician is completing the service', status: 'current', time: 'Now' },
    { label: 'Final check', detail: 'Quality inspection before handover', status: 'upcoming' },
    { label: 'Vehicle ready', detail: 'We will notify you when it is ready', status: 'upcoming' },
  ] },
  vehicles: [vehicle, { id: 'v2', name: 'Tesla Model Y', plate: 'Riyadh · د هـ و 9087', year: 2024, mileage: 12980, nextService: 'In 6,400 km', status: 'Healthy', image: 'MY' }],
  invoices: [{ id: 'INV-24051', date: '18 Sep 2026', vehicle: 'Toyota Land Cruiser', service: 'Brake inspection', amount: 460, status: 'Paid' }, { id: 'INV-23992', date: '03 Aug 2026', vehicle: 'Tesla Model Y', service: 'Wheel alignment', amount: 310, status: 'Paid' }],
  rewards: { points: 2180, tier: 'Gold', nextTier: 3000 }, notifications: 3,
};

export const bookings: Booking[] = [
  { id: 'BK-10482', vehicle, service: 'Periodic maintenance', branch: 'Quicklead · Olaya', date: '08 Oct 2026', time: '09:15 AM', status: 'Confirmed', estimate: 1280, offer: offers[0], addOns: [addOnServices[0]], invoices: [demoDashboard.invoices[0]], comments: [{ id: 'c1', author: 'Shams', role: 'Customer', message: 'Please check the AC cooling as well.', timestamp: '08 Oct · 08:55 AM' }, { id: 'c2', author: 'Maha Al-Qahtani', role: 'Quicklead advisor', message: 'Noted. We will include the inspection in the advisor checklist.', timestamp: '08 Oct · 09:02 AM' }], log: [{ id: 'l1', event: 'Booking confirmed', detail: 'Slot reserved at Quicklead Olaya', timestamp: '08 Oct · 09:15 AM' }, { id: 'l2', event: 'Vehicle checked in', detail: 'Advisor received the vehicle', timestamp: '08 Oct · 09:42 AM' }, { id: 'l3', event: 'Customer comment added', detail: 'AC cooling inspection requested', timestamp: '08 Oct · 08:55 AM' }] },
  { id: 'BK-09912', vehicle: demoDashboard.vehicles[1], service: 'Wheel alignment', branch: 'Quicklead · North Riyadh', date: '03 Aug 2026', time: '02:30 PM', status: 'Completed', estimate: 310, addOns: [], invoices: [demoDashboard.invoices[1]], comments: [], log: [{ id: 'l4', event: 'Booking completed', detail: 'Invoice INV-23992 issued', timestamp: '03 Aug · 04:10 PM' }] },
];

export const mockApi = { getDashboard: async () => demoDashboard, getBookings: async () => bookings, createBooking: async () => ({ id: 'BK-DEMO-001', status: 'confirmed' as const, message: 'Demo booking confirmed. No external system was changed.' }) };
