// Plain-language presentation layered over the original seven-stage visualization.
// The original Python ranges remain untouched in animationStages.ts.
export const systemStory = [
  {
    label: 'Use sunlight',
    title: 'Start with solar energy.',
    explanation: 'Solar panels power a pump that lifts water. I wanted to explore a system that could operate without a reliable electricity grid.',
    start: 0,
  },
  {
    label: 'Store water',
    title: 'Keep water in reserve.',
    explanation: 'Water collects in a raised tank before it reaches the taps. The idea is to hold water before it is needed.',
    start: 5 / 7,
  },
  {
    label: 'Reach the taps',
    title: 'Let gravity do the rest.',
    explanation: 'Water flows from the tank to the taps under gravity. The proposed system is intended for a target village of approximately 200 residents; it has not yet been installed.',
    start: 6 / 7,
  },
] as const;
