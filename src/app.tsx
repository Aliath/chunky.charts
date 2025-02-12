import { ParametersSection } from '@/components/compounds/parameters-section';
import { VisualizerSection } from '@/components/compounds/visualizer-section';

export function App() {
  return (
    <div className="flex flex-col gap-4 w-[min(80%,1100px)]">
      <ParametersSection />
      <VisualizerSection />
    </div>
  );
}
