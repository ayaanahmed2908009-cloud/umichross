export type SourceRange = { start: number; end: number };

export const animationStages = [
  { title: 'Solar energy', description: 'Sunlight powers the proposed system, independently of the electricity grid.', sourceNote: 'The script highlights the solar-panel geometry.', excerpt: { start: 96, end: 97 } },
  { title: 'Pump activation', description: 'The controller directs energy to the submersible pump.', sourceNote: 'Moving markers represent power travelling along the configured path. This is a visual sequence, not electrical control software.', excerpt: { start: 98, end: 101 } },
  { title: 'Water pumping', description: 'The pump lifts water through the rising main towards storage.', sourceNote: 'Markers move along the rising-main path while the tank is below capacity.', excerpt: { start: 103, end: 106 } },
  { title: 'Backflow prevention', description: 'A non-return valve is intended to prevent water travelling back down the pipe.', sourceNote: 'Stage four highlights the valve and flow-meter geometry together.', excerpt: { start: 107, end: 109 } },
  { title: 'Proposed filtration', description: 'Water passes through a proposed filtration stage before storage. Water safety and filtration performance still require verification.', sourceNote: 'Stage five highlights the filter bodies. Claims in the original captions are preserved in the source, not treated as validated results.', excerpt: { start: 110, end: 112 } },
  { title: 'Storage tank', description: 'The tank fills. A highlighted float switch represents the intended full-tank cutoff.', sourceNote: 'The fill fraction sets the water-body height; reaching capacity highlights the float switch. The script does not simulate an actual pump shutdown.', excerpt: { start: 113, end: 117 } },
  { title: 'Gravity-fed distribution', description: 'Stored water flows towards the taps under gravity.', sourceNote: 'The final stage draws flow markers along the outlet and falling drops at the tap.', excerpt: { start: 118, end: 125 } },
] as const;

// Verified against the unchanged, 143-line original Python file. 1-based, inclusive.
// First ranges are the stage's visible logic; secondary ranges contain its path/body setup.
export const sourceMappings: Record<number, SourceRange[]> = {
  0: [{ start: 96, end: 97 }, { start: 60, end: 60 }],
  1: [{ start: 98, end: 101 }, { start: 57, end: 57 }],
  2: [{ start: 103, end: 106 }, { start: 58, end: 58 }, { start: 69, end: 70 }],
  3: [{ start: 107, end: 109 }, { start: 61, end: 62 }],
  4: [{ start: 110, end: 112 }, { start: 64, end: 68 }],
  5: [{ start: 113, end: 117 }, { start: 102, end: 102 }, { start: 63, end: 63 }, { start: 71, end: 73 }],
  6: [{ start: 118, end: 125 }, { start: 59, end: 59 }],
};

// The original script defines T=42 and SEG=T/7. A video export has not been supplied;
// verify its actual timestamps before configuring videoStageTimes.
export const scriptStageTimes = [0, 6, 12, 18, 24, 30, 36, 42];
export const videoStageTimes: number[] = [];
