export type SourceRange = { start: number; end: number };
export const animationStages = [
 { title: 'Solar energy', label: '01 / CAPTURE', description: 'Solar panels capture energy to power the proposed system independently of the electricity grid.', component: 'Solar array', focus: [50, 14] },
 { title: 'Pump activation', label: '02 / ACTIVATE', description: 'The controller directs power to the pump. This illustrates the intended sequence, not measured electrical performance.', component: 'Controller & pump', focus: [48, 66] },
 { title: 'Water pumping', label: '03 / LIFT', description: 'The submersible pump lifts water through the rising main towards the elevated storage tank.', component: 'Rising main', focus: [53, 74] },
 { title: 'Backflow prevention', label: '04 / PROTECT', description: 'A non-return valve is intended to prevent water from travelling back down the pipe when pumping stops.', component: 'Non-return valve', focus: [53, 63] },
 { title: 'Proposed filtration', label: '05 / FILTER', description: 'The concept includes a filtration stage. Media selection, contaminant removal and water safety require independent technical verification.', component: 'Proposed filter', focus: [53, 82] },
 { title: 'Storage tank', label: '06 / STORE', description: 'Water collects in the elevated tank. The animation concept includes a float switch to stop the pump when the tank is full.', component: 'Tank & float switch', focus: [48, 38] },
 { title: 'Gravity-fed distribution', label: '07 / DISTRIBUTE', description: 'Stored water flows towards the taps under gravity. The proposal aims to support approximately 200 residents; implementation remains planned.', component: 'Outlet & taps', focus: [65, 62] },
] as const;
// Populate only after inspecting the complete original Python file. Lines are 1-based, inclusive.
export const sourceMappings: Record<number, SourceRange[]> = {};
// Optional original-video stage boundaries, in seconds. Replace with verified timings.
export const videoStageTimes: number[] = [];
