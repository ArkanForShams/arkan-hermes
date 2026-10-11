import Link from 'next/link';
import { bookings } from '../../../lib/api/mock';
import { BookingDetailV2 } from '../../../components/BookingDetailV2';
import { PortalShell } from '../../../components/PortalShell';

export function generateStaticParams() { return [...bookings.map(booking => ({ id: booking.id })), { id: 'BK-DEMO-001' }]; }

export default function BookingDetailPage({ params }: { params: { id: string } }) { const booking = bookings.find(item => item.id === params.id) || bookings[0]; return <PortalShell active="My bookings"><Link className="back-link" href="/bookings/">← Back to my bookings</Link><BookingDetailV2 initialBooking={booking} /></PortalShell>; }
