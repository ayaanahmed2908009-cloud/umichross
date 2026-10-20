'use client';

import { useState } from 'react';
import { ArrowDownRight } from 'lucide-react';

const paths = [
  {
    id: 'installations',
    title: 'Fund installations',
    description: 'Continue the installation work we already do.',
    road: 'M500 24V76C500 155 250 138 250 236',
    response: 'You’d fund installations.',
    reflection: 'You’d continue the work already under way. I chose to explore Project Water: a new pumping and filtration system whose impact is still to be seen.',
  },
  {
    id: 'system',
    title: 'Develop a new system',
    description: 'Explore solar-powered pumping and filtration.',
    road: 'M500 24V76C500 155 750 138 750 236',
    response: 'That’s the path I chose.',
    reflection: 'I wanted to use solar energy in a different way to help more people. I’m still waiting to see if that risk will pay off.',
  },
] as const;

export default function InvestmentChoice() {
  const [selected, setSelected] = useState<typeof paths[number]['id'] | null>(null);
  const choice = paths.find(path => path.id === selected);

  return <section className="investment-choice page-width" id="investment-choice" aria-labelledby="investment-choice-title">
    <h2 id="investment-choice-title">What would you choose?</h2>
    <div className="investment-paths">
      <svg className="investment-roads" viewBox="0 0 1000 260" aria-hidden="true" focusable="false">
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {paths.map(path => <path key={`edge-${path.id}`} d={path.road} className="investment-road-edge"/>)}
          {paths.map(path => <path key={`surface-${path.id}`} d={path.road} className="investment-road-surface"/>)}
          {paths.map(path => <path key={`marking-${path.id}`} d={path.road} className="investment-road-marking"/>)}
          {choice && <>
            <path d={choice.road} className="investment-road-selected"/>
            <path d={choice.road} className="investment-road-marking investment-road-marking-selected"/>
          </>}
        </g>
      </svg>
      <div className="investment-options" role="group" aria-labelledby="investment-choice-title">
        {paths.map((path, index) => <button
          key={path.id}
          className="investment-option"
          type="button"
          aria-pressed={selected === path.id}
          aria-labelledby={`investment-${path.id}-title`}
          aria-describedby={`investment-${path.id}-description`}
          onClick={() => setSelected(path.id)}
        >
          <span className="investment-option-number" aria-hidden="true">0{index + 1}</span>
          <span className="investment-option-title" id={`investment-${path.id}-title`}>{path.title}</span>
          <span className="investment-option-description" id={`investment-${path.id}-description`}>{path.description}</span>
        </button>)}
      </div>
    </div>
    <div className="investment-response" aria-live="polite" aria-atomic="true">
      {choice ? <>
        <h3>{choice.response}</h3>
        <p>{choice.reflection}</p>
        <a className="text-link" href="#simulation">See the system I developed <ArrowDownRight size={19} aria-hidden="true"/></a>
      </> : <p className="investment-prompt">Choose the path you would take.</p>}
    </div>
  </section>;
}
