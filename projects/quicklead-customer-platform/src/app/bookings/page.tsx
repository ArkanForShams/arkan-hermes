import Link from 'next/link';
import { bookings } from '../../lib/api/mock';
import { BookingEngine } from '../../components/BookingEngine';
import { PortalShell, PageHeader } from '../../components/PortalShell';

export default function BookingsPage() { return <PortalShell active="My bookings"><PageHeader eyebrow="BOOKING CONTROL CENTRE" title="My bookings" description="Search, inspect and manage every Quicklead booking from one place." action={<Link className="primary" href="/book/">+ New booking</Link>} /><BookingEngine initialBookings={bookings} /></PortalShell>; }
