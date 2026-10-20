import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

type GuidedPageProps = {
  children: ReactNode;
  tone?: 'light' | 'dark';
  next: { href: string; label: string };
  back?: string;
  className?: string;
};

/** A short, keyboard-accessible chapter with one clear next step. */
export default function GuidedPage({ children, tone = 'light', next, back, className = '' }: GuidedPageProps) {
  return <div className={`guided-page guided-page-${tone} ${className}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="guided-header page-width">
      <Link className="guided-author" href="/">Ayaan Ahmed</Link>
      <Link className="guided-shortcut" href="/project">Full project <ArrowUpRight size={14} aria-hidden="true"/></Link>
    </header>
    <main className="guided-main page-width" id="main">{children}</main>
    <footer className="guided-footer page-width">
      {back ? <Link className="guided-back" href={back}><ArrowLeft size={15} aria-hidden="true"/>Back</Link> : <span className="guided-reading-time">A short, 2–3 minute story.</span>}
      <Link className="guided-next" href={next.href}>{next.label}<ArrowRight size={17} aria-hidden="true"/></Link>
    </footer>
  </div>;
}
