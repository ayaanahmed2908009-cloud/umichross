'use client';
import { useId } from 'react';
export default function SystemDiagram({ progress, annotations = true }: { progress: number; annotations?: boolean }) {
 const uid = useId().replace(/:/g, '');
 const stage = Math.min(6, Math.floor(progress * 7));
 // Match the original script's visual fill formula (L102), not measured flow.
 const fill = Math.max(.06, Math.min(1, (progress * 7 - 4.6) / 1.2));
 const active = (s: number) => stage === s ? 'diagram-active' : '';
 return <svg viewBox="0 0 760 580" role="img" aria-label="Illustration of the proposed water system: solar panels, a pump, a storage tank and taps" className="system-diagram">
 <defs><clipPath id={`${uid}tank`}><rect x="285" y="190" width="190" height="140" /></clipPath></defs>

 <g fill="none" stroke="currentColor" strokeWidth="1.5">
 <path d="M200 500H590M250 500V340H510V500M265 340V500M495 340V500" opacity=".45" />
 <path d="M280 330H480V185H280ZM270 340H490V330H270Z" />
 <path d="M290 185V150M470 185V150" />
 <g className={active(0)}><path d="M225 90H490L525 150H190Z" fill="currentColor" fillOpacity=".09" /><path d="M218 120H508M275 90L260 150M330 90L325 150M385 90L390 150M440 90L455 150" opacity=".65" /></g>
 <g clipPath={`url(#${uid}tank)`}><rect x="285" y={326 - fill * 130} width="190" height={fill * 130 + 4} fill="currentColor" fillOpacity=".18" /><path d={`M285 ${326 - fill * 130}H475`} strokeWidth="2" /></g>
 <path d="M400 550V280H467" strokeWidth="8" opacity=".12" />
 <path d="M400 550V280H467" strokeWidth="1.5" />
 <g className={active(2)}><path d="M400 550V280H467" strokeWidth="3" pathLength="1" strokeDasharray=".035 .025" strokeDashoffset={-progress * 4} opacity={stage >= 2 && fill < 1 ? .9 : 0} /></g>
 <g className={active(1)}><rect x="386" y="510" width="28" height="40" fill="var(--diagram-bg)" /><path d="M391 520H409M391 527H409M391 534H409" /><rect x="305" y="375" width="45" height="52" fill="var(--diagram-bg)" /><path d="M328 427V458H400" strokeDasharray="4 4" /></g>
 <g className={active(3)}><path d="M390 390L410 410H390L410 390Z" fill="var(--diagram-bg)" /></g>
 <g className={active(4)}><rect x="389" y="442" width="22" height="40" fill="var(--diagram-bg)" /><path d="M392 451H408M392 460H408M392 469H408" /></g>
 <g className={active(5)}><path d="M448 210V270" /><rect x="441" y="220" width="14" height="14" fill={fill > .9 ? 'currentColor' : 'var(--diagram-bg)'} /></g>
 <g className={active(6)}><path d="M475 305H525V428H560V440" strokeWidth="3" /><path d="M545 420H568M554 414V426" /><path d="M557 450V475" strokeDasharray="3 5" strokeDashoffset={-progress * 100} opacity={stage === 6 ? 1 : .15} /><path d="M535 485H585" /></g>
 </g>
 {annotations && <g fill="currentColor" fontFamily="monospace" fontSize="10" letterSpacing="1"><g opacity={stage === 0 ? 1 : .45}><path d="M230 100H125" stroke="currentColor" strokeWidth=".7" /><text x="35" y="104">SOLAR ARRAY</text></g><g opacity={stage === 5 ? 1 : .45}><path d="M480 213H580" stroke="currentColor" strokeWidth=".7" /><text x="590" y="217">STORAGE</text></g><g opacity={stage === 1 ? 1 : .45}><path d="M305 400H160" stroke="currentColor" strokeWidth=".7" /><text x="45" y="404">CONTROLLER</text></g><g opacity={stage === 3 ? 1 : .45}><path d="M410 400H580" stroke="currentColor" strokeWidth=".7" /><text x="590" y="404">NON-RETURN</text><text x="590" y="418">VALVE</text></g><g opacity={stage === 4 ? 1 : .45}><path d="M389 464H160" stroke="currentColor" strokeWidth=".7" /><text x="45" y="468">FILTRATION*</text></g><text x="32" y="560" opacity=".4">CONCEPT SCHEMATIC / NOT TO SCALE</text></g>}
 </svg>;
}
