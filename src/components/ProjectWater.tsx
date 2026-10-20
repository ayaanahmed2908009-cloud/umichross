'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUp, ArrowUpRight, Menu, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CodeViewer, { useOriginalSource } from './CodeViewer';
import Simulation from './Simulation';
import { animationAssets } from '@/lib/animationAssets';

const links = [['The idea', '#story'], ['The system', '#simulation'], ['The outcome', '#outcome']];

export default function ProjectWater() {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [menu, setMenu] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [sourceStage, setSourceStage] = useState(0);
  const source = useOriginalSource();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero-copy > *', { y: 18, opacity: 0, duration: .85, stagger: .1, ease: 'power2.out' });
        gsap.from('.hero-model', { opacity: 0, duration: 1, delay: .2 });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const openSource = (stage = 0) => {
    setSourceStage(stage);
    setSourceOpen(true);
    dialog.current?.showModal();
  };

  return (
    <div ref={root}>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="navigation">
        <Link className="brand" href="/" aria-label="Project Water welcome">PROJECT WATER</Link>
        <nav id="main-navigation" aria-label="Main navigation" className={menu ? 'nav-links is-open' : 'nav-links'}>
          {links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}</a>)}
        </nav>
        <button className="menu-toggle icon-button" aria-controls="main-navigation" aria-expanded={menu} aria-label={menu ? 'Close navigation' : 'Open navigation'} onClick={() => setMenu(!menu)}>{menu ? <X size={21}/> : <Menu size={21}/>}</button>
      </header>

      <main id="main">
        <section className="hero page-width" id="overview">
          <div className="hero-copy">
            <p className="eyebrow">Ayaan Ahmed / SolarPak</p>
            <h1>PROJECT<br/>WATER.</h1>
            <p className="hero-deck">An independent idea.<br/>A shared commitment.</p>
            <p className="hero-description">Exploring solar-powered water access<br className="desktop-break"/> in rural Sindh, Pakistan.</p>
            <a className="text-link hero-link" href="#story">Discover the project <ArrowDown size={15}/></a>
          </div>
          <figure className="hero-model">
            <Image src={animationAssets.cad} alt="Ayaan Ahmed’s original Fusion 360 CAD concept: a solar array above an elevated tank, with piping, filtration and gravity-fed taps" width={1124} height={789} priority sizes="(max-width: 760px) 95vw, 55vw"/>
            <figcaption>Original design · Autodesk Fusion 360</figcaption>
          </figure>
        </section>

        <div className="story page-width" id="story">
          <section className="story-row" id="problem">
            <h2>One question.</h2>
            <div className="story-copy">
              <p>Through SolarPak, I had seen how decentralised solar energy could help homes with unreliable electricity. I wanted to explore what it could do for another challenge: access to water.</p>
              <p className="story-question">What if the same energy model could power water access?</p>
            </div>
          </section>
          <section className="story-row" id="design">
            <h2>Learning<br/>by making.</h2>
            <div className="story-copy">
              <p>I had never used CAD before. In two weeks, I taught myself Autodesk Fusion 360 and developed an original concept: solar panels, a pump, proposed filtration, elevated storage, and taps.</p>
              <details className="quiet-details">
                <summary>A closer look at the design</summary>
                <p>The proposed system uses solar power to lift water to storage, then gravity to feed the taps. A non-return valve is intended to prevent backflow; a float switch is intended to stop the pump when the tank is full.</p>
                <p>Panel sizing, storage capacity, filtration performance, and contractor specifications remain subject to technical verification.</p>
                <a className="text-link" href="/assets/pdf/project-water.pdf" target="_blank" rel="noreferrer">Original project artifact <ArrowUpRight size={14}/></a>
              </details>
            </div>
          </section>
          <section className="story-row code-story" id="code">
            <h2>Making the<br/>idea visible.</h2>
            <div className="story-copy">
              <p>To explain the system, I wrote a Python animation using Fusion 360’s API. It walked SolarPak’s six-member council through the concept, one stage at a time.</p>
              <button className="text-link" onClick={() => openSource()}>Explore the code <ArrowUpRight size={14}/></button>
            </div>
          </section>
        </div>

        <section id="simulation" aria-label="Interactive system walkthrough">
          <Simulation source={source} onSource={openSource}/>
        </section>

        <section className="outcome page-width" id="outcome">
          <div className="story-row outcome-intro">
            <h2>From concept<br/>to commitment.</h2>
            <div className="story-copy"><p>The council unanimously approved Project Water. What began as an independent exploration became a proposal the organisation believed was worth pursuing.</p></div>
          </div>
          <div className="stats">
            <div><strong>6 / 6</strong><span>Council approval</span></div>
            <div><strong><small>PKR</small> 400,000</strong><span>Approximately raised through SolarPak</span></div>
            <div><strong>200</strong><span>Intended residents · not yet served</span></div>
          </div>
          <p className="implementation-note">A target village has been identified. Implementation is tentatively planned for mid-November 2026, subject to technical verification and contractor arrangements.</p>
        </section>

        <section className="reflection page-width" id="reflection">
          <p className="eyebrow">What I learned</p>
          <blockquote>“What I am most proud of is not simply teaching myself CAD or developing an animation. It is taking something I initially explored independently and turning it into a proposal that six other people believed was worth pursuing.<br/><br/><span>I learned that designing a solution and earning the support needed to implement it are two different challenges.</span>”</blockquote>
          <p className="signature">Ayaan Ahmed</p>
        </section>
      </main>

      <footer className="footer page-width">
        <div><span>PROJECT WATER</span><p>Design. Communicate. Implement.</p></div>
        <a href="/assets/pdf/project-water.pdf" target="_blank" rel="noreferrer">Original artifact <ArrowUpRight size={14}/></a>
        <a className="icon-button" href="#overview" aria-label="Back to top"><ArrowUp size={19}/></a>
      </footer>

      <dialog aria-label="Explore original Python source" ref={dialog} className="source-dialog" onClose={() => setSourceOpen(false)} onClick={e => { if(e.target === dialog.current) dialog.current.close(); }}>
        {sourceOpen && <CodeViewer source={source} stage={sourceStage} full onClose={() => dialog.current?.close()}/>}
      </dialog>
    </div>
  );
}
