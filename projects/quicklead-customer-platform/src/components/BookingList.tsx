'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Booking } from '../lib/api/types';

export function BookingList({ initialBookings }: { initialBookings: Booking[] }) {
  const [filter, setFilter] = useState<'All' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');
  const shown = filter === 'All' ? initialBookings : initialBookings.filter(b => b.status === filter);
  return <div><div className="booking-filters">{(['All', 'Confirmed', 'Completed', 'Cancelled'] as const).map(item => <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}<span>{item === 'All' ? initialBookings.length : initialBookings.filter(b => b.status === item).length}</span></button>)}</div><div className="booking-list">{shown.map(booking => <Link className="card booking-card" href={`/bookings/${booking.id}/`} key={booking.id}><div className="booking-date"><strong>{booking.date.split(' ')[0]}</strong><span>{booking.date.split(' ').slice(1).join(' ')}</span></div><div className="booking-card-main"><div className="split"><div><h2>{booking.service}</h2><p>{booking.vehicle.name} · {booking.vehicle.plate}</p></div><span className={`status-pill ${booking.status === 'Confirmed' ? 'orange' : booking.status === 'Completed' ? 'green' : 'muted-pill'}`}>{booking.status}</span></div><div className="booking-card-meta"><span>◷ {booking.time}</span><span>⌖ {booking.branch}</span><span>SAR {booking.estimate.toLocaleString()} estimate</span></div><div className="booking-card-footer"><span>{booking.comments.length} comments · {booking.log.length} activity entries</span><b>Open booking →</b></div></div></Link>)}{shown.length === 0 && <div className="card empty-state"><div>◷</div><h2>No {filter.toLowerCase()} bookings</h2><p>When you book a service, it will appear here.</p><Link className="primary" href="/book/">Book a service</Link></div>}</div></div>;
}
