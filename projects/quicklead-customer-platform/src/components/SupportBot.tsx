'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { bookings, demoDashboard } from '../lib/api/mock';
import type { Booking, Invoice } from '../lib/api/types';
import { readStoredBookings, removeStoredBooking, upsertStoredBooking } from '../lib/booking-store';

type ChatMessage = { id: string; role: 'bot' | 'customer'; text: string; invoices?: Invoice[]; booking?: Booking };
type PendingAction = { kind: 'book' | 'slot' | 'branch' | 'cancel'; bookingId?: string } | null;
type BrowserRecognition = { lang: string; interimResults: boolean; continuous: boolean; onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null; start: () => void; stop: () => void };

const branches = ['Quicklead · Olaya', 'Quicklead · North Riyadh', 'Quicklead · Khurais'];
const slots = [
  { date: '08 Oct 2026', time: '04:30 PM', label: 'Today · 04:30 PM' },
  { date: '09 Oct 2026', time: '10:00 AM', label: 'Tomorrow · 10:00 AM' },
  { date: '09 Oct 2026', time: '02:30 PM', label: 'Tomorrow · 02:30 PM' },
];

function allInvoices(currentBookings: Booking[]) {
  const map = new Map<string, Invoice>();
  [...demoDashboard.invoices, ...currentBookings.flatMap(booking => booking.invoices)].forEach(invoice => map.set(invoice.id, invoice));
  return [...map.values()];
}

function findBooking(query: string, currentBookings: Booking[]) {
  const normalized = query.toLowerCase();
  const reference = normalized.match(/bk-\d+/)?.[0];
  if (reference) return currentBookings.find(booking => booking.id.toLowerCase() === reference);
  return currentBookings.find(booking => [booking.vehicle.name, booking.vehicle.plate, booking.service, booking.branch].some(value => normalized.includes(value.toLowerCase())));
}

