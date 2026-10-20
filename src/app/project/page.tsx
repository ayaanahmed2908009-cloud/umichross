import type { Metadata } from 'next';
import ProjectWater from '@/components/ProjectWater';

export const metadata: Metadata = { title: 'The complete project — Project Water' };

export default function ProjectPage() {
  return <ProjectWater/>;
}
