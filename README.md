# Project Water

A quiet, monochrome engineering portfolio for Ayaan Ahmed / SolarPak. Next.js App Router, React, TypeScript, Tailwind CSS, GSAP ScrollTrigger, Shiki, and Lucide. No external services, environment variables, or database are required.

## Run and deploy

Use Node.js 22+ (validated with Node 24).

```sh
npm ci
npm run dev
```

Production: `npm run build`, then `npm start`. On Railway, connect this repository’s `main` branch, build with `npm run build`, and start with `npm start`; Next.js reads Railway’s injected `PORT` and the start script binds to `0.0.0.0`. Deploy the latest source commit after changes and verify the deployed commit in Railway. Importing into Vercel with its default Next.js settings also works. Stop local production servers before rebuilding so they do not serve stale bundles.

## Original Python source

The supplied, 143-line script is preserved **byte for byte** at `public/assets/python/SolarPak_Flow_Animation.py`. The source viewer supports full-file search, stage jumps, jump to line, copy, and exact-file download. Rendering is virtualized for larger replacement files. Only the Python grammar and one grayscale-displayed Shiki theme load when the full viewer opens.

To replace it, add the original file at that path, or change `source` and `sourceFilename` in `src/lib/animationAssets.ts`. Anything in `public` is downloadable; inspect replacement files for private information first.

The script uses `adsk.core` and `adsk.fusion` and runs **inside Autodesk Fusion 360 with its matching CAD document**. The website displays the source; it does not execute Autodesk APIs. The script refers to model bodies by name, including solar panels, valves, meters, filters, a float switch, water, and borehole casing.

## Stage mappings

`src/data/animationStages.ts` contains verified **1-based, inclusive** ranges from the supplied file. Each stage has a short displayed excerpt and multiple highlighted ranges covering the relevant visual logic and path/body setup. The complete viewer can jump to any stage. Recheck all mappings when replacing or editing the Python file.

The original script uses a 42-second timeline divided into seven six-second stages. The browser overview takes 14 seconds at its default speed, following the same internal sequence and visual tank-fill formula with all state derived from normalized progress. This presentation duration is configured in `src/lib/animationAssets.ts` and does not alter the original Python file or its stage timings. The main story groups these into four everyday concepts; original source inspection is optional. It is clearly labeled as a separate browser visualization. Highlighted Python functions depict energy, water, and geometry; they are not hardware control software or verified engineering performance.

## Original video and CAD assets

The six-page artifact lives at `public/assets/pdf/project-water.pdf`. Extracted CAD and animation screenshots are optimized grayscale WebP assets. Original animation frames remain in `public/assets/animation/` for future use without crowding the main page.

For a video export:

1. Add `public/assets/animation/project-water.mp4` (or a WebM).
2. Set `mode: 'video'` and the correct path in `src/lib/animationAssets.ts`.
3. Set eight verified second-based boundaries in `videoStageTimes` for the seven stages, including start and end. `scriptStageTimes` records the script's six-second boundaries; verify the actual export before reusing them.
4. Test seeking on target browsers. Frequent keyframes and front-loaded MP4 metadata improve scrubbing. If no boundaries are provided, the renderer uses equal segments of the video duration. It falls back to the labeled schematic if the file fails to load.

The PDF contains screenshots, not 3D geometry. The optional `animationAssets.model` path is reserved for `public/assets/cad/project-water.glb`. Once compatible geometry is supplied, add a lazy Three.js/React Three Fiber adapter to `EngineeringVisual` in `src/components/Simulation.tsx`, keeping the source viewer separate. A genuine model viewer is not currently bundled, and adding a GLB alone does not activate it.

## Presentation and accessibility

The homepage is one continuous, naturally scrolling admissions story: a white welcome, black introduction, origin, design, communication, a simple system overview, approval, and reflection. The reflection uses conversational first-person paragraphs without quotation marks. A full-height black closing section reads “TO BE IMPLEMENTED MID NOVEMBER 2026” in large, bold white capitals, with the footer continuing the black background. The opening chapters have no page gates or required Next buttons. Large headings and 18–22px main body text make the story readable on mobile and desktop.

The origin section includes three real, openly licensed context photographs from Pakistan in a responsive rounded gallery. Original JPEGs are hosted locally in `public/assets/images/pakistan/`; their full framing is preserved and CSS displays them in grayscale. `src/data/originPhotographs.ts` records accessible descriptions, dates, creators, and source/license links. The gallery's “Sources & photo credits” disclosure and `public/assets/images/pakistan/CREDITS.md` provide attribution. These historical photographs are context, not evidence of Project Water or its target village.

The story emphasizes both water access and filtration from the introduction through the outcome. The design section opens with the plain-language system explanation, followed by the applicant's learning experience. A decision section presents the applicant's stated choice between funding installations as usual and exploring a different use of solar energy. The reflection preserves the applicant's stated uncertainty about whether that risk will pay off; council approval is distinguished from future implementation and results. The system overview has four plain-language choices: use sunlight, filter water, store water, and reach the taps. Filtration has its own visible step before storage and a label on the diagram. Original seven-stage diagram state is preserved underneath; `src/data/systemStory.ts` defines the four presentation groups, and the filtration step starts at the original fifth stage. There are no source excerpts, function names, line numbers, or engineering controls in the main presentation. The complete source remains available through the collapsed “Supporting work” section, with its verified seven-stage mappings intact. Playback is user-controlled; no section forces a long pinned scroll.

Old `/introduction`, `/origin`, and `/design` links redirect to their matching homepage anchors. `/project` remains an alias for the complete story. The page has no top navigation bar or fixed-header scroll offset. Native links, document scrolling, and reduced-motion support work without page transitions. The optional source dialog provides keyboard focus containment, Escape dismissal, and focus restoration.

Immediately after “Choosing where to invest,” `InvestmentChoice` invites readers to choose between funding installations and developing a new system. A minimal SVG road branches toward the two accessible buttons; selecting a path highlights its road and reveals a personal response and an optional link to the system overview. Readers can change their choice or continue scrolling without choosing. Selection is held only in component memory; it is not saved, submitted, or tracked.

The artifact documents unanimous 6/6 council approval, approximately PKR 400,000 raised through SolarPak, and approximately 200 intended residents. Implementation is tentatively planned for mid-November 2026, subject to technical verification and contractor arrangements. Neither installation nor drinking-water safety is claimed. Original claims inside the unchanged source and PDF are evidence of the concept, not independently verified specifications.

## Validation

```sh
npm run build
npm run typecheck
npx playwright install chromium
npm run test:e2e
```

An existing system Chromium can be used with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`. The suite starts its own fresh production server on port 3100 and checks the continuous desktop/mobile story, legacy chapter links, four-step overview and playback, filtration-to-source mapping, reduced motion, exact source copy/download, search, and large-file virtualization. Python is syntax-checked without importing or executing Autodesk APIs; original Fusion 360 execution and video/3D playback require their corresponding software/assets.