export function SupportBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'welcome', role: 'bot', text: 'Assalamu alaikum Shams. I can help with bookings and invoices. You can ask for a booking reference, the latest invoice, available slots, a branch change, a new booking, rescheduling, or cancellation.' }]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState<PendingAction>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');
  const currentBookings = useMemo(() => readStoredBookings(bookings), [messages]);
  const invoiceList = useMemo(() => allInvoices(currentBookings), [currentBookings]);

  useEffect(() => {
    if (!voiceEnabled) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'bot' || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(last.text);
    utterance.lang = 'en-US'; utterance.rate = 0.96; utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, [messages, voiceEnabled]);

  const startListening = () => {
    const speechWindow = window as Window & { SpeechRecognition?: new () => BrowserRecognition; webkitSpeechRecognition?: new () => BrowserRecognition };
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) { setVoiceNotice('Voice input is not supported in this browser. Use Chrome or connect server-side speech-to-text.'); return; }
    const recognition = new Recognition(); recognition.lang = 'en-US'; recognition.interimResults = false; recognition.continuous = false;
    recognition.onresult = event => { const transcript = event.results[0]?.[0]?.transcript || ''; setListening(false); if (transcript) process(transcript); };
    recognition.onerror = event => { setListening(false); setVoiceNotice(`Voice input error: ${event.error}. Check microphone permission.`); };
    recognition.onend = () => setListening(false);
    setVoiceEnabled(true); setVoiceNotice('Listening… speak your booking or invoice question.'); setListening(true); recognition.start();
  };

  const stopVoice = () => { if (typeof window !== 'undefined') window.speechSynthesis?.cancel(); setVoiceEnabled(false); setListening(false); setVoiceNotice('Voice replies are off.'); };

  const reply = (text: string, extra: Partial<ChatMessage> = {}) => setMessages(current => [...current, { id: `${Date.now()}-${current.length}`, role: 'bot', text, ...extra }]);
  const customer = (text: string) => setMessages(current => [...current, { id: `${Date.now()}-customer`, role: 'customer', text }]);

  const askSlots = (kind: 'book' | 'slot', bookingId?: string) => { setPending({ kind, bookingId }); reply(kind === 'book' ? 'Choose an available slot and I will create the demo booking for you.' : 'Choose a new slot. I will record the reschedule request against your booking.'); };

  const performAction = (action: PendingAction, value: { date?: string; time?: string; branch?: string }) => {
    if (!action) return;
    const current = readStoredBookings(bookings);
    if (action.kind === 'book') {
      const booking: Booking = { id: 'BK-DEMO-001', vehicle: demoDashboard.vehicles[0], service: 'Periodic maintenance', branch: value.branch || 'Quicklead · Olaya', date: value.date || slots[0].date, time: value.time || slots[0].time, status: 'Confirmed', estimate: 1280, addOns: [], invoices: [], comments: [], log: [{ id: `l-${Date.now()}`, event: 'Booking created by support bot', detail: 'Customer selected a slot through Support centre', timestamp: 'Just now' }] };
      upsertStoredBooking(booking, current); setPending(null); reply(`Booking ${booking.id} is confirmed in demo mode for ${booking.date} at ${booking.time}.`, { booking }); return;
    }
    const target = current.find(item => item.id === action.bookingId) || current[0];
    if (!target) { setPending(null); reply('I could not find a booking to update. Please provide the booking reference.'); return; }
    const next: Booking = action.kind === 'cancel' ? { ...target, status: 'Cancelled', log: [...target.log, { id: `l-${Date.now()}`, event: 'Booking cancelled by support bot', detail: 'Customer confirmed cancellation', timestamp: 'Just now' }] } : { ...target, ...(value.date && { date: value.date }), ...(value.time && { time: value.time }), ...(value.branch && { branch: value.branch }), status: action.kind === 'slot' ? 'Reschedule requested' : target.status, log: [...target.log, { id: `l-${Date.now()}`, event: action.kind === 'branch' ? 'Branch changed by support bot' : 'Booking updated by support bot', detail: 'Customer confirmed the support-bot action', timestamp: 'Just now' }] };
    upsertStoredBooking(next, current); setPending(null); reply(action.kind === 'cancel' ? `${target.id} has been cancelled in demo mode.` : `${target.id} has been updated. ${next.branch} · ${next.date} · ${next.time}.`, { booking: next });
  };

  const process = (raw: string) => {
    const text = raw.trim(); if (!text) return; customer(text); setInput('');
    const lower = text.toLowerCase(); const current = readStoredBookings(bookings); const found = findBooking(text, current); const invoiceId = invoiceList.find(invoice => lower.includes(invoice.id.toLowerCase()));
    if (pending?.kind === 'cancel' && found) { performAction(pending, {}); return; }
    if (lower.includes('invoice') || lower.includes('vat') || invoiceId) {
      const latestOnly = lower.includes('latest') || lower.includes('most recent') || lower.includes('newest');
      const selected = invoiceId ? [invoiceId] : latestOnly ? invoiceList.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 1) : invoiceList.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      reply(`You have ${invoiceList.length} invoice(s). ${invoiceId ? `I found ${invoiceId}.` : latestOnly ? `The latest invoice is ${selected[0]?.id || 'not available'}.` : 'Here are your invoices, newest first.'}`, { invoices: selected }); return;
    }
    if (lower.includes('show') || lower.includes('status') || lower.includes('where') || lower.includes('booking reference')) {
      if (found) { reply(`${found.id} is ${found.status.toLowerCase()} at ${found.branch} on ${found.date} at ${found.time}.`, { booking: found }); return; }
    }
    if (lower.includes('cancel')) { const target = found || current.find(item => item.status === 'Confirmed'); if (!target) { reply('Please send the booking reference you want to cancel.'); return; } setPending({ kind: 'cancel', bookingId: target.id }); reply(`I found ${target.id} at ${target.branch} on ${target.date}. Please confirm cancellation.`, { booking: target }); return; }
    if (lower.includes('branch') || lower.includes('station')) { const target = found || current.find(item => item.status === 'Confirmed'); if (!target) { reply('Please send the booking reference before changing the station.'); return; } setPending({ kind: 'branch', bookingId: target.id }); reply(`Which Quicklead station should receive ${target.id}?`); return; }
    if (lower.includes('slot') || lower.includes('reschedule') || lower.includes('postpone') || lower.includes('prepone') || lower.includes('earlier') || lower.includes('later')) { const target = found || current.find(item => item.status === 'Confirmed'); if (!target) { askSlots('book'); return; } askSlots('slot', target.id); return; }
    if (lower.includes('book a service') || lower.includes('new booking') || lower.includes('need an appointment') || lower.includes('make a booking') || lower === 'book' || lower.startsWith('book service')) { askSlots('book'); return; }
    if (found) { reply(`${found.id} is ${found.status.toLowerCase()} at ${found.branch} on ${found.date} at ${found.time}. What would you like to change?`, { booking: found }); return; }
    reply('I can help with invoices, booking references, available slots, new bookings, station changes, rescheduling and cancellations. What would you like to do?');
  };

  return <div className="support-bot card"><div className="support-bot-head"><div><span className="eyebrow">QUICKLEAD SUPPORT SYSTEM</span><h2>Ask by text or voice</h2><p>Get answers about bookings, invoices, stations, slots and service execution.</p></div><div className="voice-controls"><span className="bot-online">● Online</span><button className={listening ? 'voice-button listening' : 'voice-button'} onClick={listening ? stopVoice : startListening} aria-label={listening ? 'Stop voice input' : 'Start voice input'}>{listening ? '■ Stop listening' : '🎙 Speak'}</button>{voiceEnabled && !listening && <button className="voice-stop" onClick={stopVoice}>Mute voice replies</button>}</div></div>{voiceNotice && <div className="voice-notice">{voiceNotice}</div>}<div className="support-chat" aria-live="polite">{messages.map(message => <div className={message.role === 'bot' ? 'chat-row bot-row' : 'chat-row customer-row'} key={message.id}><div className="chat-avatar">{message.role === 'bot' ? 'Q' : 'ST'}</div><div className="chat-bubble"><p>{message.text}</p>{message.invoices && <div className="bot-invoice-list">{message.invoices.map(invoice => <Link href={`/invoices/${invoice.id}/`} key={invoice.id}><span>▤</span><strong>{invoice.id}</strong><small>{invoice.date} · {invoice.service}</small><b>SAR {invoice.amount}</b></Link>)}</div>}{message.booking && <Link className="bot-booking-card" href={`/bookings/${message.booking.id}/`}><strong>{message.booking.id}</strong><span>{message.booking.service}</span><small>{message.booking.branch} · {message.booking.date} · {message.booking.time}</small><b>Open booking →</b></Link>}</div></div>)}</div>{pending?.kind === 'cancel' && <div className="bot-actions"><p>Confirm cancellation?</p><button className="danger-action" onClick={() => performAction(pending, {})}>Yes, cancel booking</button><button className="secondary" onClick={() => { setPending(null); reply('Cancellation stopped.'); }}>Keep booking</button></div>}{pending?.kind === 'branch' && <div className="bot-actions"><p>Select a station:</p>{branches.map(branch => <button className="secondary" key={branch} onClick={() => performAction(pending, { branch })}>{branch}</button>)}</div>}{(pending?.kind === 'book' || pending?.kind === 'slot') && <div className="bot-actions"><p>Select a slot:</p>{slots.map(slot => <button className="secondary" key={slot.label} onClick={() => performAction(pending, slot)}>{slot.label}</button>)}</div>}<div className="bot-suggestions"><button onClick={() => process('Show my latest invoice')}>Latest invoice</button><button onClick={() => process('Show booking BK-10482')}>Booking status</button><button onClick={() => process('Book a service')}>Book a service</button><button onClick={() => process('Change my station')}>Change station</button></div><form className="bot-compose" onSubmit={event => { event.preventDefault(); process(input); }}><input value={input} onChange={event => setInput(event.target.value)} placeholder="Ask: latest invoice, BK-10482, change station..." aria-label="Support bot question" /><button className="primary" type="submit">Send</button></form></div>;
}
