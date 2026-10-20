# Project Water

A monochrome interactive engineering portfolio for Ayaan Ahmed / SolarPak. Next.js App Router, React, TypeScript, Tailwind CSS, GSAP ScrollTrigger, Shiki and Lucide. Uses original visuals extracted from the supplied six-page artifact. No external services, credentials or database required.

## Run and deploy

Use Node.js 22 or newer (validated with Node 24).

```sh
npm ci
npm run dev
```

Production: `npm run build`, then `npm start`. For Vercel, import this repository, select the Next.js preset, and use the defaults. No environment variables required. Deployment/publication has not been performed by this implementation.

## Original Python file

Place the complete original file at `public/assets/python/SolarPak_Flow_Animation.py`. For another name, edit `source` and `sourceFilename` in `src/lib/animationAssets.ts`. Restart the production server or redeploy after adding files. The viewer fetches only this explicit public path, preserves complete source and indentation, and downloads the same original file. Search and jump to line operate across the entire source; virtualized rendering keeps large files usable. Highlighting is lazy and grayscale. Missing files produce an honest pending state, not fabricated code.

Anything under `public` is downloadable: inspect the original Python file for private information before adding it. This site does not execute Python or Autodesk APIs in the browser.

## Source-to-stage mapping

Inspect the original source before editing `src/data/animationStages.ts`. Add verified **1-based inclusive** ranges to `sourceMappings`, keyed by stage index 0–6. Multiple ranges per stage are supported. Example structure only: `stageIndex: [{ start: verifiedStart, end: verifiedEnd }]`. Leave a stage unmapped if it cannot be associated with particular lines. Mapping drives source highlighting, scroll position and stage jumps independently of the visualization. No line numbers or function names have been inferred from the screenshot.

## Original video

Add `public/assets/animation/project-water.mp4` (or a WebM) and set `mode: 'video'` in `src/lib/animationAssets.ts`. Change `video` if needed. Supply eight verified second-based boundaries for the seven stages in `videoStageTimes`, including the first and final time. If no boundaries are provided, the viewer uses equal segments of the actual video duration without claiming source correspondence. Export with frequent keyframes and a front-loaded MP4 metadata atom for accurate seeking. Verify scrub behavior on target devices. The renderer falls back to the labeled concept schematic if video loading fails. Native videos are displayed in grayscale to preserve the design system.

## Compatible CAD model

The original PDF provides screenshots, not 3D geometry. Do not present them as rotatable models. An optional future GLB can be placed at `public/assets/cad/project-water.glb`; its configured path is reserved in `animationAssets.model`. A genuine 3D renderer is deliberately **not bundled or enabled** without a compatible asset. When geometry is supplied, add a lazy Three.js/React Three Fiber adapter inside `EngineeringVisual` in `src/components/Simulation.tsx`; reuse the normalized progress and stage metadata. Preserve the supplied geometry, use actual object names for component mapping, and add orbit/zoom/reset controls. Keep the source viewer separate. Merely adding a GLB does not activate a model viewer.

## Animation and accessibility

A single GSAP ScrollTrigger system coordinates desktop scrolling. A normalized progress maps to seven conceptual stages and then to source ranges, component emphasis, flow, tank level and stage copy. Desktop transitions move from the file reveal through the split view to an expanded system. All scroll-controlled visuals derive from progress and reverse when scrolling upward. The independent player uses a separate user-controlled timeline. Mobile and reduced-motion modes use explicit stages and avoid long pinned sequences. Native modal dialogs provide keyboard focus containment, Escape dismissal, and focus restoration.

## Evidence and limitations

The supplied PDF is available at `public/assets/pdf/project-water.pdf`. Its CAD screenshot, original code screenshot and four animation frames are extracted into optimized grayscale WebP files. The interactive schematic is a browser interpretation, **not the original Fusion 360 animation** or a performance model. Exact code/video synchronization awaits those original files.

The artifact documents six-of-six council approval, approximately PKR 400,000 raised through SolarPak campaigns and recurring donor programmes, and approximately 200 intended residents. Implementation is tentatively planned for mid-November 2026, subject to verification and contractor arrangements. No installation or water-safety outcome is claimed. Original panel, storage and filtration annotations are retained as design evidence, not independently verified specifications.

## Validation

`npm run build` includes TypeScript validation. `npm run typecheck` checks types separately. Browser checks cover desktop/mobile navigation, stage selection, reverse scrolling, independent playback, scrubbing, annotation toggles, keyboard dialog dismissal, pending-source behavior, complete-source search/jumps with an intercepted test fixture, and reduced motion. No original Python/video/3D integration can be validated until those files are supplied.

To run the browser suite locally:

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

An existing system Chromium can be used instead via `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`. Stop production servers before rebuilding so they do not serve stale bundle references.
