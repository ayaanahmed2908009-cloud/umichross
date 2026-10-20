'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Maximize2, Pause, Play, RotateCcw } from 'lucide-react';
import SystemDiagram from './SystemDiagram';
import { animationAssets } from '@/lib/animationAssets';
import { videoStageTimes } from '@/data/animationStages';
import { systemStory } from '@/data/systemStory';

export function EngineeringVisual({ progress, annotations = false, playing = false, speed = 1, onVideoFailure, onDuration }: {
  progress: number; annotations?: boolean; playing?: boolean; speed?: number;
  onVideoFailure?: () => void; onDuration?: (seconds: number) => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const targetTime = useRef(0);
  useEffect(() => {
    const v = video.current;
    if (!v || !Number.isFinite(v.duration) || playing) return;
    const part = Math.min(progress * 7, 6.9999);
    const i = Math.floor(part);
    const time = videoStageTimes.length === 8
      ? videoStageTimes[i] + (videoStageTimes[i + 1] - videoStageTimes[i]) * (part - i)
      : progress * v.duration;
    targetTime.current = time;
    if (Math.abs(v.currentTime - time) > .08 && !v.seeking) v.currentTime = time;
  }, [progress, playing]);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.playbackRate = speed;
    if (playing) v.play().catch(() => { setFailed(true); onVideoFailure?.(); });
    else v.pause();
  }, [playing, speed, onVideoFailure]);
  if (animationAssets.mode === 'video' && !failed) return <div className="video-visual">
    <video ref={video} src={animationAssets.video} preload="metadata" playsInline muted
      onSeeked={() => { const v = video.current; if (v && !playing && Math.abs(v.currentTime - targetTime.current) > .08) v.currentTime = targetTime.current; }}
      onLoadedMetadata={() => { const v = video.current; if (v) { targetTime.current = progress * v.duration; v.currentTime = targetTime.current; onDuration?.(v.duration); } }}
      onError={() => { setFailed(true); onVideoFailure?.(); }} aria-label="Original Project Water animation"/>
  </div>;
  return <SystemDiagram progress={progress} annotations={annotations}/>;
}

export default function Simulation({ onSource }: { onSource: (stage: number) => void }) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [duration, setDuration] = useState(animationAssets.duration);
  const [error, setError] = useState('');
  const player = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const phase = progress >= systemStory[2].start ? 2 : progress >= systemStory[1].start ? 1 : 0;
  const current = systemStory[phase];
  const sourceStage = Math.min(6, Math.floor(progress * 7));

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => {
    if (!playing) return;
    let id: number; let last = 0;
    const frame = (now: number) => {
      if (last) {
        const next = Math.min(1, progressRef.current + Math.min(.1, (now - last) / 1000) / duration * speed);
        progressRef.current = next; setProgress(next);
        if (next === 1) { setPlaying(false); return; }
      }
      last = now; id = requestAnimationFrame(frame);
    };
    id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, [playing, speed, duration]);

  const seek = (value: number) => {
    setPlaying(false);
    progressRef.current = value; setProgress(value);
  };

  return <div className="walkthrough">
    <div className="page-width overview-content">
      <div className="simulation-heading">
        <h2>The idea, in three steps.</h2>
        <p>Choose a step, or watch the overview.</p>
      </div>
      <div className="simulation-player" ref={player}>
        <div className="simulation-layout">
          <div className="simulation-visual">
            <EngineeringVisual progress={progress} annotations={false} playing={playing} speed={speed} onDuration={setDuration} onVideoFailure={() => setError('The original video is unavailable. This illustration shows the concept.')}/>
          </div>
          <div className="stage-panel">
            <div className="overview-steps" role="group" aria-label="Explore the idea">
              {systemStory.map((step, index) => <button key={step.label} aria-pressed={phase === index} onClick={() => seek(step.start + .0001)}>{step.label}</button>)}
            </div>
            <div className="stage-copy" aria-live="polite"><h3>{current.title}</h3><p>{current.explanation}</p></div>
          </div>
        </div>
        <div className="player-controls">
          <button className="play-button" aria-label={playing ? 'Pause overview' : 'Play overview'} onClick={() => { if (progress >= 1) { progressRef.current = 0; setProgress(0); } setPlaying(!playing); }}>{playing ? <Pause size={17} aria-hidden="true"/> : <Play size={17} aria-hidden="true"/>}<span>{playing ? 'Pause' : 'Watch the overview'}</span></button>
          <input type="range" aria-label="Overview timeline" aria-valuetext={`${current.label}, ${Math.round(progress * 100)}% through the overview`} min="0" max="1" step="0.001" value={progress} onChange={e => seek(Number(e.target.value))}/>
          <button className="icon-button" aria-label="Restart overview" onClick={() => seek(0)}><RotateCcw size={18} aria-hidden="true"/></button>
        </div>
      </div>
      <p className="simulation-footnote">{animationAssets.mode === 'conceptual' ? 'An illustration of the proposed system. Implementation is still planned.' : 'Original animation export.'}</p>
      <details className="supporting-work">
        <summary>Supporting work <span>Optional</span></summary>
        <p>I wrote the original animation in Python, a programming language. You can explore the source or read my original project artifact here.</p>
        <div className="supporting-links">
          <button className="text-link" onClick={() => onSource(sourceStage)}>View original Python source <ArrowUpRight size={17} aria-hidden="true"/></button>
          <a className="text-link" href="/assets/pdf/project-water.pdf" target="_blank" rel="noreferrer">Read the original artifact <ArrowUpRight size={17} aria-hidden="true"/></a>
        </div>
        <p className="supporting-note">The original script runs inside Autodesk Fusion 360. The illustration above is a separate browser interpretation of the concept.</p>
        <div className="advanced-playback">
          <label>Playback speed <select aria-label="Playback speed" value={speed} onChange={e => setSpeed(Number(e.target.value))}>{[.5, 1, 1.5, 2].map(value => <option key={value} value={value}>{value}×</option>)}</select></label>
          <button className="text-link" onClick={async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await player.current?.requestFullscreen(); } catch { setError('Full-screen mode is unavailable in this browser.'); } }}><Maximize2 size={17} aria-hidden="true"/>Full screen</button>
        </div>
      </details>
      <p role="status" className="player-error">{error}</p>
    </div>
  </div>;
}
