import type { Metadata } from 'next';
import GuidedPage from '@/components/GuidedPage';

export const metadata: Metadata = { title: 'Project Water — An introduction' };

export default function IntroductionPage() {
  return <GuidedPage tone="dark" back="/" next={{ href: '/origin', label: 'Next: The origin story' }} className="introduction-page">
    <div className="guided-copy">
      <p className="guided-eyebrow">An independent idea. A shared commitment.</p>
      <h1>PROJECT<br/>WATER.</h1>
      <p className="guided-lead">Could solar energy help a rural community access water more reliably?</p>
      <p className="guided-description">Through SolarPak, I developed an original design, wrote an animation to explain it, and presented it to a six-member council. All six approved the proposal.</p>
      <p className="guided-status">An approved concept. Implementation is still planned.</p>
    </div>
  </GuidedPage>;
}
