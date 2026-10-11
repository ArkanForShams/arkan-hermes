import './globals.css';

export const metadata = { title: 'Quicklead · Customer Portal', description: 'Your vehicle, looked after.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
