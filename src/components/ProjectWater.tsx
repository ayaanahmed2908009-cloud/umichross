'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUp, ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import CodeViewer, { useOriginalSource } from './CodeViewer';
import StoryChapter from './StoryChapter';
import Simulation from './Simulation';
import OriginGallery from './OriginGallery';
import { originPhotographs } from '@/data/originPhotographs';
import { animationAssets } from '@/lib/animationAssets';

export default function ProjectWater() {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [sourceStage, setSourceStage] = useState(0);
  const source = useOriginalSource();

  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.welcome-copy > *', { y: 16, opacity: 0, duration: .7, stagger: .08, ease: 'power2.out' });
      });
    }, root);
    return () => { mm.revert(); ctx.revert(); };
  }, []);

  const openSource = (stage = 0) => {
    setSourceStage(stage); setSourceOpen(true); dialog.current?.showModal();
  };

  return <div ref={root} className="scrolling-story">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="story-navigation">
      <div className="page-width">
        <a className="story-author" href="#welcome">Ayaan Ahmed</a>
        <nav aria-label="Story navigation"><a href="#origin">Story</a><a href="#design">Design</a><a href="#outcome">Outcome</a></nav>
      </div>
    </header>
    <main id="main">
      <StoryChapter id="welcome" className="welcome-section">
        <div className="chapter-copy welcome-copy">
          <p className="chapter-eyebrow">University of Michigan Ross · Admissions artifact</p>
          <h1 id="welcome-title">Hi, Admissions Officer.<br/>Here is my artifact.</h1>
          <p className="chapter-lead">I’m Ayaan Ahmed. This is Project Water.</p>
          <p className="chapter-description">I taught myself 3D design, animated a proposed solar-powered pumping and filtration system, and earned unanimous approval from SolarPak’s six-member council.</p>
          <a className="scroll-cue" href="#introduction">Scroll to begin <ArrowDown size={20} aria-hidden="true"/></a>
        </div>
      </StoryChapter>

      <StoryChapter id="introduction" dark className="introduction-section">
        <div className="chapter-copy">
          <p className="chapter-eyebrow">An independent idea. A shared commitment.</p>
          <h2 id="introduction-title">PROJECT<br/>WATER.</h2>
          <p className="chapter-lead">Could solar energy help a rural community access filtered water more reliably?</p>
          <p className="chapter-description">Through SolarPak, I developed an original system to pump, filter and store water before it reaches community taps. I made an animation to explain the idea to a six-member council. All six approved the proposal.</p>
          <p className="chapter-status">An approved concept. Implementation is still planned.</p>
        </div>
      </StoryChapter>

      <StoryChapter id="origin" className="origin-section">
        <div className={originPhotographs.length === 3 ? 'origin-layout' : undefined}>
          <div className="chapter-copy">
            <p className="chapter-eyebrow">The origin story</p>
            <h2 id="origin-title">It started with<br/>a question.</h2>
            <div className="chapter-prose">
              <p>Through my work with SolarPak, I saw how solar energy could help homes facing unreliable electricity. Access to water was another challenge in the communities we served.</p>
              <p className="chapter-question">What if the same energy could help bring filtered water to a community?</p>
              <p>I began exploring a system that could use solar energy to pump water through a filter into a raised tank, then use gravity to carry it to taps.</p>
            </div>
          </div>
          <OriginGallery photographs={originPhotographs}/>
        </div>
      </StoryChapter>

      <StoryChapter id="design" className="design-section">
        <div className="chapter-design-layout">
          <div className="chapter-copy">
            <p className="chapter-eyebrow">The design</p>
            <h2 id="design-title">I learned<br/>by making.</h2>
            <p className="chapter-lead">The idea is simple: use sunlight to pump and filter water, store it in a raised tank, then let gravity carry it to taps.</p>
            <div className="chapter-prose">
              <p>I had never designed in 3D before.</p>
              <p>Over two weeks, I taught myself Autodesk Fusion 360, a tool for designing objects in 3D, and developed my original water-system concept.</p>
            </div>
          </div>
          <figure className="chapter-design-image">
            <Image src={animationAssets.cad} alt="My original 3D concept: solar panels, a pump, an internal water filter, a raised tank and pipes leading to taps" width={1124} height={789} sizes="(max-width: 899px) 95vw, 50vw"/>
            <figcaption>My original 3D design · includes an internal water filter</figcaption>
          </figure>
        </div>
      </StoryChapter>

      <section className="communication-section page-width" id="code" aria-labelledby="communication-title">
        <p className="chapter-eyebrow">The decision</p>
        <h2 id="communication-title">Choosing where<br/>to invest.</h2>
        <div className="chapter-prose">
          <p>I had to decide whether to continue funding installations as usual or invest in a different way to use solar energy to help more people.</p>
          <p>I chose to explore Project Water: a proposed system that brings pumping and filtration together. I made an animation to help SolarPak’s council understand the idea and decide whether to support it.</p>
        </div>
      </section>

      <section id="simulation" aria-label="The idea in four simple steps"><Simulation onSource={openSource}/></section>

      <section className="outcome page-width" id="outcome" aria-labelledby="outcome-title">
        <p className="chapter-eyebrow">Earning support</p>
        <div className="outcome-intro">
          <h2 id="outcome-title">From concept<br/>to commitment.</h2>
          <p>The council unanimously approved Project Water’s proposed solar-powered pumping and filtration system. What began as an independent exploration became a proposal the organisation believed was worth pursuing.</p>
        </div>
        <div className="stats">
          <div><strong>6 / 6</strong><span>Council approval</span></div>
          <div><strong><small>PKR</small> 400,000</strong><span>Approximately raised through SolarPak</span></div>
          <div><strong>200</strong><span>Intended residents · not yet served</span></div>
        </div>
        <p className="implementation-note">A target village has been identified. Implementation is tentatively planned for mid-November 2026, subject to technical verification and contractor arrangements.</p>
      </section>

      <section className="reflection page-width" id="reflection" aria-labelledby="reflection-title">
        <h2 className="chapter-eyebrow" id="reflection-title">What I learned</h2>
        <blockquote>“I chose to explore a different way to use solar energy to help more people.<br/><br/><span>I am still waiting to see whether that risk will pay off.</span>”</blockquote>
        <p className="reflection-learning">I learned that designing a solution and earning the support needed to implement it are two different challenges. The council’s approval is a step forward; implementation and results are still ahead.</p>
        <p className="signature">Ayaan Ahmed</p>
      </section>
    </main>

    <footer className="footer page-width">
      <div><span>PROJECT WATER</span><p>Design. Communicate. Implement.</p></div>
      <a href="/assets/pdf/project-water.pdf" target="_blank" rel="noreferrer">Original artifact <ArrowUpRight size={18} aria-hidden="true"/></a>
      <a className="icon-button" href="#welcome" aria-label="Back to top"><ArrowUp size={21} aria-hidden="true"/></a>
    </footer>
    <dialog aria-label="Explore original Python source" ref={dialog} className="source-dialog" onClose={() => setSourceOpen(false)} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
      {sourceOpen && <CodeViewer source={source} stage={sourceStage} full onClose={() => dialog.current?.close()}/>}
    </dialog>
  </div>;
}
