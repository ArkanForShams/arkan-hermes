import Link from 'next/link';

const nav = [
  ['Overview', '/', '⌂'],
  ['My Garage', '/garage/', '◈'],
  ['Book service', '/book/', '+'],
  ['My bookings', '/bookings/', '◷'],
  ['Invoices', '/invoices/', '▤'],
  ['Rewards', '/rewards/', '✦'],
];

export function PortalShell({ children, active = 'Overview' }: { children: React.ReactNode; active?: string }) {
  return <main className="app-shell">
    <aside className="sidebar">
      <Link className="brand" href="/" aria-label="Quick Lead customer portal home"><img className="quicklead-logo" src="/quicklead-logo.jpg" alt="Quick Lead" /></Link>
      <div className="profile-mini"><div className="avatar">ST</div><div><strong>Shams Tabrez</strong><span>Personal account</span></div></div>
      <nav className="nav" aria-label="Primary navigation">{nav.map(([label, href, icon]) => <Link key={label} className={active === label ? 'nav-item active' : 'nav-item'} href={href}><span className="icon" aria-hidden="true">{icon}</span>{label}</Link>)}</nav>
      <div className="sidebar-bottom"><Link className={active === 'Support' ? 'nav-item active' : 'nav-item'} href="/support/"><span className="icon">?</span>Support</Link><Link className={active === 'Settings' ? 'nav-item active' : 'nav-item'} href="/settings/"><span className="icon">⚙</span>Settings</Link><div className="language"><span>EN</span><span className="muted">العربية</span></div><a className="legal-link" href="https://quicklead.sa/privacy-policy/" target="_blank" rel="noreferrer">Privacy policy ↗</a></div>
    </aside>
    <section className="content">
      <header className="topbar"><Link className="mobile-brand" href="/" aria-label="Quick Lead customer portal home"><img className="quicklead-logo" src="/quicklead-logo.jpg" alt="Quick Lead" /></Link><div className="crumb">Customer portal <span>/</span> {active}</div><div className="top-actions"><button className="bell" aria-label="Notifications">♢<b>3</b></button><div className="avatar small">ST</div></div></header>
      <div className="page-wrap">{children}</div>
    </section>
  </main>;
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}

export function SectionHeading({ eyebrow, title, href, link = 'View all' }: { eyebrow: string; title: string; href?: string; link?: string }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{href && <Link className="text-btn" href={href}>{link} <span>→</span></Link>}</div>;
}
