import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Project Water — Ayaan Ahmed', description: 'An independent solar-powered water pumping concept. Designed in Fusion 360, communicated through Python, and unanimously approved by SolarPak’s council.', robots: { index: true, follow: true } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
