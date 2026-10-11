export type ServiceStatus = 'confirmed' | 'checked-in' | 'in-service' | 'approval' | 'final-check' | 'ready' | 'completed';

export type Vehicle = { id: string; name: string; plate: string; year: number; mileage: number; nextService: string; status: string; image: string };
export type TimelineItem = { label: string; detail: string; status: 'done' | 'current' | 'upcoming'; time?: string };
export type ActiveService = { id: string; vehicle: Vehicle; branch: string; service: string; status: ServiceStatus; eta: string; estimate: number; timeline: TimelineItem[] };
export type Invoice = { id: string; date: string; vehicle: string; service: string; amount: number; status: 'Paid' | 'Due' };
export type Offer = { id: string; title: string; detail: string; discount: string; validUntil: string };
export type AddOnService = { id: string; title: string; detail: string; price: number; recommended?: boolean };
export type BookingStatus = 'Confirmed' | 'Completed' | 'Cancelled' | 'Reschedule requested';
export type BookingComment = { id: string; author: string; role: 'Customer' | 'Quicklead advisor'; message: string; timestamp: string };
export type BookingLog = { id: string; event: string; detail: string; timestamp: string };
export type Booking = { id: string; vehicle: Vehicle; service: string; branch: string; date: string; time: string; status: BookingStatus; estimate: number; offer?: Offer; addOns: AddOnService[]; invoices: Invoice[]; comments: BookingComment[]; log: BookingLog[] };
export type DashboardData = { customerName: string; activeService: ActiveService; vehicles: Vehicle[]; invoices: Invoice[]; rewards: { points: number; tier: string; nextTier: number }; notifications: number };
export type BookingRequest = { vehicleId: string; serviceId: string; branchId: string; slot: string; offerId?: string; addOnIds?: string[] };
export type BookingResult = { id: string; status: 'confirmed' | 'pending'; message: string };
