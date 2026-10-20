'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, Check, ChevronDown, Copy, Search, X } from 'lucide-react';
import { animationAssets } from '@/lib/animationAssets';
import { animationStages, sourceMappings } from '@/data/animationStages';
import { highlightPython } from '@/lib/highlightPython';

export type SourceData = { text: string | null; loading: boolean; error: string | null };
export function useOriginalSource(): SourceData {
  const [data, setData] = useState<SourceData>({ text: null, loading: true, error: null });
  useEffect(() => {
    const controller = new AbortController();
    fetch(animationAssets.source, { signal: controller.signal }).then(async response => {
      if (response.status === 404) { setData({ text: null, loading: false, error: null }); return; }
      if (!response.ok) throw new Error('The source file could not be loaded.');
      setData({ text: await response.text(), loading: false, error: null });
    }).catch(error => {
      if (error.name !== 'AbortError') setData({ text: null, loading: false, error: error.message });
    });
    return () => controller.abort();
  }, []);
  return data;
}

export default function CodeViewer({ source, stage = 0, full = false, onClose }: {
  source: SourceData; stage?: number; full?: boolean; onClose?: () => void;
}) {
  const [query, setQuery] = useState('');
  const [match, setMatch] = useState(0);
  const [line, setLine] = useState('');
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedStage, setSelectedStage] = useState(stage);
  const [tokens, setTokens] = useState<Array<Array<{ content: string; color?: string }>>>([]);
  const viewport = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const lines = source.text?.split('\n') ?? [];
  const matches = query ? lines.flatMap((text, i) => text.toLowerCase().includes(query.toLowerCase()) ? [i] : []) : [];
  const ranges = sourceMappings[selectedStage] ?? [];

  useEffect(() => {
    if (source.text === null) return;
    let live = true;
    highlightPython(source.text).then(result => { if (live) setTokens(result); }).catch(() => { /* Full plain text remains available if highlighting fails. */ });
    return () => { live = false; };
  }, [source.text]);

  const jump = (index: number) => { if (viewport.current) viewport.current.scrollTop = Math.max(0, index) * 25; };
  useEffect(() => { setSelectedStage(stage); }, [stage]);
  useEffect(() => { if (ranges.length) jump(ranges[0].start - 1); }, [selectedStage, source.text]); // ranges are immutable stage configuration

  const search = (value: string) => {
    setQuery(value); setMatch(0);
    const index = lines.findIndex(text => text.toLowerCase().includes(value.toLowerCase()));
    if (value && index >= 0) jump(index);
  };
  const first = Math.max(0, Math.floor(scrollTop / 25) - 8);
  const last = Math.min(lines.length, first + 70);

  return <div className={`code-viewer ${full ? 'full-source' : ''}`}>
    <div className="editor-tab"><div><span className="editor-label">Original Python source</span><span className="editor-filename">{animationAssets.sourceFilename}</span></div>{onClose && <button autoFocus className="icon-button" onClick={onClose} aria-label="Close source viewer"><X size={21}/></button>}</div>
    <div className="editor-toolbar">
      <label className="source-search"><Search size={16}/><input aria-label="Search Python source" placeholder="Search source" value={query} onChange={e => search(e.target.value)} disabled={source.text === null}/></label>
      <button className="search-next" disabled={!matches.length} onClick={() => { const next = (match + 1) % matches.length; setMatch(next); jump(matches[next]); }} aria-label="Next search result"><span>{matches.length ? `${match + 1} / ${matches.length}` : query ? 'No matches' : ''}</span><ChevronDown size={15}/></button>
      <button className="icon-button" disabled={source.text === null} onClick={async () => { try { await navigator.clipboard.writeText(source.text!); setCopied(true); setMessage('Complete source copied.'); setTimeout(() => setCopied(false), 2000); } catch { setMessage('Copy unavailable. Select the text or download the original file.'); } }} aria-label="Copy complete source">{copied ? <Check size={16}/> : <Copy size={16}/>}</button>
      {source.text !== null ? <a className="icon-button" href={animationAssets.source} download aria-label="Download original Python file"><ArrowDownToLine size={16}/></a> : <button className="icon-button" disabled aria-label="Download unavailable"><ArrowDownToLine size={16}/></button>}
    </div>
    {source.text === null ? <div className="pending-source"><h3>{source.loading ? 'Loading source…' : source.error ? 'Source unavailable' : 'Source file pending'}</h3><p>{source.error ?? 'The original source will appear here when the file is available.'}</p></div> : <div className="source-viewport" tabIndex={0} ref={viewport} onScroll={e => setScrollTop(e.currentTarget.scrollTop)} aria-label="Complete Python source"><div style={{ height: lines.length * 25, position: 'relative', minWidth: 'max-content' }}>{lines.slice(first, last).map((text, index) => {
      const i = first + index;
      const selected = ranges.some(range => i + 1 >= range.start && i + 1 <= range.end);
      return <div key={i} className={`source-line ${selected ? 'selected' : ''} ${matches.includes(i) ? 'search-match' : ''}`} style={{ position: 'absolute', top: i * 25, height: 25 }}><span className="line-number">{i + 1}</span><code>{tokens[i] ? tokens[i].map((token, key) => <span style={{ color: token.color }} key={key}>{token.content}</span>) : text || ' '}</code></div>;
    })}</div></div>}
    {full && source.text !== null && <div className="source-jump"><label>Jump to line <input type="number" min="1" max={lines.length} value={line} onChange={e => setLine(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') jump(Math.min(lines.length, Math.max(1, Number(line) || 1)) - 1); }}/></label><button onClick={() => jump(Math.min(lines.length, Math.max(1, Number(line) || 1)) - 1)}>Go</button><select aria-label="Jump to animation stage source" value={selectedStage} onChange={e => { const next = Number(e.target.value); setSelectedStage(next); const mapping = sourceMappings[next]; if (mapping?.length) { jump(mapping[0].start - 1); setMessage(''); } else setMessage('No verified source mapping is available for this stage.'); }}>{animationStages.map((item, i) => <option value={i} key={item.title}>{i + 1}. {item.title}</option>)}</select></div>}
    <div className="editor-footer"><span>{ranges.length ? `${animationStages[selectedStage].title} · ${ranges.map(range => `L${range.start}–${range.end}`).join(', ')}` : 'No verified stage mapping'}</span><span>Fusion 360 API</span></div>
    <p role="status" className="source-message">{message}</p>
  </div>;
}
