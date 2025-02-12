import { ErrorBar, Line, LineChart, XAxis, YAxis } from 'recharts';
import { DataAggregates } from '@/components/compounds/data-aggregates';
import { ChartContainer } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import { useDownsampledDataFrame } from '@/hooks/use-downsampled-data-frame';
import { usePlayerTicker } from '@/hooks/use-player-ticker';

const TICK_FORMATTER = new Intl.NumberFormat('en-US');
const STROKE_COLOR = 'var(--chart-6)';

export function DataChart() {
  const downsampledDataFrame = useDownsampledDataFrame();
  usePlayerTicker();

  const minX = downsampledDataFrame.at(0)?.x ?? -Infinity;
  const maxX = downsampledDataFrame.at(-1)?.x ?? Infinity;

  return (
    <div className="h-full flex flex-col gap-4">
      <ChartContainer className="h-full aspect-auto" config={{}}>
        <LineChart accessibilityLayer data={downsampledDataFrame}>
          <YAxis />
          <XAxis
            domain={[minX, maxX]}
            type="number"
            dataKey="x"
            tickFormatter={(value) => TICK_FORMATTER.format(Math.floor(value))}
          />

          <Line
            dataKey="y"
            type="linear"
            stroke={`hsl(${STROKE_COLOR})`}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          >
            <ErrorBar dataKey="errorY" strokeWidth={2} stroke={`hsla(${STROKE_COLOR}, 0.15)`} />
          </Line>
        </LineChart>
      </ChartContainer>

      <Separator />

      <DataAggregates downsampledDataFrame={downsampledDataFrame} />
    </div>
  );
}
