import { useAtom } from 'jotai';
import { useChartSettings } from '@/hooks/use-chart-settings';
import { downsample } from '@/lib/downsampling';
import { fileStatusAtom } from '@/state/atoms';

const POINTS_COUNT = 1_000;

export const useDownsampledDataFrame = () => {
  const [uploadedFileStatus] = useAtom(fileStatusAtom);
  const { leftEdgeIndex, windowSize } = useChartSettings();

  if (uploadedFileStatus.status !== 'loaded') {
    throw new Error('expected fully loaded & processed data');
  }

  // i don't think we need useMemo here; the `downsample` already uses LRU
  const cachedDataFrame = downsample({
    data: uploadedFileStatus.data,
    bucketsCount: POINTS_COUNT,
    viewStartIndex: leftEdgeIndex,
    viewEndIndex: leftEdgeIndex + windowSize,
  });

  return cachedDataFrame;
};
