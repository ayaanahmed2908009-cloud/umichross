import GuidedPage from '@/components/GuidedPage';

export default function Page() {
  return <GuidedPage next={{ href: '/introduction', label: 'Begin' }} className="welcome-page">
    <div className="guided-copy welcome-copy">
      <p className="guided-eyebrow">University of Michigan Ross · Admissions artifact</p>
      <h1>Hi, Admissions Officer.<br/><span>Here is my artifact.</span></h1>
      <p className="guided-lead">I’m Ayaan Ahmed. This is Project Water.</p>
      <p className="guided-description">A story about an idea I explored, the skills I taught myself, and how I earned the support to take it forward.</p>
    </div>
  </GuidedPage>;
}
