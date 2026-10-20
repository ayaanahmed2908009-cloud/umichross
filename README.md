# Project Water

A quiet, monochrome engineering portfolio for Ayaan Ahmed / SolarPak. Next.js App Router, React, TypeScript, Tailwind CSS, GSAP ScrollTrigger, Shiki, and Lucide. No external services, environment variables, or database are required.

## Run and deploy

Use Node.js 22+ (validated with Node 24).

```sh
npm ci
npm run dev
```

Production: `npm run build`, then `npm start`. Import the repository into Vercel with its default Next.js settings to deploy. Stop production servers before rebuilding so they do not serve stale bundles.

## Original Python source

The supplied, 143-line script is preserved **byte for byte** at `public/assets/python/SolarPak_Flow_Animation.py`. The source viewer supports full-file search, stage jumps, jump to line, copy, and exact-file download. Rendering is virtualized for larger replacement files. Only the Python grammar and one grayscale-displayed Shiki theme load when the full viewer opens.

To replace it, add the original file at that path, or change `source` and `sourceFilename` in `src/lib/animationAssets.ts`. Anything in `public` is downloadable; inspect replacement files for private information first.

The script uses `adsk.core` and `adsk.fusion` and runs **inside Autodesk Fusion 360 with its matching CAD document**. The website displays the source; it does not execute Autodesk APIs. The script refers to model bodies by name, including solar panels, valves, meters, filters, a float switch, water, and borehole casing.

## Stage mappings

`src/data/animationStages.ts` contains verified **1-based, inclusive** ranges from the supplied file. Each stage has a short displayed excerpt and multiple highlighted ranges covering the relevant visual logic and path/body setup. The complete viewer can jump to any stage. Recheck all mappings when replacing or editing the Python file.

The original script uses a 42-second timeline divided into seven six-second stages. The browser diagram follows the same conceptual sequence and visual tank-fill formula, with all state derived from normalized progress. It is clearly labeled as a separate browser visualization. Highlighted Python functions depict energy, water, and geometry; they are not hardware control software or verified engineering performance.

## Original video and CAD assets

The six-page artifact lives at `public/assets/pdf/project-water.pdf`. Extracted CAD and animation screenshots are optimized grayscale WebP assets. Original animation frames remain in `public/assets/animation/` for future use without crowding the main page.

For a video export:

1. Add `public/assets/animation/project-water.mp4` (or a WebM).
2. Set `mode: 'video'` and the correct path in `src/lib/animationAssets.ts`.
3. Set eight verified second-based boundaries in `videoStageTimes` for the seven stages, including start and end. `scriptStageTimes` records the script's six-second boundaries; verify the actual export before reusing them.
4. Test seeking on target browsers. Frequent keyframes and front-loaded MP4 metadata improve scrubbing. If no boundaries are provided, the renderer uses equal segments of the video duration. It falls back to the labeled schematic if the file fails to load.

The PDF contains screenshots, not 3D geometry. The optional `animationAssets.model` path is reserved for `public/assets/cad/project-water.glb`. Once compatible geometry is supplied, add a lazy Three.js/React Three Fiber adapter to `EngineeringVisual` in `src/components/Simulation.tsx`, keeping the source viewer separate. A genuine model viewer is not currently bundled, and adding a GLB alone does not activate it.

## Presentation and accessibility

The main page uses one CAD image and one unified animation player. Desktop scrolling and player controls share one progress value. Mobile, short viewports, and reduced-motion settings use explicit stage navigation without a long pinned section. Source excerpts and advanced playback controls can be collapsed; the full source lives in a separate native dialog with keyboard focus containment, Escape dismissal, and focus restoration.

The artifact documents unanimous 6/6 council approval, approximately PKR 400,000 raised through SolarPak, and approximately 200 intended residents. Implementation is tentatively planned for mid-November 2026, subject to technical verification and contractor arrangements. Neither installation nor drinking-water safety is claimed. Original claims inside the unchanged source and PDF are evidence of the concept, not independently verified specifications.

## Validation

```sh
npm run build
npm run typecheck
npx playwright install chromium
npm run test:e2e
```

An existing system Chromium can be used with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`. The suite starts its own fresh production server on port 3100 and checks reverse scrolling, stage-to-source mapping, playback, mobile/reduced-motion layouts, exact source copy/download, search, and large-file virtualization. Python is syntax-checked without importing or executing Autodesk APIs; original Fusion 360 execution and video/3D playback require their corresponding software/assets.
