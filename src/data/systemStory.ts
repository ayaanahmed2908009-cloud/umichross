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
    label: 'Filter water',
    title: 'Filter the water.',
    explanation: 'Water passes through a filter before it enters the storage tank. Filtration is a core part of the proposed system, alongside reliable access to water.',
    start: 4 / 7,
  },
  {
    label: 'Store water',
    title: 'Keep water in reserve.',
    explanation: 'After filtration, water collects in a raised tank. The idea is to keep filtered water in reserve before it is needed at the taps.',
    start: 5 / 7,
  },
  {
    label: 'Reach the taps',
    title: 'Let gravity do the rest.',
    explanation: 'Stored, filtered water flows from the tank to the taps under gravity. The proposed system is intended for a target village of approximately 200 residents; it has not yet been installed.',
    start: 6 / 7,
  },
] as const;
