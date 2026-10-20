'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, Pause, Play, RotateCcw } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SystemDiagram from './SystemDiagram';
import type { SourceData } from './CodeViewer';
import { animationAssets } from '@/lib/animationAssets';
import { animationStages, videoStageTimes } from '@/data/animationStages';

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

export default function Simulation({ source, onSource }: { source: SourceData; onSource: (stage: number) => void }) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [duration, setDuration] = useState(animationAssets.duration);
  const [annotations, setAnnotations] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const walkthrough = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLDivElement>(null);
  const scrollTrigger = useRef<ScrollTrigger | null>(null);
  const progressRef = useRef(0);
  const playingRef = useRef(false);
  const ignoreScrollUntil = useRef(0);
  const stage = Math.min(6, Math.floor(progress * 7));
  const current = animationStages[stage];
  const lines = source.text?.split('\n') ?? [];

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 900px)');
    const update = () => setShowCode(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)', () => {
      scrollTrigger.current = ScrollTrigger.create({
        trigger: walkthrough.current, start: 'top 78px', end: 'bottom bottom',
        onUpdate: self => { if (!playingRef.current && performance.now() > ignoreScrollUntil.current) setProgress(self.progress); },
      });
      return () => { scrollTrigger.current?.kill(); scrollTrigger.current = null; };
    });
    return () => mm.revert();
  }, []);
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
    setPlaying(false); playingRef.current = false;
    progressRef.current = value; setProgress(value);
    const trigger = scrollTrigger.current;
    if (trigger?.isActive) {
      ignoreScrollUntil.current = performance.now() + 300;
      window.scrollTo({ top: trigger.start + value * (trigger.end - trigger.start), behavior: 'instant' });
    }
  };
  const go = (index: number) => seek(Math.max(0, Math.min(6, index)) / 7 + .0001);

  return <div className="walkthrough" ref={walkthrough}>
    <div className="walkthrough-sticky page-width">
      <div className="simulation-heading"><h2>The system,<br className="mobile-break"/> step by step.</h2><p>Scroll to explore, or press play.</p></div>
      <div className="simulation-player" ref={player}>
        <div className="simulation-layout">
          <div className="simulation-visual">
            <EngineeringVisual progress={progress} annotations={annotations} playing={playing} speed={speed} onDuration={setDuration} onVideoFailure={() => setError('Video unavailable. Showing the browser visualization.')}/>
          </div>
          <aside className="stage-panel" aria-label="Current animation stage">
            <div className="stage-switcher">
              <span className="stage-count">{String(stage + 1).padStart(2, '0')} <span>/ 07</span></span>
              <div><button className="icon-button" aria-label="Previous stage" disabled={stage === 0} onClick={() => go(stage - 1)}><ChevronLeft size={17}/></button><button className="icon-button" aria-label="Next stage" disabled={stage === 6} onClick={() => go(stage + 1)}><ChevronRight size={17}/></button></div>
            </div>
            <div className="stage-copy"><h3>{current.title}</h3><p>{current.description}</p></div>
            <div className="stage-source">
              <button className="source-toggle" aria-expanded={showCode} aria-controls="stage-excerpt" onClick={() => setShowCode(!showCode)}>From the original script <span>{showCode ? '−' : '+'}</span></button>
              {showCode && <div id="stage-excerpt">
                {source.text !== null ? <pre className="source-excerpt" aria-label={`Original source excerpt: ${current.title}`}><code>{lines.slice(current.excerpt.start - 1, current.excerpt.end).map((line, i) => <span className="excerpt-line" key={`${stage}-${i}`}><span className="excerpt-number">{current.excerpt.start + i}</span>{line}</span>)}</code></pre> : <p className="excerpt-note">{source.loading ? 'Loading source…' : 'Source unavailable.'}</p>}
                <p className="excerpt-note">{current.sourceNote}</p>
              </div>}
              <button className="text-link source-open" onClick={() => onSource(stage)}>Explore the code <ArrowUpRight size={14}/></button>
            </div>
          </aside>
        </div>
        <div className="player-controls">
          <button className="play-button" aria-label={playing ? 'Pause animation' : 'Play animation'} onClick={() => { if (progress >= 1) { progressRef.current = 0; setProgress(0); } playingRef.current = !playing; setPlaying(!playing); }}>{playing ? <Pause size={14}/> : <Play size={14}/>}<span>{playing ? 'Pause' : 'Play'}</span></button>
          <input type="range" aria-label="Animation timeline" min="0" max="1" step="0.001" value={progress} onChange={e => seek(Number(e.target.value))}/>
          <span className="player-time">{String(Math.floor(progress * duration)).padStart(2, '0')} / {Math.round(duration)}s</span>
          <details className="player-options"><summary aria-label="More playback options">Options</summary><div className="options-popover">
            <label>Playback speed<select aria-label="Playback speed" value={speed} onChange={e => setSpeed(Number(e.target.value))}>{[.5, 1, 1.5, 2].map(s => <option key={s} value={s}>{s}×</option>)}</select></label>
            <label>Stage<select aria-label="Select animation stage" value={stage} onChange={e => go(Number(e.target.value))}>{animationStages.map((s, i) => <option key={s.title} value={i}>{i + 1}. {s.title}</option>)}</select></label>
            <button onClick={() => setAnnotations(!annotations)}>{annotations ? 'Hide annotations' : 'Show annotations'}</button>
            <button onClick={() => seek(0)}><RotateCcw size={13}/>Restart</button>
            <button onClick={async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await player.current?.requestFullscreen(); } catch { setError('Full-screen mode is unavailable in this browser.'); } }}><Maximize2 size={13}/>Full screen</button>
          </div></details>
        </div>
      </div>
      <div className="simulation-footnote"><p>{animationAssets.mode === 'conceptual' ? 'Browser visualization based on the original concept. The Python script runs in Fusion 360.' : 'Original animation export.'}</p><p role="status">{error}</p></div>
    </div>
  </div>;
}
