import { Pause, Play } from 'lucide-react';
import { HeaderCard } from '@/components/compounds/header-card';
import { LabeledInput } from '@/components/compounds/labeled-input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useChartSettings } from '@/hooks/use-chart-settings';
import { usePlayerOperations } from '@/hooks/use-player-operations';
import { useUploadedFile } from '@/hooks/use-uploaded-file';

export function VariablesSection() {
  const { playing, toggle, onIncreaseIntervalChange, onIncreaseValueChange, increaseInterval, increaseValue } =
    usePlayerOperations();
  const { windowSize, leftEdgeIndex, onWindowSizeChange, onLeftEdgeIndexChange } = useChartSettings();
  const { isDataReady, totalRecords } = useUploadedFile();

  return (
    <div className="flex items-stretch gap-4">
      <HeaderCard>
        <LabeledInput
          value={windowSize}
          onChange={onWindowSizeChange}
          className="w-44"
          prefix="N"
          tooltip="Window Size"
          type="number"
          min="1"
          max={totalRecords}
          disabled={!isDataReady}
        />
        <LabeledInput
          value={leftEdgeIndex}
          onChange={onLeftEdgeIndexChange}
          className="w-44"
          prefix="S"
          tooltip="Left Index"
          type="number"
          min="0"
          max={Math.max(0, totalRecords - 1)}
          disabled={playing || !isDataReady}
        />
      </HeaderCard>

      <HeaderCard>
        <LabeledInput
          value={increaseInterval}
          onChange={onIncreaseIntervalChange}
          className="w-28"
          prefix="T"
          tooltip="Increase Interval (ms)"
          type="number"
          min="16"
          disabled={!isDataReady}
        />
        <LabeledInput
          value={increaseValue}
          onChange={onIncreaseValueChange}
          className="w-28"
          prefix="P"
          tooltip="Increase Value"
          type="number"
          disabled={!isDataReady}
        />

        <Separator orientation="vertical" />

        <Button onClick={toggle} className="min-w-28" variant={playing ? 'outline' : 'default'} disabled={!isDataReady}>
          {playing ? (
            <>
              <Pause /> Pause
            </>
          ) : (
            <>
              <Play /> Start
            </>
          )}
        </Button>
      </HeaderCard>
    </div>
  );
}
