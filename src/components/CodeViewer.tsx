'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, Check, Copy, Maximize2, Search, X } from 'lucide-react';
import { animationAssets } from '@/lib/animationAssets';
import { animationStages, sourceMappings } from '@/data/animationStages';
export type SourceData = { text: string | null; loading: boolean; error: string | null };
export function useOriginalSource(): SourceData {
 const [data, setData] = useState<SourceData>({ text: null, loading: true, error: null });
 useEffect(() => { const controller = new AbortController(); fetch(animationAssets.source, { signal: controller.signal }).then(async r => {
 if (r.status === 404) return setData({ text: null, loading: false, error: null });
 if (!r.ok) throw new Error('The source file could not be loaded.');
 const text = await r.text(); setData({ text, loading: false, error: null });
 }).catch(e => { if(e.name !== 'AbortError') setData({ text: null, loading: false, error: e.message }); }); return () => controller.abort(); }, []);
 return data;
}
export default function CodeViewer({ source, stage = 0, full = false, onExpand, onClose }: { source: SourceData; stage?: number; full?: boolean; onExpand?: () => void; onClose?: () => void }) {
 const [query,setQuery] = useState(''); const [match,setMatch] = useState(0); const [line,setLine] = useState(''); const [copied,setCopied] = useState(false); const [message,setMessage] = useState('');
 const [tokens,setTokens] = useState<Array<Array<{ content: string; color?: string }>>>([]);
 const viewport = useRef<HTMLDivElement>(null); const [scrollTop,setScrollTop] = useState(0);
 const lines = source.text?.split('\n') ?? []; const matches = query ? lines.flatMap((l,i) => l.toLowerCase().includes(query.toLowerCase()) ? [i] : []) : [];
 const ranges = sourceMappings[stage] ?? [];
 useEffect(() => { if(source.text === null) return; let live = true;
 import('shiki').then(m => m.codeToTokens(source.text!, { lang: 'python', theme: 'github-dark' })).then(result => { if(live) setTokens(result.tokens); }).catch(() => { /* Plain complete source stays available if highlighting fails. */ });
 return () => { live=false; }; },[source.text]);
 const jump = (n: number) => { if(viewport.current) viewport.current.scrollTop = Math.max(0,n) * 25; };
 useEffect(() => { if(ranges.length) jump(ranges[0].start-1); }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps
 const search = (q:string) => { setQuery(q); setMatch(0); const index=lines.findIndex(l => l.toLowerCase().includes(q.toLowerCase())); if(q && index>=0) jump(index); };
 const start = Math.max(0,Math.floor(scrollTop/25)-8); const end = Math.min(lines.length,start+(full?65:40));
 return <div className={`code-viewer ${full?'full-source':''}`}>
 <div className="editor-tab"><span className="file-mark">PY</span><span>{animationAssets.sourceFilename}</span><span className="editor-status">{source.text !== null ? 'ORIGINAL SOURCE' : 'SOURCE PENDING'}</span>{onExpand && <button onClick={onExpand} aria-label="Expand full source"><Maximize2 size={15}/></button>}{onClose && <button onClick={onClose} aria-label="Close source viewer"><X size={20}/></button>}</div>
 <div className="editor-toolbar"><label className="source-search"><Search size={14}/><input aria-label="Search Python source" placeholder="Search source" value={query} onChange={e=>search(e.target.value)} disabled={source.text===null}/></label><button disabled={!matches.length} onClick={()=>{ const next=(match+1)%matches.length;setMatch(next);jump(matches[next]);}} aria-label="Next search result">{matches.length ? `${match+1}/${matches.length}` : '0 matches'}</button><button disabled={source.text===null} onClick={async()=>{try { await navigator.clipboard.writeText(source.text!);setCopied(true);setTimeout(()=>setCopied(false),2000); }catch{setMessage('Copy unavailable. Select the source or download the file.');}}} aria-label="Copy complete source">{copied?<Check size={15}/>:<Copy size={15}/>}</button>{source.text!==null ? <a href={animationAssets.source} download aria-label="Download original Python file"><ArrowDownToLine size={15}/></a>:<button disabled aria-label="Download unavailable until original source is supplied"><ArrowDownToLine size={15}/></button>}</div>
 {source.text===null ? <div className="pending-source"><span className="large-file">.py</span><h4>{source.loading?'Loading source…':source.error?'Source unavailable':'Source file pending'}</h4><p>{source.error ?? 'The original animation was written with the Fusion 360 Python API. The complete file has not yet been supplied.'}</p><div className="pending-rule"/><p className="mono small">No reconstructed code.<br/>No invented line mappings.</p>{full&&<a className="text-link" href="/assets/pdf/project-water.pdf" target="_blank" rel="noreferrer">View source screenshot in the artifact ↗</a>}</div> : <div className="source-viewport" tabIndex={0} ref={viewport} onScroll={e=>setScrollTop(e.currentTarget.scrollTop)} aria-label="Complete Python source"><div style={{height:lines.length*25,position:'relative',minWidth:'max-content'}}>{lines.slice(start,end).map((content,index)=>{const i=start+index; const selected=ranges.some(r=>i+1>=r.start&&i+1<=r.end); return <div key={i} className={`source-line ${selected?'selected':''} ${matches.includes(i)?'search-match':''}`} style={{position:'absolute',top:i*25,height:25}}><span className="line-number">{i+1}</span><code>{tokens[i] ? tokens[i].map((t,k)=><span style={{color:t.color}} key={k}>{t.content}</span>):content || ' '}</code></div>;})}</div></div>}
 <div className="editor-footer"><span>{ranges.length ? `${animationStages[stage].title} · ${ranges.map(r=>`L${r.start}–${r.end}`).join(', ')}`:'Stage mapping pending original source'}</span><span>PYTHON / UTF-8</span></div>
 {full&&source.text!==null&&<div className="source-jump"><label>Jump to line <input type="number" min="1" max={lines.length} value={line} onChange={e=>setLine(e.target.value)}/></label><button onClick={()=>jump(Math.min(lines.length,Math.max(1,Number(line)||1))-1)}>Go</button><select aria-label="Jump to animation stage source" defaultValue="" onChange={e=>{const r=sourceMappings[Number(e.target.value)]; if(r?.length){jump(r[0].start-1);setMessage('');}else setMessage('No verified source mapping is available for this stage.');}}><option value="" disabled>Jump to stage</option>{animationStages.map((s,i)=><option value={i} key={s.title}>{s.title}</option>)}</select></div>}
 <span role="status" className="source-message">{message}</span>
 </div>;
}
