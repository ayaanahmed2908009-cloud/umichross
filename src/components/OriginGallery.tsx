import Image from 'next/image';
import type { OriginPhotograph } from '@/data/originPhotographs';

export default function OriginGallery({ photographs }: { photographs: readonly OriginPhotograph[] }) {
  if (photographs.length !== 3) return null;
  return <figure className="origin-gallery" aria-label="Water conditions in Pakistan">
    <div className="origin-gallery-images">
      {photographs.map((photograph, index) => <div className={`origin-photo origin-photo-${index + 1}`} key={photograph.src}>
        <Image src={photograph.src} alt={photograph.alt} width={photograph.width} height={photograph.height} sizes={index === 0 ? '(max-width: 899px) 90vw, 45vw' : '(max-width: 899px) 45vw, 24vw'}/>
      </div>)}
    </div>
    <figcaption>
      <p>Context photographs · Pakistan</p>
      <details className="origin-photo-credits">
        <summary>Sources &amp; photo credits</summary>
        <ol>{photographs.map(photograph => <li key={photograph.src}>
          <a href={photograph.sourceUrl} target="_blank" rel="noreferrer">{photograph.title}</a>
          <p>{photograph.author} · {photograph.year}<br/><a href={photograph.licenseUrl} target="_blank" rel="noreferrer">{photograph.license}</a></p>
        </li>)}</ol>
        <p>Displayed in grayscale. These photographs provide context; they do not document Project Water.</p>
      </details>
    </figcaption>
  </figure>;
}
