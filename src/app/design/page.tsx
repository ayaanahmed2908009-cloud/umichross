import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import GuidedPage from '@/components/GuidedPage';
import { animationAssets } from '@/lib/animationAssets';

export const metadata: Metadata = { title: 'Learning to design — Project Water' };

export default function DesignPage() {
  return <GuidedPage back="/origin" next={{ href: '/project#code', label: 'Next: Bringing it to life' }} className="design-chapter">
    <div className="guided-design-layout">
      <div className="guided-copy">
        <p className="guided-eyebrow">The design</p>
        <h1>I had never<br/>used CAD before.</h1>
        <p className="guided-lead">So I taught myself.</p>
        <div className="guided-prose">
          <p>Over two weeks, I learned Autodesk Fusion 360 — a tool for designing objects in 3D — and developed my original water-system concept.</p>
          <p>The idea is simple: solar panels power a pump, water moves into a raised tank, and gravity carries it to taps.</p>
        </div>
        <details className="quiet-details guided-design-details">
          <summary>Explore the engineering details</summary>
          <p>The concept includes piping, a non-return valve to prevent backflow, proposed filtration, and a float switch intended to stop the pump when the tank is full.</p>
          <p>Panel sizing, tank capacity, filtration performance, and contractor specifications remain subject to technical verification.</p>
          <a className="text-link" href="/assets/pdf/project-water.pdf" target="_blank" rel="noreferrer">View the original artifact <ArrowUpRight size={14} aria-hidden="true"/></a>
        </details>
      </div>
      <figure className="guided-design-image">
        <Image src={animationAssets.cad} alt="My original Fusion 360 concept: solar panels above an elevated storage tank, with pumping pipes, proposed filtration and taps" width={1124} height={789} priority sizes="(max-width: 899px) 95vw, 50vw"/>
        <figcaption>My original design · Autodesk Fusion 360</figcaption>
      </figure>
    </div>
  </GuidedPage>;
}
