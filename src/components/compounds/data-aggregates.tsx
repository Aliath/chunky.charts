import React from 'react';
import { Separator } from '@/components/ui/separator';
import { useCurrentAggregates } from '@/hooks/use-current-aggregates';
import { BucketData } from '@/lib/downsampling';

const AGGREGATES_PRECISION = 1e6;

export function DataAggregates({ downsampledDataFrame }: { downsampledDataFrame: BucketData[] }) {
  const { min, max, avg, variance } = useCurrentAggregates(downsampledDataFrame);

  const aggregatesToDisplay = [
    { label: 'Min', value: min },
    { label: 'Max', value: max },
    { label: 'Average', value: avg },
    { label: 'Variance', value: variance },
  ];

  return (
    <div className="flex items-center text-neutral-600 justify-center gap-12 text-sm">
      {aggregatesToDisplay.map((aggregate, index, array) => {
        const isLast = array.length - 1 === index;

        return (
          <React.Fragment key={aggregate.label}>
            <div className="flex items-center gap-2">
              {aggregate.label}:
              <div className="text-right w-10">
                {Math.round(aggregate.value * AGGREGATES_PRECISION) / AGGREGATES_PRECISION}
              </div>
            </div>
            {!isLast && <Separator orientation="vertical" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
