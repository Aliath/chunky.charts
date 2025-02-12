import { FileSection } from '@/components/compounds/file-section';
import { VariablesSection } from '@/components/compounds/variables-section';

export function ParametersSection() {
  return (
    <div className="flex justify-between items-stretch text-sm">
      <FileSection />
      <VariablesSection />
    </div>
  );
}
