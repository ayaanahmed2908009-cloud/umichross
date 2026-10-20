import type { Metadata } from 'next';
import GuidedPage from '@/components/GuidedPage';

export const metadata: Metadata = { title: 'The origin story — Project Water' };

export default function OriginPage() {
  return <GuidedPage back="/introduction" next={{ href: '/design', label: 'Next: The design' }} className="origin-page">
    <div className="guided-copy">
      <p className="guided-eyebrow">The origin story</p>
      <h1>It started with<br/>a question.</h1>
      <div className="guided-prose">
        <p>Through my work with SolarPak, I saw how solar energy could help homes facing unreliable electricity. Access to water was another challenge in the communities we served.</p>
        <p className="guided-question">What if the same energy could help bring water to a community?</p>
        <p>I began exploring a system that could pump water into a raised tank, then use gravity to carry it to taps. I wanted to see whether it could work independently of an unreliable electricity grid.</p>
      </div>
    </div>
  </GuidedPage>;
}
