import type { ReactNode } from 'react';

export default function StoryChapter({ id, dark = false, children, className = '' }: {
  id: string; dark?: boolean; children: ReactNode; className?: string;
}) {
  return <section id={id} aria-labelledby={`${id}-title`} className={`story-chapter ${dark ? 'story-chapter-dark' : ''} ${className}`}>
    <div className="chapter-content page-width">{children}</div>
  </section>;
}
